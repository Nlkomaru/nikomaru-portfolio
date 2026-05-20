import { existsSync, readFileSync, writeFileSync } from "node:fs";

const [
    ,
    ,
    inputPath = "storybook/reports/junit.xml",
    outputPath = "a11y-result.md",
    exitStatus = "1",
    violationsPath = "storybook/reports/a11y-violations.jsonl",
] = process.argv;

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
    const text = stripAnsi(decodeXml(message));
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

function stripAnsi(value) {
    const ansiEscape = String.fromCharCode(27);
    return String(value ?? "").replace(new RegExp(`${ansiEscape}\\[[0-9;]*m`, "gu"), "");
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
        const failure = getFailureDetails(testcase);
        if (!failure) return [];

        const classname = testcase.attributes.classname ?? "";
        const message = summarizeFailureMessage(failure.attributes.message || failure.text);

        return [
            {
                suiteName: classname,
                testName: testcase.attributes.name ?? "Unknown test",
                message,
            },
        ];
    });
}

function getFailureDetails(testcase) {
    const failureMatch = testcase.body.match(/<(failure|error)\b([^>]*)>([\s\S]*?)<\/\1>/u);
    const selfClosingFailureMatch = testcase.body.match(/<(failure|error)\b([^>]*)\/>/u);
    const match = failureMatch ?? selfClosingFailureMatch;
    if (!match) return null;

    return {
        attributes: parseAttributes(match[2]),
        text: failureMatch ? stripAnsi(decodeXml(match[3].replace(/<[^>]*>/gu, "").trim())) : "",
    };
}

function collectA11yViolationsFromJunit(testCases) {
    return testCases.flatMap((testcase) => {
        const failure = getFailureDetails(testcase);
        if (!failure?.text.includes("StorybookTestRunnerError")) return [];

        const blockPattern =
            /Expected the HTML found at \$\('([^']+)'\) to have no violations:([\s\S]*?)(?=\nExpected the HTML found at \$\('|(?:\n-{10,})|(?:\n\s*Browser logs:)|(?:\n\s*at <anonymous>)|$)/gu;

        return [...failure.text.matchAll(blockPattern)].flatMap((match) => {
            const [, target, block] = match;
            const ruleMatch = block.match(/\((color-contrast-apca-[^)]+)\)/u);
            if (!ruleMatch) return [];

            const fixMatch = block.match(
                /Fix all of the following:\s*([\s\S]*?)(?=\n\s*You can find more information|\n\s*…|$)/u,
            );
            const message = fixMatch?.[1]?.trim() || "APCA violation details were truncated in the JUnit report.";

            return [
                {
                    story: testcase.attributes.classname ?? "Unknown story",
                    testName: testcase.attributes.name ?? "Unknown test",
                    rule: ruleMatch[1],
                    target,
                    message,
                },
            ];
        });
    });
}

function toCount(value) {
    return Number.parseInt(value ?? "0", 10) || 0;
}

function readViolationReports() {
    if (!existsSync(violationsPath)) return [];

    return readFileSync(violationsPath, "utf8")
        .split("\n")
        .map((line) => line.trim())
        .filter(Boolean)
        .flatMap((line) => {
            try {
                return [JSON.parse(line)];
            } catch {
                return [];
            }
        });
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
const junitA11yViolations = collectA11yViolationsFromJunit(testCases);
const violationReports = readViolationReports();
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

if (violationReports.length > 0) {
    lines.push("");
    lines.push("### Accessibility violations");
    lines.push("");
    lines.push("| Story | Rule | Impact | Target | Message |");
    lines.push("| --- | --- | --- | --- | --- |");

    let renderedRows = 0;
    for (const report of violationReports) {
        const story = `${report.title ?? ""} / ${report.name ?? ""}`.trim();
        for (const violation of report.violations ?? []) {
            const nodes = violation.nodes ?? [];
            const targets = nodes
                .flatMap((node) => node.target ?? [])
                .map((target) => String(target))
                .slice(0, 3)
                .join("<br>");
            const failureSummary = nodes.map((node) => node.failureSummary).find(Boolean);
            const message = failureSummary || violation.help || violation.description || "N/A";

            lines.push(
                `| ${escapeTableCell(story || report.storyId || "Unknown story")} | ${escapeTableCell(violation.id)} | ${escapeTableCell(violation.impact || "N/A")} | ${escapeTableCell(targets || "N/A")} | ${escapeTableCell(message)} |`,
            );
            renderedRows += 1;

            if (renderedRows >= 20) break;
        }
        if (renderedRows >= 20) break;
    }

    const totalRows = violationReports.reduce((sum, report) => sum + (report.violations?.length ?? 0), 0);
    if (totalRows > 20) {
        lines.push("");
        lines.push(
            `_And ${totalRows - 20} more violation(s). See the uploaded \`a11y-violations.jsonl\` for full details._`,
        );
    }
} else if (junitA11yViolations.length > 0) {
    lines.push("");
    lines.push("### APCA violations");
    lines.push("");
    lines.push("| Story | Rule | Target | Message |");
    lines.push("| --- | --- | --- | --- |");

    for (const violation of junitA11yViolations.slice(0, 20)) {
        lines.push(
            `| ${escapeTableCell(violation.story)} | ${escapeTableCell(violation.rule)} | ${escapeTableCell(violation.target)} | ${escapeTableCell(violation.message)} |`,
        );
    }

    if (junitA11yViolations.length > 20) {
        lines.push("");
        lines.push(
            `_And ${junitA11yViolations.length - 20} more APCA violation(s). See the JUnit report for full details._`,
        );
    }
} else if (failedCases.length > 0) {
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
