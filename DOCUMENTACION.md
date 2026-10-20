# Documentación técnica — El Niño Argentina

**Sitio:** https://elniño.net.ar · (punycode: https://xn--elnio-rta.net.ar)
**Repositorio:** https://github.com/nicolasojeda26/el-nino-argentina (rama `main`)
**Documento actualizado:** 16 de octubre de 2026

---

## 1. Qué es

Portal informativo independiente sobre el fenómeno ENSO (El Niño / La Niña) y sus impactos
en Argentina. Publica estado actual del ONI, pronóstico, impacto por región y provincia,
historia, glosario, notas y herramientas interactivas (simulador de impacto, monitores,
calendario agrícola), además de datos abiertos en JSON/CSV y un widget embebible.

Es un sitio **estático**: no hay base de datos, backend, ni cuentas de usuario. Todo el HTML
se genera por adelantado en el build y se sirve desde la red de Cloudflare.

---

## 2. Dónde está hecha

### 2.1 Entorno de desarrollo

| Ítem | Detalle |
|---|---|
| Repositorio Git | `github.com/nicolasojeda26/el-nino-argentina`, rama `main` |
| Carpeta local | `D:\Proyectos_Dev\WEBMONE` (Windows, PowerShell 5.1) |
| Node.js | `>= 22.22.0` (`package.json` → `engines`) |
| Gestor de paquetes | npm (`package-lock.json` commiteado) |
| Commits | 16, desde el 15/10/2026 (`87ba898 Sitio inicial`) |
| Deploy automático | Cloudflare Workers Builds al hacer push a `main` |

### 2.2 Stack técnico

- **Astro 7.4** con salida estática (SSG). Sin adapter de servidor.
- **TypeScript 6** (`astro check` como typecheck).
- **@astrojs/sitemap 3.7** para sitemap con prioridades.
- **Sin framework de UI**: todos los componentes son `.astro` puros; la interactividad
  (filtros, buscadores, mapas, simuladores, modo oscuro) está escrita en JavaScript/TS
  dentro de los mismos componentes.
- **CSS propio** en `src/styles/global.css` (~2.900 líneas): sistema de diseño
  "papel/tinta", tipografía Archivo + IBM Plex Mono **self-hosted** (`public/fonts/`),
  CSS Grid, media queries, `prefers-reduced-motion`.
- **Contenido**: notas en Markdown con content collections (`src/content/noticias/*.md`).
- **Gráficos**: SVG generado en build (sin librerías de charting).
- **Sin tests unitarios**; la verificación es `npm run check` + `npm run build` + QA visual.

### 2.3 Estructura del proyecto

```
WEBMONE/
├── .github/workflows/
│   ├── update-oni.yml                 # cron lunes y jueves 12:00 UTC
│   └── update-alertas.yml             # cron cada 30 minutos (SMN e INA)
├── scripts/
│   ├── update-oni.mjs                 # descarga el ONI de NOAA y actualiza el snapshot
│   ├── update-alertas.mjs             # descarga SMN/INA y actualiza src/data/alertas.json
│   └── build-argentina-map.mjs        # genera la geometría del mapa
├── public/
│   ├── _headers                       # cabeceras de seguridad y caché (Cloudflare)
│   ├── .well-known/security.txt       # RFC 9116
│   ├── ads.txt                        # autorización de vendedores (AdSense)
│   ├── fonts/                         # Archivo variable + IBM Plex Mono 400/500/600
│   ├── data/argentina-provinces.geojson # 24 provincias para el mapa
│   ├── favicon.svg, favicon.ico, apple-touch-icon.png, og.png
│   ├── robots.txt, site.webmanifest
├── src/
│   ├── components/                    # 17 componentes .astro (Header, Footer, OniChart,
│   │                                  #   AlertTicker, ArgentinaMap, ImpactSimulator,
│   │                                  #   YearLookup, HydroAndesMonitor, AgroCalendar,
│   │                                  #   DataTools, ForecastProbs, ProvinceFinder,
│   │                                  #   AnalogChart, EnsoScale, Sun, Icon, AdSlot)
│   ├── content/noticias/              # 6 notas en Markdown
│   ├── data/
│   │   ├── oni.ts                     # fetch a NOAA + parseo + estado/tendencia/intensidad
│   │   ├── oni.ascii.txt              # snapshot de respaldo (921 líneas)
│   │   ├── alertas.json               # snapshot SMN/INA (fuente canónica)
│   │   ├── content.ts                 # regiones, fuentes, navegación, site, adsSlots
│   │   └── argentina-map.json         # geometría de provincias (fallback SVG)
│   ├── layouts/Layout.astro           # SEO, JSON-LD, OG, fuentes, AdSense, GA4
│   ├── pages/                         # rutas (ver 2.4), incluido admin/index.astro
│   └── styles/global.css
├── astro.config.mjs                   # site, trailingSlash, sitemap
├── package.json
└── AGENTS.md                          # instrucciones para agentes (dev server en background)
```

