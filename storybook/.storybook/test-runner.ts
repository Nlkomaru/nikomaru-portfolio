import { mkdirSync, rmSync, writeFileSync } from "node:fs";
import { dirname, resolve } from "node:path";
import type { TestRunnerConfig } from "@storybook/test-runner";
import type { Result } from "axe-core";
import { checkA11y, configureAxe, getViolations, injectAxe } from "axe-playwright";
import { registerAPCACheck } from "./a11y";

const a11yReportPath = resolve(process.cwd(), "reports/a11y-violations.jsonl");
const apca = registerAPCACheck("silver");
const axeConfiguration = {
    checks: [...apca.checks],
    rules: [
        {
            id: "autocomplete-valid",
            selector: '*:not([autocomplete="nope"])',
        },
        {
            id: "image-alt",
            enabled: false,
        },
        {
            id: "color-contrast",
            enabled: false,
        },
        {
            id: "color-contrast-enhanced",
            enabled: false,
        },
        {
            id: "region",
            enabled: false,
        },
        ...apca.rules,
    ],
};

function toViolationReport(context: { id: string; title: string; name: string }, violations: Result[]) {
    return {
        storyId: context.id,
        title: context.title,
        name: context.name,
        violations: violations.map((violation) => ({
            id: violation.id,
            impact: violation.impact,
            description: violation.description,
            help: violation.help,
            helpUrl: violation.helpUrl,
            nodes: violation.nodes.map((node) => ({
                target: node.target,
                html: node.html,
                failureSummary: node.failureSummary,
            })),
        })),
    };
}

/*
 * See https://storybook.js.org/docs/writing-tests/test-runner#test-hook-api
 * to learn more about the test-runner hooks API.
 */
const config: TestRunnerConfig = {
    setup() {
        mkdirSync(dirname(a11yReportPath), { recursive: true });
        rmSync(a11yReportPath, { force: true });
    },
    async preVisit(page) {
        await injectAxe(page);
        await configureAxe(page, axeConfiguration);
    },
    async postVisit(page, context) {
        const axeOptions = {
            detailedReport: true,
            detailedReportOptions: {
                html: true,
            },
        };
        const violations = await getViolations(page, "body");

        if (violations.length > 0) {
            writeFileSync(a11yReportPath, `${JSON.stringify(toViolationReport(context, violations))}\n`, {
                flag: "a",
            });
        }

        await checkA11y(page, "body", axeOptions);
    },
};

export default config;
