import type { APIRoute } from "astro";
import { site } from "../../data/content";
import {
  ONI_SOURCE_URL,
  buildStatus,
  getForecastProbabilities,
  getNextNoaaRelease,
  getOni,
  seasonLabel,
} from "../../data/oni";

export const GET: APIRoute = async () => {
  const points = await getOni();
  const s = buildStatus(points);
  const nextRelease = getNextNoaaRelease();
  const probabilities = getForecastProbabilities(points);

  const payload = {
    source: {
      provider: "NOAA / NCEP Climate Prediction Center (ERSST.v5)",
      url: ONI_SOURCE_URL,
      portal: site.name,
      portalUrl: site.url,
    },
    updatedAt: new Date().toISOString().slice(0, 10),
    nextNoaaRelease: {
      date: nextRelease.date.toISOString().slice(0, 10),
      label: nextRelease.shortLabel,
      daysLeft: nextRelease.daysLeft,
    },
    current: {
      season: s.latest.season,
      period: seasonLabel(s.latest.season),
      year: s.latest.year,
      sstTotal: s.latest.total,
      oniAnomaly: s.latest.anomaly,
      state: s.state,
      intensity: s.intensity,
      deltaFromPrevious: Number(s.delta.toFixed(2)),
      trend: s.trend,
    },
    recent12Seasons: s.recent.map((p) => ({
      season: p.season,
      period: seasonLabel(p.season),
      year: p.year,
      sstTotal: p.total,
      oniAnomaly: p.anomaly,
    })),
    forecastProbabilities: probabilities,
  };

  return new Response(JSON.stringify(payload, null, 2) + "\n", {
    headers: {
      "Content-Type": "application/json; charset=utf-8",
      "Access-Control-Allow-Origin": "*",
    },
  });
};
