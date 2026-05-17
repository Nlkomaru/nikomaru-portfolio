import { existsSync, readdirSync, readFileSync, statSync, writeFileSync } from "node:fs";
import { join, relative } from "node:path";

const baseUrl = process.env.DEPLOYMENT_URL?.replace(/\/$/, "");
if (!baseUrl) {
    process.stderr.write("DEPLOYMENT_URL is missing\n");
    process.exit(1);
}

const cwd = process.cwd();
const routesDirCandidates = [join(cwd, "app", "src", "routes"), join(cwd, "src", "routes")];
const routesDir = routesDirCandidates.find((dir) => existsSync(dir));

if (!routesDir) {
    process.stderr.write(`Routes directory is missing. Looked for: ${routesDirCandidates.join(", ")}\n`);
    process.exit(1);
}

const extraPathsFile = join(cwd, ".github", "workflows", "config", "lighthouse-extra-paths.txt");

const paths = new Set();
const skipped = [];

/**
 * TanStack Router のファイルパス（`.tsx` なし、POSIX）から公開 URL のパスへ変換する。
 * `(segment)` のルートグループと `_layout` 系のパスなしレイアウトは URL に含めない。
 * @param {string} routePath — 例: `(site)/_main/about/` または `index`
 * @returns {string | null} `/.../` 形式、レイアウトのみで URL が無い場合は null
 */
function tanstackRoutePathToPublicPath(routePath) {
    const posix = routePath.replace(/\\/g, "/");
    if (posix === "index") {
        return "/";
    }
    const trimmedIndex = posix.replace(/\/index\/?$/, "/");
    const segments = trimmedIndex.split("/").filter(Boolean);
    const urlSegments = segments.filter((segment) => {
        if (segment.startsWith("(") && segment.endsWith(")")) {
            return false;
        }
        if (segment.startsWith("_")) {
            return false;
        }
        return true;
    });
    if (urlSegments.length === 0) {
        return null;
    }
    return `/${urlSegments.join("/")}/`.replace(/\/{2,}/g, "/");
}

function walk(dir) {
    const relDir = relative(routesDir, dir);
    const segments = relDir === "" ? [] : relDir.split(/[\\/]/);
    if (segments.some((segment) => segment.startsWith("-"))) {
        return;
    }

    for (const entry of readdirSync(dir)) {
        const full = join(dir, entry);
        const stats = statSync(full);
        if (stats.isDirectory()) {
            walk(full);
            continue;
        }
        if (!entry.endsWith(".tsx")) continue;
        if (entry.startsWith("__")) continue;

        const rel = relative(routesDir, full);
        const routePath = rel
            .replace(/\\/g, "/")
            .replace(/\.tsx$/, "")
            .replace(/\/index$/, "/");

        if (routePath.includes("$") || routePath.includes("[")) {
            skipped.push(routePath);
            continue;
        }

        const normalized = tanstackRoutePathToPublicPath(routePath);
        if (normalized === null) {
            skipped.push(routePath);
            continue;
        }

        paths.add(normalized);
    }
}

walk(routesDir);

let extraPathContents = "";
try {
    extraPathContents = readFileSync(extraPathsFile, "utf8");
} catch {
    extraPathContents = "";
}

for (const line of extraPathContents.split("\n")) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith("#")) continue;
    const normalized = trimmed.startsWith("/") ? trimmed : `/${trimmed}`;
    paths.add(normalized.replace(/\/{2,}/g, "/"));
}

const urls = [...paths].sort().map((path) => `${baseUrl}${path}`);

function toMatrixId(path) {
    if (path === "/") {
        return "root";
    }

    return path
        .replace(/^\/+|\/+$/g, "")
        .replace(/[^a-zA-Z0-9]+/g, "-")
        .replace(/^-+|-+$/g, "")
        .toLowerCase();
}

const matrix = [...paths].sort().map((path) => ({
    id: toMatrixId(path),
    path,
    url: `${baseUrl}${path}`,
}));

writeFileSync("lighthouse-urls.txt", `${urls.join("\n")}\n`);
writeFileSync("lighthouse-skipped.txt", `${skipped.sort().join("\n")}\n`);
writeFileSync("lighthouse-matrix.json", `${JSON.stringify(matrix, null, 4)}\n`);
