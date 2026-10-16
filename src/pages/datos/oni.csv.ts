import type { APIRoute } from "astro";
import { classify, getOni, seasonLabel } from "../../data/oni";

export const GET: APIRoute = async () => {
  const points = await getOni();
  const header = "season,period,year,sst_total,oni_anomaly,phase,intensity";
  const rows = points.map((p) => {
    const { state, intensity } = classify(p.anomaly);
    return `${p.season},"${seasonLabel(p.season)}",${p.year},${p.total.toFixed(2)},${p.anomaly.toFixed(2)},"${state}","${intensity}"`;
  });

  const csv = [header, ...rows].join("\n") + "\n";

  return new Response(csv, {
    headers: {
      "Content-Type": "text/csv; charset=utf-8",
      "Content-Disposition": 'attachment; filename="oni-noaa-argentina.csv"',
    },
  });
};