### 2.4 Rutas generadas (53 páginas)

| Ruta | Tipo | Contenido |
|---|---|---|
| `/` | estática | Home: estado actual, serie ONI, impactos, notas |
| `/pronostico/` | estática | Pronóstico, probabilidades, tabla histórica |
| `/impactos/` | estática | Mapa de Argentina + tarjetas por región |
| `/impactos/[slug]/` | dinámica (5) | Litoral, Pampeana, Cuyo, NOA, Patagonia |
| `/impactos/provincia/[slug]/` | dinámica | Fichas provinciales |
| `/el-nino/`, `/la-nina/` | estática | Guías de cada fase |
| `/historia/` | estática | Catálogo histórico filtrable |
| `/noticias/`, `/noticias/[slug]/` | estática + dinámica (6) | Notas en Markdown |
| `/glosario/` | estática | 20 términos con buscador |
| `/preguntas/` | estática | FAQ |
| `/acerca/`, `/terminos/`, `/cookies/`, `/privacidad/`, `/seguridad/` | estática | Políticas y transparencia |
| `/contacto/` | estática | Contacto |
| `/widget/` | estática | Widget embebible (excluido del sitemap) |
| `/admin/` | estática | Panel privado de GA4 (`noindex, nofollow`, excluido del sitemap) |
| `/datos/oni.json`, `/datos/oni.csv`, `/datos/estado.json`, `/datos/alertas.json` | endpoints estáticos | Datos abiertos generados en build |
| `/rss.xml` | endpoint | Feed de notas |
| `404.html` | estática | Página de error |

### 2.5 Datos del ONI (pipeline)

- **Fuente primaria:** NOAA / NCEP Climate Prediction Center —
  `https://www.cpc.ncep.noaa.gov/data/indices/oni.ascii.txt`.
- **En build:** `getOni()` (`src/data/oni.ts:66`) descarga el archivo con timeout de 15 s,
  valida que contenga `ANOM` y más de 100 líneas, y cae al snapshot local
  `src/data/oni.ascii.txt` si falla la red. El resultado se memoiza por proceso.
- **Automatización:** `.github/workflows/update-oni.yml` corre `npm run update:oni`
  (`scripts/update-oni.mjs`) **lunes y jueves a las 12:00 UTC**, y si hay datos nuevos
  commitea `chore(data): actualizar serie ONI desde NOAA` → push → redeploy automático.
- **Cálculos en `oni.ts`:** estado (El Niño / La Niña / Neutral con umbral ±0,5 °C),
  intensidad (+0,5 / +1,0 / +1,5 °C), tendencia vs. trimestre anterior, récord histórico.
- **Último dato a la fecha:** JAS 2026 = **+2,16 °C**, El Niño "Muy fuerte".

### 2.5.1 Alertas SMN/INA

- **Fuentes:** RSS CAP del SMN (`rss_alertaCAP_nuevo_2026.xml`) y WFS de INA
  (`a5:ultimas_alturas_reporte`, `a5:ultimos_caudales_reporte`).
- **Automatización:** `.github/workflows/update-alertas.yml` corre cada 30 minutos
  `npm run update:alertas`; si cambia `src/data/alertas.json`, commitea y dispara redeploy.
- **Respaldo:** si una fuente falla, el script conserva la última lista válida y no
  reemplaza el snapshot con datos vacíos.
- **Entrega:** `src/pages/datos/alertas.json.ts` compacta el snapshot en build
  (`/datos/alertas.json`, ~229 KB frente a ~658 KB pretty); el mapa lo consume por fetch.
- **Mapa:** `ArgentinaMap.astro` usa MapLibre GL JS 6.15, OpenFreeMap, Mapterhorn DEM y
  `public/data/argentina-provinces.geojson`; el fallback SVG usa `src/data/argentina-map.json`.

### 2.6 SEO y distribución

- `site` en `astro.config.mjs` con **punycode** `https://xn--elnio-rta.net.ar` y
  `trailingSlash: 'always'`.
- Sitemap con prioridades (home 1.0; pronóstico e impactos 0.9; regiones 0.8; notas 0.7) y
  `lastmod` real de cada nota (`astro.config.mjs:29-54`).
- `robots.txt` con `Allow: /` para `Mediapartners-Google` y `AdsBot-Google`;
  `Disallow: /admin/`.
