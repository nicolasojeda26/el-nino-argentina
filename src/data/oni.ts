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

/** Segundo jueves de un mes dado (0-indexed). */
function secondThursday(year: number, month: number): Date {
  const first = new Date(Date.UTC(year, month, 1, 15, 0, 0));
  const day = first.getUTCDay(); // 0 = Sun ... 4 = Thu
  const offsetToFirstThu = (4 - day + 7) % 7;
  const secondThuDay = 1 + offsetToFirstThu + 7;
  return new Date(Date.UTC(year, month, secondThuDay, 15, 0, 0));
}

/** Calcula la fecha del próximo boletín mensual de NOAA (segundo jueves de cada mes). */
export function getNextNoaaRelease(now: Date = new Date()): {
  date: Date;
  shortLabel: string;
  daysLeft: number;
} {
  let target = secondThursday(now.getUTCFullYear(), now.getUTCMonth());
  if (target.getTime() <= now.getTime()) {
    const nextMonth = now.getUTCMonth() + 1;
    const y = now.getUTCFullYear() + (nextMonth > 11 ? 1 : 0);
    const m = nextMonth % 12;
    target = secondThursday(y, m);
  }
  const diffMs = target.getTime() - now.getTime();
  const daysLeft = Math.max(1, Math.ceil(diffMs / (1000 * 60 * 60 * 24)));
  const shortLabel = new Intl.DateTimeFormat("es-AR", {
    day: "numeric",
    month: "short",
  }).format(target);
  return { date: target, shortLabel, daysLeft };
}

export interface SeasonProb {
  season: string;
  periodLabel: string;
  year: number;
  nino: number;
  neutral: number;
  nina: number;
  dominant: EnsoState;
}

/**
 * Genera el abanico de probabilidades trimestrales para los próximos 6 trimestres
 * móviles a partir del estado, anomalía y tendencia actual del ONI.
 */
export function getForecastProbabilities(points: OniPoint[]): SeasonProb[] {
  const s = buildStatus(points);
  const startIdx = SEASONS.indexOf(s.latest.season as (typeof SEASONS)[number]);
  const baseIdx = startIdx >= 0 ? startIdx : 0;
  let currentYear = s.latest.year;

  const result: SeasonProb[] = [];
  let projectedAnom = s.latest.anomaly + s.delta * 0.35;

  for (let step = 1; step <= 6; step++) {
    const idx = (baseIdx + step) % 12;
    const season = SEASONS[idx];
    if (idx === 0) currentYear++;

    // Amortiguamiento gradual hacia la media climatológica (persistencia primaveral/otoñal)
    projectedAnom = projectedAnom * 0.78;

    let nino = 33;
    let neutral = 34;
    let nina = 33;

    if (projectedAnom >= 0.25) {
      const strength = Math.min(1, projectedAnom / 1.8);
      nino = Math.round(45 + strength * 47);
      nina = Math.max(2, Math.round(12 - strength * 10));
      neutral = 100 - nino - nina;
    } else if (projectedAnom <= -0.25) {
      const strength = Math.min(1, Math.abs(projectedAnom) / 1.6);
      nina = Math.round(45 + strength * 45);
      nino = Math.max(2, Math.round(12 - strength * 10));
      neutral = 100 - nina - nino;
    } else {
      neutral = Math.round(54 - Math.abs(projectedAnom) * 30);
      nino = Math.round((100 - neutral) / 2 + projectedAnom * 35);
      nina = 100 - neutral - nino;
    }

    const dominant: EnsoState =
      nino >= neutral && nino >= nina
        ? "El Niño"
        : nina >= neutral && nina >= nino
          ? "La Niña"
          : "Neutral";

    result.push({
      season,
      periodLabel: seasonLabel(season),
      year: currentYear,
      nino,
      neutral,
      nina,
      dominant,
    });
  }

  return result;
}

export interface AnalogSeries {
  id: string;
  label: string;
  tag: string;
  color: string;
  isCurrent?: boolean;
  defaultActive: boolean;
  values: (number | null)[];
}

export const ANALOG_SEASONS: readonly string[] = SEASONS;

/**
 * Devuelve las curvas trimestrales (DJF a NDJ) de años históricos emblemáticos
 * junto con el año en curso para el comparador de Años Análogos.
 */
export function getAnalogSeries(points: OniPoint[]): AnalogSeries[] {
  const byYearSeason = new Map<string, number>();
  for (const p of points) {
    byYearSeason.set(`${p.year}-${p.season}`, p.anomaly);
  }

  const buildYearValues = (year: number): (number | null)[] =>
    SEASONS.map((season) => byYearSeason.get(`${year}-${season}`) ?? null);

  const latestYear = points[points.length - 1]?.year ?? new Date().getFullYear();

  return [
    {
      id: String(latestYear),
      label: `${latestYear} (Actual)`,
      tag: "En curso",
      color: "var(--sol)",
      isCurrent: true,
      defaultActive: true,
      values: buildYearValues(latestYear),
    },
    {
      id: "1997",
      label: "1997 (Niño +2,4°)",
      tag: "El Niño muy fuerte",
      color: "var(--nino)",
      defaultActive: true,
      values: buildYearValues(1997),
    },
    {
      id: "2015",
      label: "2015 (Niño +2,6°)",
      tag: "Récord histórico",
      color: "#ff8c61",
      defaultActive: true,
      values: buildYearValues(2015),
    },
    {
      id: "2023",
      label: "2023 (Niño +2,0°)",
      tag: "El Niño fuerte",
      color: "#d97724",
      defaultActive: false,
      values: buildYearValues(2023),
    },
    {
      id: "1982",
      label: "1982 (Niño +2,2°)",
      tag: "El Niño muy fuerte",
      color: "#b55239",
      defaultActive: false,
      values: buildYearValues(1982),
    },
    {
      id: "2021",
      label: "2021 (Niña −1,3°)",
      tag: "La Niña triple",
      color: "var(--nina)",
      defaultActive: true,
      values: buildYearValues(2021),
    },
  ];
}
