// @ts-check
import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';

// https://astro.build/config
export default defineConfig({
  site: 'https://xn--elnio-rta.net.ar',
  trailingSlash: 'always',
  integrations: [
    sitemap({
      serialize(item) {
        const url = item.url;
        let priority = 0.6;
        /** @type {'daily' | 'weekly' | 'monthly'} */
        let changefreq = 'monthly';

        if (url === 'https://xn--elnio-rta.net.ar/') {
          priority = 1.0;
          changefreq = 'daily';
        } else if (/\/(pronostico|impactos)\/?$/.test(url)) {
          priority = 0.9;
          changefreq = 'weekly';
        } else if (/\/impactos\/.+/.test(url)) {
          priority = 0.8;
        } else if (/\/noticias/.test(url)) {
          priority = 0.7;
        }

        item.priority = priority;
        item.changefreq = /** @type {any} */ (changefreq);
        item.lastmod = new Date().toISOString();
        return item;
      },
    }),
  ],
});
