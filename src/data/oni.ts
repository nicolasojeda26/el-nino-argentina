import fallbackRaw from "./oni.ascii.txt?raw";

/**
 * ONI (Oceanic Niño Index) — fuente oficial: NOAA / NCEP Climate Prediction Center.
 * https://www.cpc.ncep.noaa.gov/data/indices/oni.ascii.txt
 *
 * El ONI es el promedio móvil de 3 meses de la anomalía de temperatura
 * superficial del mar (SST) en la región Niño 3.4 (ERSST.v5).
 */

export const ONI_SOURCE_URL = "https://www.cpc.ncep.noaa.gov/data/indices/oni.ascii.txt";

export interface OniPoint {
  season: string;
  year: number;
  total: number;
  anomaly: number;
}

export type EnsoState = "El Niño" | "La Niña" | "Neutral";
export type Trend = "subiendo" | "bajando" | "estable";

const SEASONS = [
  "DJF", "JFM", "FMA", "MAM", "AMJ", "MJJ",
  "JJA", "JAS", "ASO", "SON", "OND", "NDJ",
] as const;

const SEASON_LABELS: Record<string, string> = {
  DJF: "dic–ene–feb",
  JFM: "ene–feb–mar",
  FMA: "feb–mar–abr",
  MAM: "mar–abr–may",
  AMJ: "abr–may–jun",
  MJJ: "may–jun–jul",
  JJA: "jun–jul–ago",
  JAS: "jul–ago–sep",
  ASO: "ago–sep–oct",
  SON: "sep–oct–nov",
  OND: "oct–nov–dic",
  NDJ: "nov–dic–ene",
};

export function seasonLabel(season: string): string {
  return SEASON_LABELS[season] ?? season;
}

export function parseOni(text: string): OniPoint[] {
  const points: OniPoint[] = [];
  for (const line of text.split(/\r?\n/)) {
    const parts = line.trim().split(/\s+/);
    if (parts.length < 4) continue;
    const season = parts[0];
    if (!(SEASONS as readonly string[]).includes(season)) continue;
    const year = Number(parts[1]);
    const total = Number(parts[2]);
    const anomaly = Number(parts[3]);
    if (!Number.isFinite(year) || !Number.isFinite(anomaly)) continue;
    points.push({ season, year, total, anomaly });
  }
  return points;
}

let cached: OniPoint[] | null = null;

/** Descarga el ONI en vivo y cae al archivo local (2026) si falla la red. */
export async function getOni(): Promise<OniPoint[]> {
  if (cached) return cached;
  let text = fallbackRaw;
  try {
    const res = await fetch(ONI_SOURCE_URL, {
      signal: AbortSignal.timeout(15000),
      headers: { "user-agent": "el-nino-portal/1.0 (+build)" },
    });
    if (res.ok) {
      const live = await res.text();
      if (live.includes("ANOM") && live.trim().split(/\r?\n/).length > 100) {
        text = live;
      }
    }
  } catch {
    // sin red: usamos el snapshot local incluido
  }
  cached = parseOni(text);
  return cached;
}

export interface EnsoStatus {
  latest: OniPoint;
  previous: OniPoint;
  yearAgo: OniPoint;
  state: EnsoState;
  intensity: string;
  delta: number;
  trend: Trend;
  recent: OniPoint[];
  history: OniPoint[];
}

export function classify(value: number): { state: EnsoState; intensity: string } {
  const a = Math.abs(value);
  const state: EnsoState = value >= 0.5 ? "El Niño" : value <= -0.5 ? "La Niña" : "Neutral";
  let intensity = "Débil";
  if (a >= 2.0) intensity = "Muy fuerte";
  else if (a >= 1.5) intensity = "Fuerte";
  else if (a >= 1.0) intensity = "Moderado";
  else if (a >= 0.5) intensity = "Débil";
  else intensity = "Neutro";
  return { state, intensity };
}

export function buildStatus(points: OniPoint[]): EnsoStatus {
  const latest = points[points.length - 1];
  const previous = points[points.length - 2] ?? latest;
  const yearAgo = points[points.length - 13] ?? points[0];
  const delta = latest.anomaly - previous.anomaly;
  const { state, intensity } = classify(latest.anomaly);
  const trend: Trend = delta > 0.05 ? "subiendo" : delta < -0.05 ? "bajando" : "estable";
  return {
    latest,
    previous,
    yearAgo,
    state,
    intensity,
    delta,
    trend,
    recent: points.slice(-12),
    history: points,
  };
}

export function formatAnomaly(v: number): string {
  return `${v >= 0 ? "+" : "−"}${Math.abs(v).toFixed(2)}`;
}
