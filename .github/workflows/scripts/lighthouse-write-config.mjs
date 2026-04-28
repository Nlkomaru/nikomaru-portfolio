import { readFileSync, writeFileSync } from "node:fs";

const urlsFile = process.argv[2] || "lighthouse-urls.txt";
const configFile = process.argv[3] || ".lighthouserc.generated.json";

const urls = readFileSync(urlsFile, "utf8")
    .split("\n")
    .map((line) => line.trim())
    .filter(Boolean);

if (urls.length === 0) {
    process.stderr.write(`No Lighthouse URLs found in ${urlsFile}\n`);
    process.exit(1);
}

const config = {
    ci: {
        collect: {
            url: urls,
            numberOfRuns: 3,
            settings: {
                chromeFlags: "--headless --no-sandbox --disable-gpu",
            },
        },
        upload: {
            target: "temporary-public-storage",
        },
    },
};

writeFileSync(configFile, `${JSON.stringify(config, null, 4)}\n`);
