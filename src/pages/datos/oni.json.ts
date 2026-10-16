import type { APIRoute } from "astro";
import { site } from "../../data/content";
import {
  ONI_SOURCE_URL,
  classify,
  extractOniEpisodes,
  getOni,
  seasonLabel,
} from "../../data/oni";

export const GET: APIRoute = async () => {
  const points = await getOni();
  const episodes = extractOniEpisodes(points);

  const payload = {
    source: {
      provider: "NOAA / NCEP Climate Prediction Center (ERSST.v5)",
      url: ONI_SOURCE_URL,
      portal: site.name,
      portalUrl: site.url,
    },
    updatedAt: new Date().toISOString().slice(0, 10),
    totalSeasons: points.length,
    totalEpisodes: episodes.length,
    episodes,
    series: points.map((p) => {
      const { state, intensity } = classify(p.anomaly);
      return {
        season: p.season,
        period: seasonLabel(p.season),
        year: p.year,
        sstTotal: p.total,
        oniAnomaly: p.anomaly,
        phase: state,
        intensity,
      };
    }),
  };

  return new Response(JSON.stringify(payload, null, 2) + "\n", {
    headers: {
      "Content-Type": "application/json; charset=utf-8",
      "Access-Control-Allow-Origin": "*",
    },
  });
};
