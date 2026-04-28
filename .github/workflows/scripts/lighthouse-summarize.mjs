import { readdirSync, readFileSync, writeFileSync } from "node:fs";

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

function getAuditValue(report, auditName) {
    return report.audits?.[auditName]?.numericValue || 0;
}

function getRepresentativeRun(runs) {
    if (runs.length === 0) return null;

    const sortedByFcp = [...runs].sort(
        (a, b) => getAuditValue(a, "first-contentful-paint") - getAuditValue(b, "first-contentful-paint"),
    );
    const medianFcp = getAuditValue(sortedByFcp[Math.floor(runs.length / 2)], "first-contentful-paint");

    const sortedByInteractive = [...runs].sort(
        (a, b) => getAuditValue(a, "interactive") - getAuditValue(b, "interactive"),
    );
    const medianInteractive = getAuditValue(sortedByInteractive[Math.floor(runs.length / 2)], "interactive");

    const getMedianSortValue = (report) => {
        const distanceFcp = medianFcp - getAuditValue(report, "first-contentful-paint");
        const distanceInteractive = medianInteractive - getAuditValue(report, "interactive");

        return distanceFcp * distanceFcp + distanceInteractive * distanceInteractive;
    };

    return [...runs].sort((a, b) => getMedianSortValue(a) - getMedianSortValue(b))[0] || null;
}

function readRepresentativeScores() {
    try {
        const lhrFiles = readdirSync(".lighthouseci")
            .filter((file) => file.startsWith("lhr-") && file.endsWith(".json"))
            .sort();

        const runsByUrl = new Map();

        for (const file of lhrFiles) {
            const report = JSON.parse(readFileSync(`.lighthouseci/${file}`, "utf8"));
            const reportUrl = normalizeUrl(report.finalUrl || report.requestedUrl || "");
            if (!reportUrl) continue;

            const runs = runsByUrl.get(reportUrl) || [];
            runs.push(report);
            runsByUrl.set(reportUrl, runs);
        }

        const scoresByUrl = new Map();

        for (const [url, runs] of runsByUrl) {
            const representative = getRepresentativeRun(runs);
            if (!representative) continue;

            scoresByUrl.set(url, {
                performance: representative.categories?.performance?.score ?? null,
                accessibility: representative.categories?.accessibility?.score ?? null,
                bestPractices: representative.categories?.["best-practices"]?.score ?? null,
                seo: representative.categories?.seo?.score ?? null,
            });
        }

        return scoresByUrl;
    } catch {
        return new Map();
    }
}

function formatScore(score) {
    if (typeof score !== "number") return "N/A";
    return String(Math.round(score * 100));
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
const representativeScores = readRepresentativeScores();
const rows = urls
    .map((url) => ({
        url,
        path: toDisplayPath(url),
        reportUrl: reportLinks.get(normalizeUrl(url)) || "",
        scores: representativeScores.get(normalizeUrl(url)) || null,
    }))
    .sort((a, b) => a.path.localeCompare(b.path));

const lines = [];
lines.push("## Lighthouse results");
lines.push("");
lines.push("| Path | Performance | Accessibility | Best Practices | SEO | Report |");
lines.push("| --- | ---: | ---: | ---: | ---: | --- |");

for (const row of rows) {
    const pathLink = `[${row.path}](${row.url})`;
    const reportLink = row.reportUrl ? `[Open report](${row.reportUrl})` : "N/A";
    lines.push(
        `| ${pathLink} | ${formatScore(row.scores?.performance)} | ${formatScore(row.scores?.accessibility)} | ${formatScore(row.scores?.bestPractices)} | ${formatScore(row.scores?.seo)} | ${reportLink} |`,
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

writeFileSync("lighthouse-summary.md", lines.join("\n"));
writeFileSync("lighthouse-failed.txt", "0\n");
