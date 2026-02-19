import { readdirSync, readFileSync, writeFileSync } from "node:fs";
import { join } from "node:path";

const dir = join(process.cwd(), "lighthouse");
const files = readdirSync(dir).filter((f) => f.endsWith(".json"));

if (files.length === 0) {
    writeFileSync("lighthouse-summary.md", "No Lighthouse reports were generated.\n");
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

function toMarkdownPathLink(url) {
    const path = toDisplayPath(url);
    if (url.startsWith("http://") || url.startsWith("https://")) {
        return `[${path}](${url})`;
    }
    return path;
}

const groupedRows = new Map();
for (const file of files) {
    const report = JSON.parse(readFileSync(join(dir, file), "utf8"));
    const categories = report.categories || {};
    const rawUrl = report.finalUrl || report.requestedUrl || "unknown";
    const key = toDisplayPath(rawUrl);

    const metrics = {
        performance: Math.round((categories.performance?.score ?? 0) * 100),
        accessibility: Math.round((categories.accessibility?.score ?? 0) * 100),
        bestPractices: Math.round((categories["best-practices"]?.score ?? 0) * 100),
        seo: Math.round((categories.seo?.score ?? 0) * 100),
    };

    if (!groupedRows.has(key)) {
        groupedRows.set(key, {
            url: key,
            rawUrl,
            runCount: 0,
            totals: {
                performance: 0,
                accessibility: 0,
                bestPractices: 0,
                seo: 0,
            },
        });
    }

    const current = groupedRows.get(key);
    current.runCount += 1;
    current.totals.performance += metrics.performance;
    current.totals.accessibility += metrics.accessibility;
    current.totals.bestPractices += metrics.bestPractices;
    current.totals.seo += metrics.seo;
}

const rows = [];
const failures = [];
for (const row of groupedRows.values()) {
    const averaged = {
        performance: Math.round(row.totals.performance / row.runCount),
        accessibility: Math.round(row.totals.accessibility / row.runCount),
        bestPractices: Math.round(row.totals.bestPractices / row.runCount),
        seo: Math.round(row.totals.seo / row.runCount),
    };

    rows.push({
        url: row.url,
        pathLink: toMarkdownPathLink(row.rawUrl),
        runCount: row.runCount,
        ...averaged,
    });

    if (averaged.performance < thresholds.performance) failures.push(`${row.url} performance(avg) ${averaged.performance}`);
    if (averaged.accessibility < thresholds.accessibility) failures.push(`${row.url} accessibility(avg) ${averaged.accessibility}`);
    if (averaged.bestPractices < thresholds.bestPractices) failures.push(`${row.url} best-practices(avg) ${averaged.bestPractices}`);
    if (averaged.seo < thresholds.seo) failures.push(`${row.url} seo(avg) ${averaged.seo}`);
}

rows.sort((a, b) => a.url.localeCompare(b.url));

const lines = [];
lines.push("## Lighthouse results");
lines.push("");
lines.push("<details>");
lines.push("<summary>Show Lighthouse average scores (3 runs per path)</summary>");
lines.push("");
lines.push("| Path | Runs | Performance(avg) | Accessibility(avg) | Best Practices(avg) | SEO(avg) |");
lines.push("| --- | --- | --- | --- | --- | --- |");
for (const row of rows) {
    lines.push(
        `| ${row.pathLink} | ${row.runCount} | ${row.performance} | ${row.accessibility} | ${row.bestPractices} | ${row.seo} |`,
    );
}
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

lines.push("</details>");
lines.push("");

writeFileSync("lighthouse-summary.md", lines.join("\n"));
writeFileSync("lighthouse-failed.txt", failures.length ? "1\n" : "0\n");