- `Layout.astro`: canonical, Open Graph, Twitter Card, `theme-color`, JSON-LD
  (WebSite, Organization, BreadcrumbList, Dataset, NewsArticle), preload de fuentes,
  `<link rel="sitemap">` y meta `google-site-verification` cuando
  `site.googleSiteVerification` tiene el token.
- `/rss.xml` para las notas.
- `/admin/` se genera con `robots="noindex, nofollow"`, cabecera
  `X-Robots-Tag: noindex, nofollow` y queda excluido del sitemap.
- Search Console: falta verificar la propiedad y enviar `/sitemap-index.xml`; el soporte de
  verificación por meta ya está implementado.

### 2.7 Publicidad (AdSense)

- Publisher: `ca-pub-2347772486638866`.
- Script de AdSense en `Layout.astro` (todas las páginas) + meta `google-adsense-account`.
- `public/ads.txt`:
  `google.com, pub-2347772486638866, DIRECT, f08c47fec0942fa0`.
- `AdSlot.astro`: renderiza el bloque `<ins class="adsbygoogle">` **solo** si el ID de
  unidad es numérico. Los nombres de posición (`home-top`, `pronostico`, `glosario`,
  `noticia`, etc.) se resuelven contra `site.adsSlots` en `src/data/content.ts`, que hoy
  está vacío: no se muestra ningún bloque hasta pegar los IDs de unidad.
- Estado de la cuenta: sitio en revisión ("Debe revisarse"); ads.txt figura "Sin autorizar"
  por una lectura vieja del 15/10 (el archivo actual es correcto).

### 2.8 Seguridad y privacidad

- **Cabeceras** (`public/_headers`, aplicadas en el edge):
  `Content-Security-Policy` (default-src 'self', script/style con 'unsafe-inline', dominios
  de AdSense/Google, GA4/GIS y `static.cloudflareinsights.com`; `object-src 'none'`,
  `frame-ancestors 'self'`, `base-uri 'self'`, `form-action 'self'`,
  `upgrade-insecure-requests`), `Strict-Transport-Security` (1 año, includeSubDomains),
  `Cross-Origin-Opener-Policy: same-origin-allow-popups` (necesario para el popup de
  OAuth del panel), `X-Content-Type-Options: nosniff`,
  `Referrer-Policy: strict-origin-when-cross-origin`,
  `Permissions-Policy` (geolocation/microphone/camera/payment/usb deshabilitados).
- `/.well-known/security.txt` (RFC 9116) con contacto y política de divulgación.
- Páginas de privacidad, cookies, términos, acerca y seguridad.
- Sin cuentas propias, formularios ni base de datos. El panel `/admin/` usa OAuth de Google
  y solo lee métricas agregadas de GA4.
- Analítica: **Google Analytics 4** con cookies `_ga`/`_ga_*`, IP anonimizada y panel de
  administración client-side.
- Páginas legales y CSP documentadas en el propio sitio (`/seguridad/`).

### 2.9 Panel de tráfico (`/admin/`)

- Página estática y privada (`noindex`, fuera del sitemap, `X-Robots-Tag`).
- Login con **Google Identity Services** (`initTokenClient`) y scope
  `https://www.googleapis.com/auth/analytics.readonly`; el token vive solo en la pestaña.
- Consulta **GA4 Data API** (`runReport` y `runRealtimeReport`): usuarios, sesiones,
  páginas vistas, interacción, tendencia de 28 días, top páginas, origen/medio, países,
  dispositivos y usuarios en tiempo real.
- Configuración en `site.analytics`: `gaMeasurementId`, `gaPropertyId` y
  `googleOAuthClientId`. Sin Property ID y Client ID, el panel muestra una guía de setup.
- No hay backend ni secretos: el Client ID de OAuth es público y el acceso lo controla
  la cuenta de Google con permiso sobre la propiedad GA4.
- El panel se renderiza con `analytics={false}` para no cargar GA4 ni contaminar la
  medición con las visitas del administrador.

---

## 3. Dónde está alojada

### 3.1 Plataforma

| Ítem | Detalle |
|---|---|
| Hosting | **Cloudflare Workers** con **Static Assets** (no es Pages ni Vercel/Netlify) |
| Proyecto/Worker | `el-nino-argentina` (configurado en el dashboard de Cloudflare) |
| Build & deploy | **Workers Builds**: push a `main` → `npm run build` → publica `dist/` |
| Config de build | En el dashboard (no hay `wrangler.toml`/`wrangler.jsonc` en el repo) |
| Tiempo de deploy | ~1 minuto desde el push |
| Artefacto | `dist/`: 53 páginas, ~4 MB |

