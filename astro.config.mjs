// @ts-check
import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';
import fs from 'node:fs';
import path from 'node:path';

/** @type {Record<string, string>} */
const postDates = {};
try {
  const dir = path.resolve('./src/content/noticias');
  for (const file of fs.readdirSync(dir)) {
    if (!file.endsWith('.md')) continue;
    const slug = file.replace(/\.md$/, '');
    const raw = fs.readFileSync(path.join(dir, file), 'utf-8');
    const m = raw.match(/^date:\s*(\d{4}-\d{2}-\d{2})/m);
    if (m) {
      postDates[`/noticias/${slug}/`] = new Date(`${m[1]}T00:00:00Z`).toISOString();
    }
  }
} catch {
  // ignore
}

// https://astro.build/config
export default defineConfig({
  site: 'https://xn--elnio-rta.net.ar',
  trailingSlash: 'always',
  integrations: [
    sitemap({
      filter: (page) => !page.endsWith('/widget/'),
      serialize(item) {
        const url = item.url;
        const pathname = new URL(url).pathname;
        let priority = 0.6;
        /** @type {'daily' | 'weekly' | 'monthly'} */
        let changefreq = 'monthly';

        if (pathname === '/') {
          priority = 1.0;
          changefreq = 'daily';
        } else if (/^\/(pronostico|impactos)\/$/.test(pathname)) {
          priority = 0.9;
          changefreq = 'weekly';
        } else if (/^\/impactos\/.+/.test(pathname)) {
          priority = 0.8;
        } else if (/^\/noticias\//.test(pathname)) {
          priority = 0.7;
        }

        item.priority = priority;
        item.changefreq = /** @type {any} */ (changefreq);
        item.lastmod = postDates[pathname] ?? new Date().toISOString();
        return item;
      },
    }),
  ],
});
