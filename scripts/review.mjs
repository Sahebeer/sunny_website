import { existsSync } from "node:fs";
import { mkdir, readdir, writeFile } from "node:fs/promises";
import { join } from "node:path";
import { spawn } from "node:child_process";
import { chromium } from "playwright";

const root = process.cwd();
const round = Number(process.env.REVIEW_ROUND || 1);
const output = join(root, "review", `round-${round}`);
const port = Number(process.env.REVIEW_PORT || 3100);
const base = `http://127.0.0.1:${port}/lab/`;
const widths = (process.env.REVIEW_WIDTHS || "1440,390").split(",").map(Number).filter((width) => Number.isFinite(width) && width > 0);

async function waitForServer(url) {
  for (let attempt = 0; attempt < 60; attempt += 1) {
    try {
      const response = await fetch(url);
      if (response.ok) return;
    } catch {}
    await new Promise((resolve) => setTimeout(resolve, 500));
  }
  throw new Error(`Server did not become ready at ${url}`);
}

async function main() {
  await mkdir(output, { recursive: true });
  const server = spawn(process.execPath, ["scripts/static-server.mjs", "--port", String(port)], { cwd: root, stdio: "inherit" });
  try {
    await waitForServer(base);
    const browser = await chromium.launch({ headless: true });
    for (const width of widths) {
      const page = await browser.newPage({ viewport: { width, height: width <= 768 ? 844 : 900 }, deviceScaleFactor: 1 });
      for (const view of ["home", "projects", "about", "contact"]) {
        await page.goto(`${base}${view === "home" ? "" : `?view=${view}`}`, { waitUntil: "networkidle" });
        const start = page.getByRole("button", { name: "Start", exact: true });
        if (await start.count()) await start.click();
        await page.waitForTimeout(8500);
        await page.screenshot({ path: join(output, `${view}-${width}.png`), fullPage: false });
      }
      await page.close();
    }
    await browser.close();
    const notes = join(output, "notes.md");
    if (!existsSync(notes)) await writeFile(notes, `# Review round ${round}\n\n- Lighting: pending critique.\n- Atmosphere: pending critique.\n- Materials: pending critique.\n- Composition: pending critique.\n- Typography/UI: pending critique.\n\nLargest gap to fix next: pending.\n`);
  } finally {
    server.kill("SIGTERM");
  }
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