### 3.2 Red y DNS

- DNS gestionado por **Cloudflare**:
  `kianchau.ns.cloudflare.com` y `daphne.ns.cloudflare.com`.
- Registros del apex `xn--elnio-rta.net.ar` → IPs de Cloudflare
  `104.21.35.170`, `172.67.178.13` (+ IPv6 `2606:4700:...`).
- `www.xn--elnio-rta.net.ar` también resuelve a Cloudflare y responde el sitio
  (hoy **sin redirección** a apex).
- CDN: `CF-Cache-Status: HIT` observado; HTTP/3 habilitado (`Alt-Svc: h3`).
- TLS: certificado gestionado por Cloudflare; HSTS aplicado por cabecera.
- **Pendiente:** "Always Use HTTPS" y redirect www→apex (requieren acceso al dashboard).

### 3.3 Dominio y correo

- Dominio: **elniño.net.ar** (IDN). El TLD `.net.ar` se registra ante **NIC Argentina**;
  la delegación DNS está en Cloudflare.
- Las URLs internas y el canonical usan punycode (`xn--elnio-rta.net.ar`).
- **No hay buzón de correo del dominio.** El contacto público es
  `litoraldevctes@gmail.com` (`site.email` en `src/data/content.ts`).

### 3.4 Caché (definida en `public/_headers`)

| Ruta | Política |
|---|---|
| HTML | `public, max-age=0, must-revalidate` (revalidación en cada visita) |
| `/_astro/*` | `public, max-age=31536000, immutable` |
| `/fonts/*` | `public, max-age=31536000, immutable` |
| `/*.png` | `public, max-age=604800` (7 días) |
| `/datos/*` | `Access-Control-Allow-Origin: *` (datos abiertos) |
| `/datos/alertas.json` | `public, max-age=900` (15 minutos) |
| `/admin/*` | `X-Robots-Tag: noindex, nofollow` |
| `/sitemap-index.xml` | `public, max-age=3600` |

### 3.5 Flujo de una visita

1. DNS → Cloudflare (nameservers del dominio).
2. CDN de Cloudflare sirve el asset desde el edge (HTML revalida; assets con hash inmutables).
3. El Worker `el-nino-argentina` entrega los archivos estáticos de `dist/`.
4. El navegador carga fuentes locales, Google Analytics 4 (si
   `gaMeasurementId` está configurado) y el script de AdSense (si está aprobado).

---

## 4. Servicios externos

| Servicio | Uso |
|---|---|
| NOAA / CPC | Serie ONI (fuente de verdad; build + workflow) |
| IRI | Pronóstico ENSO (contenido citado) |
| SMN | Contexto y alertas oficiales (CAP RSS) |
| INA | Alturas y caudales de estaciones (WFS) |
| BOM (Australia) | ENSO Wrap-Up (contenido citado) |
| GitHub | Código, Actions (ONI y alertas) y disparador de deploy |
| Cloudflare | DNS, CDN, TLS, Workers Builds, Static Assets |
| Google AdSense | Monetización (cuenta en revisión) |
| Google Analytics 4 / Search Console | Medición de audiencia y indexación |
| OpenFreeMap / OpenStreetMap | Teselas base del mapa (ODbL) |
| Mapterhorn / Copernicus DEM | Relieve del mapa |
| Natural Earth | Geometría del mapa (dominio público) |

---

## 5. Operación

### 5.1 Comandos locales

```powershell
npm install        # dependencias
npm run dev        # desarrollo (en background: astro dev --background)
npm run build      # build de producción (descarga ONI fresco de NOAA)
npm run preview    # sirve dist/ localmente
npm run check      # typecheck (astro check)
npm run update:oni # actualiza src/data/oni.ascii.txt desde NOAA
npm run update:alertas # actualiza src/data/alertas.json desde SMN e INA
```

### 5.2 Publicar cambios

1. Commit en `main` y `git push origin main`.
2. Cloudflare Workers Builds compila y despliega (~1 min).
3. Verificación sugerida: `astro check`, `npm run build`, status 200 de las rutas tocadas,
   cabeceras de seguridad y consola del navegador sin errores CSP.

### 5.3 Publicar una nota

Crear `src/content/noticias/<slug>.md` con el frontmatter de la colección (título, fecha,
tag, resumen, autor). Aparece automáticamente en `/noticias/`, el RSS y el sitemap.

### 5.4 Activar anuncios

