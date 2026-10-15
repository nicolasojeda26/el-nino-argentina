# El Niño Argentina

Portal informativo sobre el fenómeno de El Niño / La Niña (ENSO) y sus impactos en Argentina.

Sitio estático construido con **Astro**. Los datos del índice ONI se obtienen en tiempo de build desde la API pública de **NOAA / Climate Prediction Center**, con un snapshot local como respaldo (`src/data/oni.ascii.txt`).

## Stack

- Astro 7 (salida estática)
- Sitemap (`@astrojs/sitemap`)
- Content collections para las notas (`src/content/noticias`)
- Gráfico del ONI en SVG generado en build (sin dependencias de JS)

## Comandos

```sh
npm install        # instalar dependencias
npm run dev        # servidor de desarrollo
npm run build      # build de producción (baja datos frescos de NOAA)
npm run preview    # previsualizar el build
npm run check      # typecheck de Astro
```

## Estructura

```
src/
  components/      Header, Footer, OniChart, AdSlot
  data/            oni.ts (datos y estado ENSO), content.ts (contenido del sitio)
  content/noticias Notas en Markdown
  layouts/         Layout base (SEO, OG, JSON-LD)
  pages/           Rutas del sitio
  styles/          global.css
public/            favicon, og.png, robots.txt, _headers
```

## Fuentes de datos

- NOAA · Climate Prediction Center (ONI): https://www.cpc.ncep.noaa.gov/data/indices/oni.ascii.txt
- IRI · Pronóstico ENSO
- Servicio Meteorológico Nacional (Argentina)
- BOM · ENSO Wrap-Up (Australia)

## Licencia / uso

Contenido informativo. Datos de dominio público (NOAA y otros organismos oficiales).
