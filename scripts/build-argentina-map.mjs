// Genera src/data/argentina-map.json a partir de Natural Earth (dominio público).
// Uso: node scripts/build-argentina-map.mjs
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, "..");
const CACHE = "C:/Users/Usuario/AppData/Local/Temp/opencode/ne10-admin1.geojson";
const OUT = path.join(ROOT, "src", "data", "argentina-map.json");
const NE_URL =
  "https://raw.githubusercontent.com/nvkelso/natural-earth-vector/master/geojson/ne_10m_admin_1_states_provinces.geojson";

const REGION = {
  Misiones: "litoral",
  Corrientes: "litoral",
  Chaco: "litoral",
  Formosa: "litoral",
  "Entre Ríos": "litoral",
  "Buenos Aires": "pampeana",
  "Ciudad de Buenos Aires": "pampeana",
  Córdoba: "pampeana",
  "Santa Fe": "pampeana",
  "La Pampa": "pampeana",
  Mendoza: "cuyo",
  "San Juan": "cuyo",
  "San Luis": "cuyo",
  Salta: "noa",
  Jujuy: "noa",
  Tucumán: "noa",
  Catamarca: "noa",
  "La Rioja": "noa",
  "Santiago del Estero": "noa",
  Neuquén: "patagonia",
  "Río Negro": "patagonia",
  Chubut: "patagonia",
  "Santa Cruz": "patagonia",
  "Tierra del Fuego": "patagonia",
};

const DISPLAY = { "Ciudad de Buenos Aires": "Ciudad de Buenos Aires" };

async function load() {
  if (fs.existsSync(CACHE)) return JSON.parse(fs.readFileSync(CACHE, "utf8"));
  const res = await fetch(NE_URL);
  const text = await res.text();
  fs.writeFileSync(CACHE, text);
  return JSON.parse(text);
}

function polygons(geom) {
  return geom.type === "Polygon" ? [geom.coordinates] : geom.coordinates;
}

// Ramer–Douglas–Peucker
function rdp(points, eps) {
  if (points.length < 3) return points;
  const first = points[0];
  const last = points[points.length - 1];
  let index = -1;
  let maxDist = 0;
  for (let i = 1; i < points.length - 1; i++) {
    const d = perpDist(points[i], first, last);
    if (d > maxDist) {
      maxDist = d;
      index = i;
    }
  }
  if (maxDist > eps) {
    const left = rdp(points.slice(0, index + 1), eps);
    const right = rdp(points.slice(index), eps);
    return left.slice(0, -1).concat(right);
  }
  return [first, last];
}

function perpDist(p, a, b) {
  const dx = b[0] - a[0];
  const dy = b[1] - a[1];
  const len = Math.hypot(dx, dy) || 1e-9;
  return Math.abs((p[0] - a[0]) * dy - (p[1] - a[1]) * dx) / len;
}

function fmt(n) {
  return Math.round(n * 10) / 10;
}

const gj = await load();
const feats = gj.features.filter((f) => f.properties.admin === "Argentina");

// Projection: equirectangular con corrección de latitud + ajuste a viewBox.
const LAT0 = (-38 * Math.PI) / 180;
const KX = Math.cos(LAT0);
const proj = ([lon, lat]) => [lon * KX, -lat];

let minX = Infinity,
  minY = Infinity,
  maxX = -Infinity,
  maxY = -Infinity;
for (const f of feats)
  for (const p of polygons(f.geometry))
    for (const ring of p)
      for (const c of ring) {
        const [x, y] = proj(c);
        if (x < minX) minX = x;
        if (x > maxX) maxX = x;
        if (y < minY) minY = y;
        if (y > maxY) maxY = y;
      }

const PAD = 14;
const TARGET_H = 1180;
const scale = (TARGET_H - PAD * 2) / (maxY - minY);
const W = Math.round((maxX - minX) * scale + PAD * 2);
const H = TARGET_H;
const toSvg = ([lon, lat]) => {
  const [x, y] = proj([lon, lat]);
  return [PAD + (x - minX) * scale, PAD + (y - minY) * scale];
};

const provinces = [];
for (const f of feats) {
  const src = f.properties.name;
  const name = DISPLAY[src] ?? src;
  const region = REGION[name] ?? REGION[src];
  if (!region) throw new Error("Sin región para: " + src);
  const eps = 0.35;
  let d = "";
  for (const p of polygons(f.geometry)) {
    for (const ring of p) {
      let ringPts = ring.map((c) => toSvg(c));
      const a = ringPts[0];
      const b = ringPts[ringPts.length - 1];
      if (ringPts.length > 1 && a[0] === b[0] && a[1] === b[1]) ringPts = ringPts.slice(0, -1);
      const pts = rdp(ringPts, eps).map(([x, y]) => [fmt(x), fmt(y)]);
      if (pts.length < 3) continue;
      d += `M${pts[0][0]} ${pts[0][1]}`;
      for (let i = 1; i < pts.length; i++) d += `L${pts[i][0]} ${pts[i][1]}`;
      d += "Z";
    }
  }
  provinces.push({ name, region, d });
}

provinces.sort((a, b) => a.name.localeCompare(b.name, "es"));

const out = {
  source: "Natural Earth 1:10m admin-1 (public domain)",
  viewBox: `0 0 ${W} ${H}`,
  width: W,
  height: H,
  provinces,
};
fs.mkdirSync(path.dirname(OUT), { recursive: true });
fs.writeFileSync(OUT, JSON.stringify(out));
const bytes = fs.statSync(OUT).size;
console.log(
  `OK: ${provinces.length} provincias · viewBox ${out.viewBox} · ${(bytes / 1024).toFixed(1)} KB`
);
