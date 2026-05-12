import { existsSync, readFileSync, writeFileSync } from "node:fs";
import { relative } from "node:path";

const [, , inputPath = "test-result.json", outputPath = "test-result.md", exitStatus = "1"] = process.argv;

function escapeTableCell(value) {
    return String(value).replaceAll("\\", "\\\\").replaceAll("|", "\\|").replaceAll("\n", "<br>");
}

function formatDuration(startTime, endTime) {
    if (typeof startTime !== "number" || typeof endTime !== "number") {
        return "N/A";
    }

    const durationMs = Math.max(0, endTime - startTime);
    if (durationMs < 1000) {
        return `${Math.round(durationMs)}ms`;
    }

    return `${(durationMs / 1000).toFixed(2)}s`;
}

function formatStatus(status) {
    if (status === "passed") return "✅ Passed";
    if (status === "failed") return "❌ Failed";
    if (status === "skipped" || status === "pending") return "⏭️ Skipped";
    return escapeTableCell(status || "Unknown");
}

function getRelativeFileName(fileName) {
    if (!fileName) return "N/A";

    const relativePath = relative(process.cwd(), fileName);
    return relativePath.startsWith("..") ? fileName : relativePath;
}

function countAssertions(assertionResults, status) {
    return assertionResults.filter((assertion) => assertion.status === status).length;
}

function buildMissingResultSummary() {
    const statusText = exitStatus === "0" ? "passed" : "failed";

    return [
        "<details>",
        "<summary>Test Result</summary>",
        "",
        `\`pnpm run test\` ${statusText}, but Vitest JSON output was not generated.`,
        "",
        "</details>",
        "",
    ].join("\n");
}

if (!existsSync(inputPath)) {
    writeFileSync(outputPath, buildMissingResultSummary());
    process.exit(0);
}

const result = JSON.parse(readFileSync(inputPath, "utf8"));
const statusLabel = result.success ? "✅ Passed" : "❌ Failed";
const testResults = Array.isArray(result.testResults) ? result.testResults : [];
const passedFiles = testResults.filter((testFile) => testFile.status === "passed").length;
const failedFiles = testResults.filter((testFile) => testFile.status === "failed").length;
const skippedFiles = testResults.filter(
    (testFile) => testFile.status === "skipped" || testFile.status === "pending",
).length;
const lines = [];

lines.push("<details>");
lines.push("<summary>Test Result</summary>");
lines.push("");
lines.push(`## ${statusLabel}`);
lines.push("");
lines.push(
    `Test files: ${passedFiles} passed / ${failedFiles} failed / ${skippedFiles} skipped / ${testResults.length} total`,
);
lines.push(
    `Tests: ${result.numPassedTests ?? 0} passed / ${result.numFailedTests ?? 0} failed / ${result.numPendingTests ?? 0} skipped / ${result.numTotalTests ?? 0} total`,
);
lines.push("");
lines.push("| Status | File | Passed | Failed | Skipped | Duration |");
lines.push("| --- | --- | ---: | ---: | ---: | ---: |");

for (const testFile of testResults) {
    const assertions = Array.isArray(testFile.assertionResults) ? testFile.assertionResults : [];
    const skipped = countAssertions(assertions, "pending") + countAssertions(assertions, "skipped");

    lines.push(
        `| ${formatStatus(testFile.status)} | ${escapeTableCell(getRelativeFileName(testFile.name))} | ${countAssertions(assertions, "passed")} | ${countAssertions(assertions, "failed")} | ${skipped} | ${formatDuration(testFile.startTime, testFile.endTime)} |`,
    );
}

const failedAssertions = testResults.flatMap((testFile) => {
    const fileName = getRelativeFileName(testFile.name);
    const assertions = Array.isArray(testFile.assertionResults) ? testFile.assertionResults : [];

    return assertions
        .filter((assertion) => assertion.status === "failed")
        .map((assertion) => ({
            fileName,
            fullName: assertion.fullName || assertion.title || "Unknown test",
            message: (assertion.failureMessages || []).join("\n").slice(0, 1000),
        }));
});

if (failedAssertions.length > 0) {
    lines.push("");
    lines.push("### Failed tests");
    lines.push("");
    lines.push("| File | Test | Message |");
    lines.push("| --- | --- | --- |");

    for (const failure of failedAssertions) {
        lines.push(
            `| ${escapeTableCell(failure.fileName)} | ${escapeTableCell(failure.fullName)} | ${escapeTableCell(failure.message || "N/A")} |`,
        );
    }
}

lines.push("");
lines.push("</details>");
lines.push("");

writeFileSync(outputPath, lines.join("\n"));
