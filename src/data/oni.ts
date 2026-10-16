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

export interface OniEpisode {
  id: string;
  period: string;
  rangeLabel: string;
  startYear: number;
  endYear: number;
  startSeason: string;
  endSeason: string;
  duration: number;
  type: "El Niño" | "La Niña";
  intensity: "Muy fuerte" | "Fuerte" | "Moderado" | "Débil";
  peak: number;
  peakSeason: string;
  years: number[];
  impact: string;
}

const CURATED_IMPACTS: Record<string, string> = {
  "1957–1958": "Crecidas en el río Paraná y lluvias por encima de la media en el Litoral y noreste argentino.",
  "1965–1966": "Inundaciones ribereñas importantes en el Paraná medio e inferior; campaña agrícola húmeda.",
  "1972–1973": "Lluvias abundantes en la región pampeana y crecidas en la cuenca del Plata.",
  "1973–1974": "Transición brusca a fase fría con déficit de lluvias primaverales en el centro del país.",
  "1975–1976": "La Niña fuerte con sequía estival marcada en Buenos Aires, Córdoba y La Pampa.",
  "1982–1983": "Uno de los eventos más intensos del siglo XX. Inundaciones históricas en el Litoral y pérdidas severas en infraestructura.",
  "1986–1988": "Evento prolongado con recarga hídrica sostenida en el centro-este y pulsos de crecida en el Paraná.",
  "1988–1989": "La Niña fuerte: sequía severa en la región pampeana, crisis energética y caída en la cosecha de granos.",
  "1991–1992": "Crecidas del río Paraná y excesos hídricos otoñales en el NEA y Litoral.",
  "1997–1998": "El Niño extraordinario: crecidas históricas del Paraná y Uruguay y anegamientos extensos en la Pampa húmeda.",
  "1998–2001": "Evento frío prolongado (casi 3 años) con enfriamiento y pulsos secos recurrentes en el centro del país.",
  "2002–2003": "Buena oferta de agua en la región pampeana que acompañó la expansión de la cosecha gruesa.",
  "2007–2008": "La Niña fuerte con déficit hídrico en primavera-verano y heladas tempranas en el sur pampeano.",
  "2009–2010": "Recuperación rápida de las lluvias tras la sequía de 2008–2009, con récord de cosecha gruesa.",
  "2010–2011": "Fuerte déficit de lluvias en diciembre y enero sobre la zona núcleo maicera.",
  "2011–2012": "Segundo año consecutivo de La Niña con olas de calor y recorte de rindes en soja y maíz.",
  "2015–2016": "Récord de anomalía en Niño 3.4 (+2,6 °C): crecidas del Paraná y temporales de otoño de 2016 en el centro-este.",
  "2017–2018": "Aunque moderada en el Pacífico, desató una de las sequías estivales más costosas en la Pampa húmeda.",
  "2020–2021": "Inicio de la 'Niña triple': comienzo de la bajante extraordinaria del río Paraná e incendios en el Delta.",
  "2021–2023": "Continuación de la 'Niña triple': bajante histórica del Paraná e impacto extremo sobre trigo, maíz y soja en 2022/23.",
  "2023–2024": "Reversión cálida fuerte (+2,0 °C): normalización del caudal del Paraná y recarga de perfiles agrícolas en el centro-este.",
};

function defaultEpisodeImpact(type: "El Niño" | "La Niña", intensity: string, duration: number): string {
  if (type === "El Niño") {
    if (intensity === "Muy fuerte" || intensity === "Fuerte") {
      return `Evento cálido ${intensity.toLowerCase()} (${duration} trimestres): lluvias superiores a la media en Litoral y Pampa húmeda y repunte de caudales en la cuenca del Plata.`;
    }
    return `Fase cálida ${intensity.toLowerCase()} (${duration} trimestres): señal moderada de mayor humedad en el noreste y centro-este argentino.`;
  }
  if (intensity === "Muy fuerte" || intensity === "Fuerte") {
    return `Evento frío ${intensity.toLowerCase()} (${duration} trimestres): restricción de lluvias primavero-estivales en región pampeana y tendencia a bajante en el Paraná.`;
  }
  return `Fase fría ${intensity.toLowerCase()} (${duration} trimestres): menor frecuencia de precipitaciones en el centro del país y mayor amplitud térmica.`;
}

/**
 * Extrae todos los episodios oficiales de El Niño (>= +0.5 °C por >= 5 trimestres)
 * y La Niña (<= -0.5 °C por >= 5 trimestres) desde 1950 a partir de la serie ONI.
 */
export function extractOniEpisodes(points: OniPoint[]): OniEpisode[] {
  const episodes: OniEpisode[] = [];
  let run: OniPoint[] = [];
  let currentType: "El Niño" | "La Niña" | null = null;

  const flushRun = () => {
    if (run.length >= 5 && currentType) {
      const start = run[0];
      const end = run[run.length - 1];
      const peakPoint = run.reduce((best, p) =>
        Math.abs(p.anomaly) > Math.abs(best.anomaly) ? p : best,
      );
      const { intensity } = classify(peakPoint.anomaly);
      const normIntensity = (
        intensity === "Muy fuerte" || intensity === "Fuerte" || intensity === "Moderado"
          ? intensity
          : "Débil"
      ) as OniEpisode["intensity"];
      const period = start.year === end.year ? `${start.year}` : `${start.year}–${end.year}`;
      const yearsSet = new Set<number>();
      for (const p of run) yearsSet.add(p.year);
      const impact =
        CURATED_IMPACTS[period] ?? defaultEpisodeImpact(currentType, normIntensity, run.length);

      episodes.push({
        id: `${start.year}-${start.season}-${currentType === "El Niño" ? "nino" : "nina"}`,
        period,
        rangeLabel: `${start.season} ${start.year} – ${end.season} ${end.year}`,
        startYear: start.year,
        endYear: end.year,
        startSeason: start.season,
        endSeason: end.season,
        duration: run.length,
        type: currentType,
        intensity: normIntensity,
        peak: peakPoint.anomaly,
        peakSeason: `${peakPoint.season} ${peakPoint.year}`,
        years: Array.from(yearsSet),
        impact,
      });
    }
    run = [];
    currentType = null;
  };

  for (const p of points) {
    const pType: "El Niño" | "La Niña" | null =
      p.anomaly >= 0.5 ? "El Niño" : p.anomaly <= -0.5 ? "La Niña" : null;
    if (pType && pType === currentType) {
      run.push(p);
    } else {
      flushRun();
      if (pType) {
        currentType = pType;
        run = [p];
      }
    }
  }
  flushRun();

  return episodes;
}

