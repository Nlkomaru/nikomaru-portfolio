import { readFileSync, writeFileSync } from "node:fs";

const logContents = (() => {
    try {
        return readFileSync("lighthouse.log", "utf8");
    } catch {
        return "";
    }
})();

if (!logContents.trim()) {
    writeFileSync("lighthouse-summary.md", "No Lighthouse reports were generated.\n");
    writeFileSync("lighthouse-failed.txt", "1\n");
    process.exit(0);
}

const urlListContents = (() => {
    try {
        return readFileSync("lighthouse-urls.txt", "utf8");
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

const urls = urlListContents
    .split("\n")
    .map((line) => line.trim())
    .filter(Boolean);
const reportLinks = collectReportLinks(logContents);
const rows = urls
    .map((url) => ({
        url,
        path: toDisplayPath(url),
        reportUrl: reportLinks.get(normalizeUrl(url)) || "",
    }))
    .sort((a, b) => a.path.localeCompare(b.path));

const lines = [];
lines.push("## Lighthouse results");
lines.push("");
lines.push("<details>");
lines.push("<summary>Show Lighthouse public report URLs</summary>");
lines.push("");
lines.push("| Path | Report |");
lines.push("| --- | --- |");

for (const row of rows) {
    const pathLink = `[${row.path}](${row.url})`;
    const reportLink = row.reportUrl ? `[Open report](${row.reportUrl})` : "N/A";
    lines.push(`| ${pathLink} | ${reportLink} |`);
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
