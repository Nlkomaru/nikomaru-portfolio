#!/usr/bin/env node

import { createHash } from "node:crypto";
import { mkdir, mkdtemp, rename, rm, writeFile } from "node:fs/promises";
import { basename, dirname, join, resolve } from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";
import { encode } from "blurhash";
import sharp from "sharp";

const defaultOutputDirectory = fileURLToPath(new URL("../app/public/photos/", import.meta.url));
const sha256Pattern = /^[a-f\d]{64}$/i;

function requireObject(value, context) {
    if (value === null || typeof value !== "object" || Array.isArray(value)) {
        throw new Error(`Invalid ${context}: expected an object.`);
    }
    return value;
}

function requireString(value, field) {
    if (typeof value !== "string" || value.trim() === "") {
        throw new Error(`Invalid ${field}: expected a nonempty string.`);
    }
    return value;
}

function optionalText(value, field) {
    if (value === undefined || value === null) return "";
    if (typeof value !== "string") throw new Error(`Invalid ${field}: expected text or null.`);
    return value.trim();
}

function readSummary(value) {
    const photo = requireObject(value, "photo summary");
    requireString(photo.id, "photo ID");
    if (typeof photo.isFavorite !== "boolean") {
        throw new Error("Invalid photo favorite flag: expected a boolean.");
    }
    if (!Number.isSafeInteger(photo.favoriteDevelopmentsCount) || photo.favoriteDevelopmentsCount < 0) {
        throw new Error("Invalid favorite development count: expected a nonnegative integer.");
    }
    return photo;
}

function captureDate(photo) {
    if (!Number.isSafeInteger(photo.takenAt)) {
        throw new Error("Invalid capture time: expected milliseconds since the Unix epoch.");
    }
    if (typeof photo.timezoneOffset !== "string" || !/^[+-](?:[01]\d|2[0-3]):[0-5]\d$/.test(photo.timezoneOffset)) {
        throw new Error("Invalid capture timezone: expected a signed HH:MM offset.");
    }
    const sign = photo.timezoneOffset[0] === "+" ? 1 : -1;
    const hours = Number(photo.timezoneOffset.slice(1, 3));
    const minutes = Number(photo.timezoneOffset.slice(4, 6));
    const localTime = new Date(photo.takenAt + sign * (hours * 60 + minutes) * 60_000);
    if (!Number.isFinite(localTime.getTime()))
        throw new Error("Invalid capture time: outside the supported date range.");
    const date = localTime.toISOString().slice(0, 10);
    if (!/^\d{4}-\d{2}-\d{2}$/.test(date)) throw new Error("Invalid capture time: expected a four-digit year.");
    return date;
}

function sourceUrl(value, baseUrl) {
    requireString(value, "image URL");
    let url;
    try {
        url = new URL(value, baseUrl);
    } catch {
        throw new Error("Invalid image URL.");
    }
    if (url.origin !== baseUrl.origin || url.username || url.password || url.hash) {
        throw new Error("Image URLs must stay on the Omoide origin and contain no credentials or fragments.");
    }
    return url;
}

function imageSource(photo, development, baseUrl) {
    const isOriginal = development === null;
    // Original jpegSha256 identifies the pre-compression source, not the served JPEG bytes.
    const hash = isOriginal ? null : development.sha256;
    if (!isOriginal && (typeof hash !== "string" || !sha256Pattern.test(hash))) {
        throw new Error("Invalid image SHA256: expected a 64-character hexadecimal digest.");
    }
    const kind = isOriginal ? "original" : "development";
    const identity = JSON.stringify([photo.id, kind, isOriginal ? null : development.id]);
    const id = `${kind}-${createHash("sha256").update(identity).digest("hex")}`;
    const album = captureDate(photo);
    const cameraMake = optionalText(photo.cameraMake, "camera make");
    const cameraModel = optionalText(photo.cameraModel, "camera model");
    const cameraLabel = cameraModel.toLowerCase().startsWith(cameraMake.toLowerCase())
        ? cameraModel
        : [cameraMake, cameraModel].filter(Boolean).join(" ");
    return {
        url: sourceUrl(isOriginal ? photo.jpegUrl : development.url, baseUrl),
        sha256: isOriginal ? null : hash.toLowerCase(),
        takenAt: photo.takenAt,
        entry: {
            id,
            album,
            src: `/photos/images/${id}.avif`,
            alt: `Photo taken on ${album} — ${isOriginal ? "Original" : "Developed"}`,
            cameraLabel,
            lensLabel: optionalText(photo.lensModel, "lens model"),
        },
    };
}

