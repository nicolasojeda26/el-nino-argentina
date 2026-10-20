import fs from "node:fs/promises";
import path from "node:path";

const SMN_FEED = "https://ssl.smn.gob.ar/feeds/CAP/rss_alertaCAP_nuevo_2026.xml";
const INA_BASE =
  "https://alerta.ina.gob.ar/geoserver/ows?service=WFS&version=1.1.0&request=GetFeature&outputFormat=application/json&srsName=EPSG:4326&typeName=";
const INA_LAYERS = ["a5:ultimas_alturas_reporte", "a5:ultimos_caudales_reporte"];
const TARGET_FILES = [
  path.resolve("./src/data/alertas.json"),
  path.resolve("./public/data/alertas.json"),
];

const UA = "el-nino-portal/1.0 (+https://xn--elnio-rta.net.ar)";

const decode = (buf) => {
  let text = new TextDecoder("utf-8").decode(buf);
  if (text.includes("\uFFFD")) {
    text = new TextDecoder("iso-8859-1").decode(buf);
  }
  return text;
};

async function getText(url) {
  const res = await fetch(url, {
    signal: AbortSignal.timeout(25000),
    headers: { "user-agent": UA, accept: "application/xml,text/xml,*/*" },
  });
  if (!res.ok) throw new Error(`HTTP ${res.status} en ${url}`);
  return decode(await res.arrayBuffer());
}

async function getJson(url) {
  const res = await fetch(url, {
    signal: AbortSignal.timeout(30000),
    headers: { "user-agent": UA, accept: "application/json" },
  });
  if (!res.ok) throw new Error(`HTTP ${res.status} en ${url}`);
  return JSON.parse(decode(await res.arrayBuffer()));
}

