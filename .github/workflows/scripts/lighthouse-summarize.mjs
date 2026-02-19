import { readdirSync, readFileSync, writeFileSync } from "node:fs";
import { join } from "node:path";

const dir = join(process.cwd(), "lighthouse");
const files = readdirSync(dir).filter((f) => f.endsWith(".json"));

if (files.length === 0) {
    writeFileSync(
        "lighthouse-summary.md",
        "No Lighthouse reports were generated.\n",
    );
    writeFileSync("lighthouse-failed.txt", "1\n");
    process.exit(0);
}

const thresholds = {
    performance: 80,
    accessibility: 80,
    bestPractices: 80,
    seo: 80,
};

function toDisplayPath(url) {
    try {
        const parsed = new URL(url);
        const path = parsed.pathname || "/";
        return `${path}${parsed.search}${parsed.hash}` || "/";
    } catch {
        return url;
    }
}

const rows = [];
const failures = [];
for (const file of files) {
    const report = JSON.parse(readFileSync(join(dir, file), "utf8"));
    const categories = report.categories || {};
    const rawUrl = report.finalUrl || report.requestedUrl || "unknown";
    const row = {
        url: toDisplayPath(rawUrl),
        performance: Math.round((categories.performance?.score ?? 0) * 100),
        accessibility: Math.round((categories.accessibility?.score ?? 0) * 100),
        bestPractices: Math.round(
            (categories["best-practices"]?.score ?? 0) * 100,
        ),
        seo: Math.round((categories.seo?.score ?? 0) * 100),
    };
    rows.push(row);

    if (row.performance < thresholds.performance)
        failures.push(`${row.url} performance ${row.performance}`);
    if (row.accessibility < thresholds.accessibility)
        failures.push(`${row.url} accessibility ${row.accessibility}`);
    if (row.bestPractices < thresholds.bestPractices)
        failures.push(`${row.url} best-practices ${row.bestPractices}`);
    if (row.seo < thresholds.seo) failures.push(`${row.url} seo ${row.seo}`);
}

rows.sort((a, b) => a.url.localeCompare(b.url));

const lines = [];
lines.push("## Lighthouse results");
lines.push("");
lines.push("<details>");
lines.push("<summary>Show Lighthouse scores</summary>");
lines.push("");
lines.push("| Path | Performance | Accessibility | Best Practices | SEO |");
lines.push("| --- | --- | --- | --- | --- |");
for (const row of rows) {
    lines.push(
        `| ${row.url} | ${row.performance} | ${row.accessibility} | ${row.bestPractices} | ${row.seo} |`,
    );
}
lines.push("");
lines.push("</details>");
lines.push("");

let skipped = "";
try {
    skipped = readFileSync("lighthouse-skipped.txt", "utf8").trim();
} catch {
    skipped = "";
}

if (skipped) {
    lines.push("Skipped dynamic routes:");
    lines.push("");
    lines.push("```");
    lines.push(skipped);
    lines.push("```");
    lines.push("");
}

if (failures.length) {
    lines.push("Threshold failures:");
    lines.push("");
    lines.push("```");
    lines.push(failures.join("\n"));
    lines.push("```");
    lines.push("");
}

writeFileSync("lighthouse-summary.md", lines.join("\n"));
writeFileSync("lighthouse-failed.txt", failures.length ? "1\n" : "0\n");