async function fetchResponse(url, apiKey, context) {
    let response;
    try {
        response = await fetch(url, {
            headers: { Authorization: `Bearer ${apiKey}` },
            redirect: "error",
        });
    } catch {
        throw new Error(`Unable to fetch ${context}; network errors and redirects are not accepted.`);
    }
    if (!response.ok) {
        await response.body?.cancel();
        throw new Error(`Unable to fetch ${context}: HTTP ${response.status}.`);
    }
    return response;
}

async function fetchJson(url, apiKey, context) {
    const response = await fetchResponse(url, apiKey, context);
    try {
        return await response.json();
    } catch {
        throw new Error(`Invalid ${context}: expected JSON.`);
    }
}

async function collectPhotos(baseUrl, apiKey) {
    const parents = new Map();
    for (const filter of ["favorite", "hasFavoriteDevelopment"]) {
        let cursor = null;
        const seenCursors = new Set();
        do {
            const url = new URL("/api/v1/photos", baseUrl);
            url.searchParams.set(filter, "true");
            url.searchParams.set("limit", "200");
            if (cursor !== null) url.searchParams.set("cursor", cursor);
            const page = requireObject(await fetchJson(url, apiKey, "photo list"), "photo list");
            if (!Array.isArray(page.photos)) throw new Error("Invalid photo list: expected a photos array.");
            if (page.nextCursor !== null && (typeof page.nextCursor !== "string" || page.nextCursor === "")) {
                throw new Error("Invalid photo list: expected nextCursor to be a nonempty string or null.");
            }
            for (const value of page.photos) {
                const photo = readSummary(value);
                const previous = parents.get(photo.id);
                parents.set(photo.id, {
                    photo,
                    needsDetails:
                        previous?.needsDetails ||
                        filter === "hasFavoriteDevelopment" ||
                        photo.favoriteDevelopmentsCount > 0,
                });
            }
            cursor = page.nextCursor;
            if (cursor !== null) {
                if (seenCursors.has(cursor)) throw new Error("Invalid photo list: pagination cursor repeated.");
                seenCursors.add(cursor);
            }
        } while (cursor !== null);
    }
    return parents;
}

async function collectSources(baseUrl, apiKey) {
    const parents = await collectPhotos(baseUrl, apiKey);
    const sources = [];
    for (const parent of parents.values()) {
        let photo = parent.photo;
        let developments = [];
        if (parent.needsDetails) {
            const url = new URL(`/api/v1/photos/${encodeURIComponent(photo.id)}`, baseUrl);
            const detail = await fetchJson(url, apiKey, "photo details");
            photo = readSummary(detail);
            if (photo.id !== parent.photo.id) throw new Error("Invalid photo details: parent ID does not match.");
            if (!Array.isArray(detail.developments))
                throw new Error("Invalid photo details: expected a developments array.");
            developments = detail.developments;
        }
        if (photo.isFavorite) sources.push(imageSource(photo, null, baseUrl));
        const seenIds = new Set();
        for (const value of developments) {
            const development = requireObject(value, "development");
            if (typeof development.isFavorite !== "boolean") {
                throw new Error("Invalid development favorite flag: expected a boolean.");
            }
            if (!development.isFavorite) continue;
            requireString(development.id, "development ID");
            if (development.photoId !== photo.id) throw new Error("Invalid development: parent ID does not match.");
            if (seenIds.has(development.id)) throw new Error("Invalid photo details: duplicate development ID.");
            seenIds.add(development.id);
            sources.push(imageSource(photo, development, baseUrl));
        }
    }
    return sources;
}