1. En AdSense: crear unidades de anuncio (display) y copiar sus IDs numéricos.
2. Pegarlos en `site.adsSlots` (`src/data/content.ts`), por posición:
   `home-top`, `pronostico`, `glosario`, `historia`, `faq`, `el-nino`, `la-nina`,
   `impactos`, `noticias`, `noticia`, `impactos-litoral`, `impactos-pampeana`,
   `impactos-cuyo`, `impactos-noa`, `impactos-patagonia`.
3. Rebuild/deploy. Sin aprobación de la cuenta no se muestran anuncios igualmente.
4. Alternativa sin código: activar **Anuncios automáticos** en AdSense (el script ya está
   en todas las páginas).

### 5.5 Activar analítica y Search Console

1. Crear una propiedad **GA4** y copiar el Measurement ID (`G-...`) y el Property ID
   (número) en `site.analytics` (`src/data/content.ts`).
2. En Google Cloud Console habilitar **Google Analytics Data API** y crear un **OAuth
   Client ID** de tipo aplicación web con origen autorizado
   `https://xn--elnio-rta.net.ar`; pegarlo en `googleOAuthClientId`. Si la app OAuth está
   en modo prueba, agregar la cuenta como usuario de prueba.
3. Verificar el dominio en **Search Console** con la etiqueta HTML y pegar el token en
   `site.googleSiteVerification`.
4. Rebuild/deploy, abrir `/admin/`, iniciar sesión con una cuenta con acceso a la propiedad
   y enviar `https://xn--elnio-rta.net.ar/sitemap-index.xml` en Search Console.
5. Revisar que `/admin/` no aparezca en el sitemap y que la consola no tenga errores CSP.

### 5.6 Verificación post-deploy

- `curl -I https://xn--elnio-rta.net.ar/` → CSP, HSTS, COOP presentes.
- `https://xn--elnio-rta.net.ar/.well-known/security.txt` → 200.
- `https://xn--elnio-rta.net.ar/ads.txt` → 200 con la línea de Google.
- `https://xn--elnio-rta.net.ar/admin/` → `X-Robots-Tag: noindex, nofollow` y
  `Cross-Origin-Opener-Policy: same-origin-allow-popups` (global).
- Consola del navegador: sin "Refused to" (CSP) ni errores JS.

---

## 6. Estado actual y pendientes

**Funcionando:** sitio completo (53 páginas), datos ONI en vivo con respaldo y workflow
automático, alertas SMN/INA cada 30 minutos, mapa MapLibre con fallback SVG, SEO técnico,
herramientas, API JSON/CSV, widget, políticas legales, cabeceras de seguridad y
`security.txt`.

**Pendientes (requieren dashboard de Google/Cloudflare):**

1. AdSense: en Sitios → `xn--elnio-rta.net.ar` → **Buscar actualizaciones** para refrescar
   el ads.txt y luego **Solicitar revisión**. La revisión puede tardar de días a semanas.
2. AdSense: crear unidades y pegar IDs en `site.adsSlots` (o activar Auto ads).
3. GA4: crear propiedad, OAuth Client ID y pegar IDs en `site.analytics`.
4. Search Console: verificar dominio, pegar token y enviar el sitemap.
5. Cloudflare: activar **Always Use HTTPS** (hoy `http://` responde 200 sin redirigir).
6. Cloudflare: decidir si `www` redirige al apex (hoy ambos responden).

---

## 7. Archivos clave

| Archivo | Rol |
|---|---|
| `astro.config.mjs` | URL del sitio, trailing slash, sitemap y prioridades |
| `src/layouts/Layout.astro` | `<head>`: SEO, JSON-LD, OG, fuentes, AdSense, GA4 |
| `src/pages/admin/index.astro` | Panel privado de GA4 con OAuth y Data API |
| `src/components/ArgentinaMap.astro` | Mapa MapLibre, alertas, fallback y popups |
| `src/components/AlertTicker.astro` | Barra global de alertas SMN/INA |
| `src/data/oni.ts` | Obtención y cálculo de estado/tendencia/intensidad |
| `src/data/content.ts` | `site` (email, AdSense, analytics, adsSlots), regiones, fuentes, nav |
| `src/pages/datos/alertas.json.ts` | Endpoint compacto de alertas |
| `src/styles/global.css` | Sistema de diseño completo (papel/tinta, responsive, dark mode) |
| `src/components/AdSlot.astro` | Resolución de IDs de anuncio desde `site.adsSlots` |
| `public/_headers` | CSP, HSTS, COOP, Permissions-Policy, CORS y caché |
| `.github/workflows/update-oni.yml` | Actualización automática de la serie ONI |
| `.github/workflows/update-alertas.yml` | Actualización automática SMN/INA cada 30 min |
| `scripts/update-oni.mjs` | Descarga y validación del ONI desde NOAA |
