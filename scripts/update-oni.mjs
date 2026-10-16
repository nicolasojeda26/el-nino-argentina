import fs from "node:fs/promises";
import path from "node:path";

const ONI_SOURCE_URL = "https://www.cpc.ncep.noaa.gov/data/indices/oni.ascii.txt";
const TARGET_FILE = path.resolve("./src/data/oni.ascii.txt");

async function main() {
  console.log(`Descargando ONI desde ${ONI_SOURCE_URL}...`);
  const res = await fetch(ONI_SOURCE_URL, {
    signal: AbortSignal.timeout(20000),
    headers: { "user-agent": "el-nino-portal/1.0 (+update-script)" },
  });

  if (!res.ok) {
    throw new Error(`Error HTTP ${res.status} al consultar NOAA`);
  }

  const text = await res.text();
  const lines = text.trim().split(/\r?\n/);
  if (!text.includes("ANOM") || lines.length < 100) {
    throw new Error("Respuesta de NOAA inválida o incompleta");
  }

  let current = "";
  try {
    current = await fs.readFile(TARGET_FILE, "utf-8");
  } catch {
    // ignore if missing
  }

  if (current.trim() === text.trim()) {
    console.log("Sin cambios: src/data/oni.ascii.txt ya está al día.");
    return;
  }

  await fs.writeFile(TARGET_FILE, text, "utf-8");
  const lastLine = lines[lines.length - 1]?.trim();
  console.log(`Actualizado src/data/oni.ascii.txt. Último registro: ${lastLine}`);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
