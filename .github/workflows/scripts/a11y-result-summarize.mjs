import { existsSync, readFileSync, writeFileSync } from "node:fs";

const [, , inputPath = "storybook/reports/junit.xml", outputPath = "a11y-result.md", exitStatus = "1"] = process.argv;

function escapeTableCell(value) {
    return String(value ?? "")
        .replaceAll("\\", "\\\\")
        .replaceAll("|", "\\|")
        .replaceAll("\n", "<br>");
}

function decodeXml(value) {
    return String(value ?? "")
        .replaceAll("&quot;", '"')
        .replaceAll("&apos;", "'")
        .replaceAll("&lt;", "<")
        .replaceAll("&gt;", ">")
        .replaceAll("&amp;", "&");
}

function parseAttributes(source) {
    const attributes = {};
    const attributePattern = /([\w:-]+)="([^"]*)"/gu;
    for (const match of source.matchAll(attributePattern)) {
        attributes[match[1]] = decodeXml(match[2]);
    }
    return attributes;
}

function summarizeFailureMessage(message) {
    const ansiEscape = String.fromCharCode(27);
    const text = decodeXml(message).replace(new RegExp(`${ansiEscape}\\[[0-9;]*m`, "gu"), "");
    const violationMatch = text.match(/\d+ accessibility violation[s]? (?:was|were) detected/iu);
    if (violationMatch) {
        return violationMatch[0];
    }

    const lines = text
        .split("\n")
        .map((line) => line.trim())
        .filter(Boolean)
        .filter((line) => !line.startsWith("at "));

    return lines.slice(0, 3).join("\n").slice(0, 500);
}

function buildMissingResultSummary() {
    const statusText = exitStatus === "0" ? "passed" : "failed";

    return [
        "<details>",
        "<summary>A11y Test Result</summary>",
        "",
        `Storybook A11y test ${statusText}, but JUnit output was not generated.`,
        "",
        "</details>",
        "",
    ].join("\n");
}

function getRootAttributes(xml) {
    const rootMatch = xml.match(/<testsuites\b([^>]*)>/u) ?? xml.match(/<testsuite\b([^>]*)>/u);
    return rootMatch ? parseAttributes(rootMatch[1]) : {};
}

function getTestCaseBlocks(xml) {
    const pairedBlocks = [...xml.matchAll(/<testcase\b([^>]*)>([\s\S]*?)<\/testcase>/gu)].map((match) => ({
        attributes: parseAttributes(match[1]),
        body: match[2],
    }));
    const selfClosingBlocks = [...xml.matchAll(/<testcase\b([^>]*)\/>/gu)].map((match) => ({
        attributes: parseAttributes(match[1]),
        body: "",
    }));

    return [...pairedBlocks, ...selfClosingBlocks];
}

function collectFailedCases(testCases) {
    return testCases.flatMap((testcase) => {
        const failureMatch = testcase.body.match(/<(failure|error)\b([^>]*)>([\s\S]*?)<\/\1>/u);
        const selfClosingFailureMatch = testcase.body.match(/<(failure|error)\b([^>]*)\/>/u);
        const match = failureMatch ?? selfClosingFailureMatch;
        if (!match) return [];

        const failureAttributes = parseAttributes(match[2]);
        const bodyMessage = failureMatch ? decodeXml(match[3].replace(/<[^>]*>/gu, "").trim()) : "";
        const classname = testcase.attributes.classname ?? "";
        const message = summarizeFailureMessage(failureAttributes.message || bodyMessage);

        return [
            {
                suiteName: classname,
                testName: testcase.attributes.name ?? "Unknown test",
                message,
            },
        ];
    });
}

function toCount(value) {
    return Number.parseInt(value ?? "0", 10) || 0;
}

if (!existsSync(inputPath)) {
    writeFileSync(outputPath, buildMissingResultSummary());
    process.exit(0);
}

const xml = readFileSync(inputPath, "utf8");
const rootAttributes = getRootAttributes(xml);
const testCases = getTestCaseBlocks(xml);
const total = toCount(rootAttributes.tests) || testCases.length;
const failed = toCount(rootAttributes.failures) + toCount(rootAttributes.errors);
const skipped = toCount(rootAttributes.skipped);
const passed = Math.max(0, total - failed - skipped);
const statusLabel = exitStatus === "0" ? "✅ Passed" : "❌ Failed";
const failedCases = collectFailedCases(testCases);
const lines = [];

lines.push("<details>");
lines.push("<summary>A11y Test Result</summary>");
lines.push("");
lines.push(`## ${statusLabel}`);
lines.push("");
lines.push(`Tests: ${passed} passed / ${failed} failed / ${skipped} skipped / ${total} total`);
lines.push("");
lines.push("| Passed | Failed | Skipped | Total |");
lines.push("| ---: | ---: | ---: | ---: |");
lines.push(`| ${passed} | ${failed} | ${skipped} | ${total} |`);

if (failedCases.length > 0) {
    lines.push("");
    lines.push("### Failed accessibility checks");
    lines.push("");
    lines.push("| Story | Test | Message |");
    lines.push("| --- | --- | --- |");

    for (const failure of failedCases.slice(0, 20)) {
        lines.push(
            `| ${escapeTableCell(failure.suiteName)} | ${escapeTableCell(failure.testName)} | ${escapeTableCell(failure.message || "N/A")} |`,
        );
    }

    if (failedCases.length > 20) {
        lines.push("");
        lines.push(`_And ${failedCases.length - 20} more failure(s). See the JUnit report for full details._`);
    }
}

lines.push("");
lines.push("</details>");
lines.push("");

writeFileSync(outputPath, lines.join("\n"));
