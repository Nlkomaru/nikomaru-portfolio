import { readFileSync, writeFileSync } from "node:fs";

let manifest = [];
try {
    manifest = JSON.parse(readFileSync(".lighthouseci/manifest.json", "utf8"));
} catch {
    manifest = [];
}

if (!Array.isArray(manifest) || manifest.length === 0) {
    writeFileSync("lighthouse-summary.md", "No Lighthouse reports were generated.\n");
    writeFileSync("lighthouse-failed.txt", "1\n");
    process.exit(0);
}

const logContents = (() => {
    try {
        return readFileSync("lighthouse.log", "utf8");
    } catch {
        return "";
    }
})();

function toDisplayPath(url) {
    try {
        const parsed = new URL(url);
        const path = parsed.pathname || "/";
        return `${path}${parsed.search}${parsed.hash}` || "/";
    } catch {
        return url;
    }
}

function scoreToPercent(score) {
    return Math.round((score ?? 0) * 100);
}

function normalizeUrl(url) {
    return url.replace(/\/$/, "");
}

function collectReportLinks(log) {
    const lines = log.split("\n");
    const links = new Map();
    let currentUrl = "";

    for (const line of lines) {
        const uploadMatch = line.match(/Uploading median LHR of (.+?)\.\.\.success!?/);
        if (uploadMatch) {
            currentUrl = normalizeUrl(uploadMatch[1].trim());
            continue;
        }

        const reportMatch = line.match(/Open the report at (https:\/\/\S+)/);
        if (reportMatch && currentUrl) {
            links.set(currentUrl, reportMatch[1].trim());
            currentUrl = "";
        }
    }

    return links;
}

const reportLinks = collectReportLinks(logContents);
const rows = manifest
    .filter((entry) => entry?.isRepresentativeRun)
    .map((entry) => {
        const rawUrl = entry.url || "unknown";
        const summary = entry.summary || {};
        return {
            url: rawUrl,
            path: toDisplayPath(rawUrl),
            reportUrl: reportLinks.get(normalizeUrl(rawUrl)) || "",
            performance: scoreToPercent(summary.performance),
            accessibility: scoreToPercent(summary.accessibility),
            bestPractices: scoreToPercent(summary["best-practices"]),
            seo: scoreToPercent(summary.seo),
        };
    })
    .sort((a, b) => a.path.localeCompare(b.path));

const lines = [];
lines.push("## Lighthouse results");
lines.push("");
lines.push("<details>");
lines.push("<summary>Show Lighthouse representative scores and public report URLs</summary>");
lines.push("");
lines.push("| Path | Report | Performance | Accessibility | Best Practices | SEO |");
lines.push("| --- | --- | --- | --- | --- | --- |");

for (const row of rows) {
    const pathLink = `[${row.path}](${row.url})`;
    const reportLink = row.reportUrl ? `[Open report](${row.reportUrl})` : "N/A";
    lines.push(
        `| ${pathLink} | ${reportLink} | ${row.performance} | ${row.accessibility} | ${row.bestPractices} | ${row.seo} |`,
    );
}

lines.push("");
lines.push("Reports are uploaded to Lighthouse temporary public storage and may expire after a few days.");
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

lines.push("</details>");
lines.push("");

writeFileSync("lighthouse-summary.md", lines.join("\n"));
writeFileSync("lighthouse-failed.txt", "0\n");