function decodeEntities(value = "") {
  return value
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&quot;/g, '"')
    .replace(/&#39;|&apos;/g, "'")
    .replace(/&nbsp;/g, " ")
    .replace(/&#(\d+);/g, (_, n) => String.fromCodePoint(Number(n)))
    .replace(/&#x([0-9a-f]+);/gi, (_, n) => String.fromCodePoint(parseInt(n, 16)))
    .replace(/&amp;/g, "&");
}

const clean = (value = "") =>
  decodeEntities(value.replace(/<!\[CDATA\[([\s\S]*?)\]\]>/g, "$1").replace(/<[^>]+>/g, " "))
    .replace(/\s+/g, " ")
    .trim();

const tag = (xml, name) => {
  const m = xml.match(new RegExp(`<${name}(?:\\s[^>]*)?>([\\s\\S]*?)</${name}>`, "i"));
  return m ? clean(m[1]) : "";
};

const SEVERITY = {
  Extreme: { rank: 0, level: "rojo", label: "Rojo" },
  Severe: { rank: 1, level: "naranja", label: "Naranja" },
  Moderate: { rank: 2, level: "amarillo", label: "Amarillo" },
  Minor: { rank: 3, level: "verde", label: "Verde" },
  Unknown: { rank: 4, level: "gris", label: "Informativo" },
};

const REGION_NAMES = {
  cordillera: "Cordillera",
  patagonia: "Patagonia",
  pampa: "Pampa",
  pampeana: "Región Pampeana",
  litoral: "Litoral",
  nea: "NEA",
  noa: "NOA",
  cuyo: "Cuyo",
  metropolitana: "AMBA",
  buenosaires: "Buenos Aires",
  centro: "Centro",
  norte: "Norte",
  sur: "Sur",
};

function regionFromUrl(url) {
  const file = url.split("/").pop() ?? "";
  const parts = file.replace(/\.xml$/i, "").split("_");
  const region = parts[3] ?? "";
  if (!region || /^alertas?$/i.test(region) || /^\d+$/.test(region) || /^CAP$/i.test(region)) return "";
  const key = region.toLowerCase().replace(/[^a-z]/g, "");
  return REGION_NAMES[key] ?? region.replace(/([a-z])([A-Z])/g, "$1 $2");
}

function polygonFromCap(value) {
  if (!value) return null;
  const points = value
    .trim()
    .split(/\s+/)
    .map((pair) => pair.split(",").map(Number))
    .filter(([lat, lng]) => Number.isFinite(lat) && Number.isFinite(lng))
    .map(([lat, lng]) => [lng, lat]);
  if (points.length < 3) return null;
  const [firstLng, firstLat] = points[0];
  const [lastLng, lastLat] = points[points.length - 1];
  if (firstLng !== lastLng || firstLat !== lastLat) points.push([firstLng, firstLat]);
  return points;
}

async function fetchSmn() {
  const feed = await getText(SMN_FEED);
  const items = [...feed.matchAll(/<item>([\s\S]*?)<\/item>/gi)].map((m) => m[1]);
  const links = items.map((item) => tag(item, "link")).filter(Boolean);
  const unique = [...new Set(links)];
  console.log(`SMN: ${items.length} avisos, ${unique.length} XML únicos`);

  const alerts = [];
  let cursor = 0;
  const worker = async () => {
    while (cursor < unique.length) {
      const link = unique[cursor++];
      try {
        const xml = await getText(link);
        const severityName = tag(xml, "severity") || "Unknown";
        const severity = SEVERITY[severityName] ?? SEVERITY.Unknown;
        const expires = tag(xml, "expires") || tag(xml, "onset") || "";
        const onset = tag(xml, "onset") || "";
        const event = tag(xml, "event") || "Aviso meteorológico";
        const area = regionFromUrl(link);
        const areaDesc = tag(xml, "areaDesc");
        const description = tag(xml, "description");
        const headline = tag(xml, "headline") || event;
        const instruction = tag(xml, "instruction");
        const polygons = [...xml.matchAll(/<polygon>([\s\S]*?)<\/polygon>/gi)]
          .map((m) => polygonFromCap(clean(m[1])))
          .filter(Boolean);
        const expiresDate = expires ? new Date(expires) : null;
        if (expiresDate && Number.isFinite(expiresDate.getTime()) && expiresDate.getTime() < Date.now() - 30 * 60_000) {
          continue;
        }
        alerts.push({
          id: tag(xml, "identifier") || link,
          event,
          headline,
          description,
          instruction,
          severity: severityName,
          level: severity.level,
          levelLabel: severity.label,
          rank: severity.rank,
          area: area || areaDesc,
          areaDesc,
          onset,
          expires,
          url: link,
          polygons,
        });
      } catch (err) {
        console.warn(`SMN: no se pudo leer ${link}: ${err.message}`);
      }
    }
  };
  await Promise.all(Array.from({ length: 5 }, worker));

  alerts.sort((a, b) => a.rank - b.rank || String(a.expires).localeCompare(String(b.expires)));
  return alerts;
}

async function fetchIna() {
  const out = [];
  for (const layer of INA_LAYERS) {
    const json = await getJson(INA_BASE + encodeURIComponent(layer));
    const kind = layer.includes("caudales") ? "caudal" : "nivel";
    for (const feature of json.features ?? []) {
      const p = feature.properties ?? {};
      const [lon, lat] = feature.geometry?.coordinates ?? [p.x, p.y];
      if (!p.nombre || !Number.isFinite(Number(lat)) || !Number.isFinite(Number(lon))) continue;
      out.push({
        station: p.nombre,
        river: p.rio ?? "",
        kind,
        value: Number(p.valor),
        unit: kind === "caudal" ? "m³/s" : "m",
        status: p.status_text ?? "",
        trend: p.tendencia ?? "",
        alert: p.aviso === "evacuacion" ? "evacuacion" : p.aviso === "alerta" ? "alerta" : "ok",
        percentile: p.percentil ?? null,
        updated: p.fecha_format ?? "",
        lat: Number(lat),
        lon: Number(lon),
        url: p.secciones_url ?? "https://alerta.ina.gob.ar/",
      });
    }
    console.log(`INA ${layer}: ${(json.features ?? []).length} estaciones`);
  }
  const order = { evacuacion: 0, alerta: 1, ok: 2 };
  out.sort((a, b) => (order[a.alert] ?? 9) - (order[b.alert] ?? 9) || a.river.localeCompare(b.river));
  return out;
}

function sameData(a, b) {
  if (!a || !b) return false;
  return JSON.stringify({ smn: a.smn, ina: a.ina }) === JSON.stringify({ smn: b.smn, ina: b.ina });
}

async function main() {
  let previous = null;
  try {
    previous = JSON.parse(await fs.readFile(TARGET_FILES[0], "utf-8"));
  } catch {
    // first run
  }

  let smn = [];
  let ina = [];
  try {
    smn = await fetchSmn();
  } catch (err) {
    console.error(`SMN: fallo la actualización (${err.message}); se conserva la última copia.`);
    smn = previous?.smn ?? [];
  }
  try {
    ina = await fetchIna();
  } catch (err) {
    console.error(`INA: fallo la actualización (${err.message}); se conserva la última copia.`);
    ina = previous?.ina ?? [];
  }

  if (!smn.length && !ina.length) {
    throw new Error("No se obtuvo ningún dato de SMN ni de INA");
  }

  const next = { smn, ina };
  if (sameData(previous, next)) {
    console.log("Sin cambios: alertas.json ya está al día.");
    return;
  }

  const data = {
    generatedAt: new Date().toISOString(),
    sources: {
      smn: SMN_FEED,
      ina: "https://alerta.ina.gob.ar/",
    },
    counts: {
      smn: smn.length,
      smnRed: smn.filter((a) => a.level === "rojo").length,
      smnOrange: smn.filter((a) => a.level === "naranja").length,
      smnYellow: smn.filter((a) => a.level === "amarillo").length,
      inaAlerts: ina.filter((s) => s.alert !== "ok").length,
      inaEvacuation: ina.filter((s) => s.alert === "evacuacion").length,
      inaStations: ina.length,
    },
    smn,
    ina,
  };

  for (const file of TARGET_FILES) {
    await fs.mkdir(path.dirname(file), { recursive: true });
    await fs.writeFile(file, JSON.stringify(data, null, 2) + "\n", "utf-8");
  }
  console.log(
    `Actualizado: ${smn.length} avisos SMN (${data.counts.smnRed} rojos, ${data.counts.smnOrange} naranjas, ${data.counts.smnYellow} amarillos) y ${data.counts.inaAlerts} estaciones INA en alerta/evacuación.`,
  );
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