async function convertImage(source, apiKey) {
    const response = await fetchResponse(source.url, apiKey, "favorite image");
    let input;
    try {
        input = Buffer.from(await response.arrayBuffer());
    } catch {
        throw new Error("Unable to read favorite image bytes.");
    }
    if (source.sha256 !== null && createHash("sha256").update(input).digest("hex") !== source.sha256) {
        throw new Error("Favorite image SHA256 does not match the API digest.");
    }
    try {
        const image = sharp(input);
        const metadata = await image.metadata();
        const supported = ["jpeg", "png", "webp", "avif"].includes(metadata.format);
        if (!supported && !(metadata.format === "heif" && metadata.compression === "av1")) {
            throw new Error("Unsupported image format.");
        }
        const { data, info } = await image
            .rotate()
            .resize({ width: 2560, height: 2560, fit: "inside", withoutEnlargement: true })
            .toColourspace("srgb")
            .avif({ quality: 60, effort: 4 })
            .toBuffer({ resolveWithObject: true });
        const preview = await sharp(data)
            .resize({ width: 32, height: 32, fit: "inside", withoutEnlargement: true })
            .toColourspace("srgb")
            .ensureAlpha()
            .raw()
            .toBuffer({ resolveWithObject: true });
        const pixels = new Uint8ClampedArray(preview.data.buffer, preview.data.byteOffset, preview.data.byteLength);
        return {
            data,
            entry: {
                ...source.entry,
                width: info.width,
                height: info.height,
                blurhash: encode(pixels, preview.info.width, preview.info.height, 4, 3),
            },
        };
    } catch {
        throw new Error("Unable to convert favorite image: expected a valid JPEG, PNG, WebP, or AVIF image.");
    }
}

/** Publish only explicitly favorited originals and developments, without private API metadata. */
export async function syncPhotos({
    baseUrl = process.env.OMOIDE_API_URL || "https://omoide.nikomaru.dev",
    apiKey = process.env.OMOIDE_API_KEY,
    outputDirectory = defaultOutputDirectory,
} = {}) {
    if (typeof apiKey !== "string" || apiKey.trim() === "") throw new Error("OMOIDE_API_KEY is required.");
    let apiUrl;
    try {
        apiUrl = new URL(baseUrl);
    } catch {
        throw new Error("OMOIDE_API_URL must be a valid HTTP(S) URL.");
    }
    if (
        !["https:", "http:"].includes(apiUrl.protocol) ||
        apiUrl.username ||
        apiUrl.password ||
        apiUrl.search ||
        apiUrl.hash
    ) {
        throw new Error("OMOIDE_API_URL must be an HTTP(S) URL without credentials, query parameters, or fragments.");
    }
    const sources = await collectSources(apiUrl, apiKey);
    const output = resolve(outputDirectory);
    await mkdir(dirname(output), { recursive: true });
    const staging = await mkdtemp(join(dirname(output), `.${basename(output)}-staging-`));
    const next = join(staging, "next");
    const previous = join(staging, "previous");
    let preserveStaging = false;
    try {
        await mkdir(join(next, "images"), { recursive: true });
        const entries = [];
        for (const source of sources) {
            const { data, entry } = await convertImage(source, apiKey);
            await writeFile(join(next, "images", `${entry.id}.avif`), data);
            entries.push({ entry, takenAt: source.takenAt });
        }
        entries.sort(
            (a, b) => b.takenAt - a.takenAt || (a.entry.id < b.entry.id ? -1 : a.entry.id > b.entry.id ? 1 : 0),
        );
        const manifest = { photos: entries.map(({ entry }) => entry) };
        await writeFile(join(next, "index.json"), `${JSON.stringify(manifest, null, 2)}\n`);

        let hadPrevious = false;
        try {
            await rename(output, previous);
            hadPrevious = true;
        } catch (error) {
            if (error.code !== "ENOENT") throw new Error("Unable to stage the previous published photos.");
        }
        try {
            await rename(next, output);
        } catch {
            if (hadPrevious) {
                try {
                    await rename(previous, output);
                } catch {
                    preserveStaging = true;
                    throw new Error(`Unable to restore published photos; previous output is preserved at ${previous}.`);
                }
            }
            throw new Error("Unable to publish photos; previous output was not changed.");
        }
        return manifest;
    } finally {
        if (!preserveStaging) await rm(staging, { recursive: true, force: true });
    }
}

if (process.argv[1] && pathToFileURL(resolve(process.argv[1])).href === import.meta.url) {
    try {
        const { photos } = await syncPhotos();
        process.stdout.write(`Synchronized ${photos.length} favorite photo variants.\n`);
    } catch (error) {
        process.stderr.write(`Photo synchronization failed: ${error.message}\n`);
        process.exitCode = 1;
    }
}
