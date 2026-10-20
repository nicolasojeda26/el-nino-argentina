import type { APIRoute } from "astro";
import alertas from "../../data/alertas.json";

export const GET: APIRoute = () =>
  new Response(JSON.stringify(alertas) + "\n", {
    headers: {
      "Content-Type": "application/json; charset=utf-8",
      "Access-Control-Allow-Origin": "*",
      "Cache-Control": "public, max-age=900",
    },
  });
