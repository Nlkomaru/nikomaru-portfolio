#!/usr/bin/env node

import { createHash } from "node:crypto";
import { createReadStream } from "node:fs";
import { copyFile, mkdir, mkdtemp, readFile, rename, rm, writeFile } from "node:fs/promises";
import { basename, dirname, join, resolve, sep } from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";
import { encode } from "blurhash";
import sharp from "sharp";

const defaultOutputDirectory = fileURLToPath(new URL("../app/public/photos/", import.meta.url));
const defaultManifestPath = fileURLToPath(
    new URL("../app/src/routes/(site)/_main/photos/-content/photos.json", import.meta.url),
);
const defaultStatePath = fileURLToPath(new URL("./photo-sync-state.json", import.meta.url));
const sha256Pattern = /^[a-f\d]{64}$/;
const uuidPattern = /^[a-f\d]{8}-[a-f\d]{4}-7[a-f\d]{3}-[89ab][a-f\d]{3}-[a-f\d]{12}$/;

export const STATE_VERSION = 1;
export const PROCESSING_CONFIG = Object.freeze({
    version: 1,
    rotate: true,
    maxDimension: 2560,
    fit: "inside",
    withoutEnlargement: true,
    colourspace: "srgb",
    avifQuality: 60,
    avifEffort: 4,
    previewMaxDimension: 32,
    blurhashComponentsX: 4,
    blurhashComponentsY: 3,
});

function processingConfig(overrides) {
    requireObject(overrides, "processing configuration");
    for (const key of Object.keys(overrides)) {
        if (!Object.hasOwn(PROCESSING_CONFIG, key)) throw new Error(`Invalid processing setting: ${key}.`);
    }
    const config = Object.fromEntries(
        Object.entries(PROCESSING_CONFIG).map(([key, value]) => [key, overrides[key] ?? value]),
    );
    for (const key of [
        "version",
        "maxDimension",
        "previewMaxDimension",
        "blurhashComponentsX",
        "blurhashComponentsY",
    ]) {
        if (!Number.isSafeInteger(config[key]) || config[key] < 1)
            throw new Error(`Invalid processing setting: ${key}.`);
    }
    if (
        config.rotate !== true ||
        config.fit !== "inside" ||
        config.withoutEnlargement !== true ||
        config.colourspace !== "srgb" ||
        config.previewMaxDimension > 32 ||
        config.blurhashComponentsX > 9 ||
        config.blurhashComponentsY > 9 ||
        !Number.isInteger(config.avifQuality) ||
        config.avifQuality < 1 ||
        config.avifQuality > 100 ||
        !Number.isInteger(config.avifEffort) ||
        config.avifEffort < 0 ||
        config.avifEffort > 9
    )
        throw new Error("Invalid processing configuration.");
    return config;
}

export function createProcessingFingerprint(processing = PROCESSING_CONFIG) {
    return createHash("sha256")
        .update(JSON.stringify(processingConfig(processing)))
        .digest("hex");
}

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

function requireId(value, field) {
    if (typeof value !== "string" || !uuidPattern.test(value)) {
        throw new Error(`Invalid ${field}: expected a canonical lowercase UUIDv7.`);
    }
    return value;
}

function requireDigest(value, field) {
    if (typeof value !== "string" || !/^[a-f\d]{64}$/i.test(value)) {
        throw new Error(`Invalid ${field}: expected a 64-character hexadecimal SHA256 digest.`);
    }
    return value.toLowerCase();
}

function optionalText(value, field) {
    if (value === undefined || value === null) return "";
    if (typeof value !== "string") throw new Error(`Invalid ${field}: expected text or null.`);
    return value.trim();
}

function readSummary(value) {
    const photo = requireObject(value, "photo summary");
    requireId(photo.id, "photo ID");
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

function originalRevision(photo) {
    if (!Number.isSafeInteger(photo.jpegByteSize) || photo.jpegByteSize < 1) {
        throw new Error("Invalid original JPEG byte size: expected a positive safe integer.");
    }
    if (!Number.isSafeInteger(photo.updatedAt) || photo.updatedAt < 0) {
        throw new Error("Invalid original updatedAt: expected nonnegative integer epoch milliseconds.");
    }
    // Omoide's original HEAD has no usable validators. jpegSha256 identifies the
    // pre-compression image, so updatedAt conservatively invalidates even metadata edits.
    return [
        photo.jpegSha256 == null ? null : requireDigest(photo.jpegSha256, "original JPEG identity"),
        photo.jpegByteSize,
        photo.updatedAt,
    ];
}

function imageSource(photo, development, baseUrl) {
    const isOriginal = development === null;
    const id = isOriginal ? photo.id : requireId(development.id, "development ID");
    const hash = isOriginal ? null : requireDigest(development.sha256, "development image SHA256");
    const album = captureDate(photo);
    const cameraMake = optionalText(photo.cameraMake, "camera make");
    const cameraModel = optionalText(photo.cameraModel, "camera model");
    const cameraLabel = cameraModel.toLowerCase().startsWith(cameraMake.toLowerCase())
        ? cameraModel
        : [cameraMake, cameraModel].filter(Boolean).join(" ");
    return {
        kind: isOriginal ? "original" : "development",
        revision: isOriginal ? originalRevision(photo) : [hash],
        url: sourceUrl(isOriginal ? photo.jpegUrl : development.url, baseUrl),
        sha256: hash,
        takenAt: photo.takenAt,
        entry: {
            id,
            album,
            src: `/photos/${id}.avif`,
            alt: `Photo taken on ${album} — ${isOriginal ? "Original" : "Developed"}`,
            cameraLabel,
            lensLabel: optionalText(photo.lensModel, "lens model"),
        },
    };
}

function apiBaseUrl(value) {
    let url;
    try {
        url = new URL(value);
    } catch {
        throw new Error("OMOIDE_API_URL must be a valid HTTP(S) URL.");
    }
    if (!["https:", "http:"].includes(url.protocol) || url.username || url.password || url.search || url.hash) {
        throw new Error("OMOIDE_API_URL must be an HTTP(S) URL without credentials, query parameters, or fragments.");
    }
    return url;
}

async function fetchResponse(url, apiKey, context, stats, asset = false) {
    if (stats) stats[asset ? "assetDownloads" : "metadataRequests"]++;
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

async function fetchJson(url, apiKey, context, stats) {
    const response = await fetchResponse(url, apiKey, context, stats);
    try {
        return await response.json();
    } catch {
        throw new Error(`Invalid ${context}: expected JSON.`);
    }
}

async function collectPhotos(baseUrl, apiKey, stats) {
    const parents = new Map();
    for (const filter of ["favorite", "hasFavoriteDevelopment"]) {
        let cursor = null;
        const seenCursors = new Set();
        do {
            const url = new URL("/api/v1/photos", baseUrl);
            url.searchParams.set(filter, "true");
            url.searchParams.set("limit", "200");
            if (cursor !== null) url.searchParams.set("cursor", cursor);
            const page = requireObject(await fetchJson(url, apiKey, "photo list", stats), "photo list");
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

/** Sources are ephemeral: only revision, kind, and generated artifact metadata belong in state. */
export async function collectSources(baseUrl, apiKey, { stats } = {}) {
    if (typeof apiKey !== "string" || apiKey.trim() === "") throw new Error("OMOIDE_API_KEY is required.");
    const apiUrl = apiBaseUrl(baseUrl);
    const parents = await collectPhotos(apiUrl, apiKey, stats);
    const sources = [];
    const sourceIds = new Set();
    const add = (source) => {
        if (sourceIds.has(source.entry.id)) throw new Error("Invalid favorite sources: duplicate image UUIDv7.");
        sourceIds.add(source.entry.id);
        sources.push(source);
    };
    for (const parent of parents.values()) {
        let photo = parent.photo;
        let developments = [];
        if (parent.needsDetails) {
            const url = new URL(`/api/v1/photos/${photo.id}`, apiUrl);
            const detail = await fetchJson(url, apiKey, "photo details", stats);
            photo = readSummary(detail);
            if (photo.id !== parent.photo.id) throw new Error("Invalid photo details: parent ID does not match.");
            if (!Array.isArray(detail.developments))
                throw new Error("Invalid photo details: expected a developments array.");
            developments = detail.developments;
        }
        if (photo.isFavorite) add(imageSource(photo, null, apiUrl));
        const seenIds = new Set();
        for (const value of developments) {
            const development = requireObject(value, "development");
            if (typeof development.isFavorite !== "boolean") {
                throw new Error("Invalid development favorite flag: expected a boolean.");
            }
            if (!development.isFavorite) continue;
            requireId(development.id, "development ID");
            if (development.photoId !== photo.id) throw new Error("Invalid development: parent ID does not match.");
            if (seenIds.has(development.id)) throw new Error("Invalid photo details: duplicate development ID.");
            seenIds.add(development.id);
            add(imageSource(photo, development, apiUrl));
        }
    }
    sources.sort((a, b) => b.takenAt - a.takenAt || (a.entry.id < b.entry.id ? -1 : a.entry.id > b.entry.id ? 1 : 0));
    return sources;
}

async function convertImage(source, apiKey, config, stats) {
    const response = await fetchResponse(source.url, apiKey, "favorite image", stats, true);
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
        stats.encodes++;
        const { data, info } = await image
            .rotate()
            .resize({
                width: config.maxDimension,
                height: config.maxDimension,
                fit: config.fit,
                withoutEnlargement: config.withoutEnlargement,
            })
            .toColourspace(config.colourspace)
            .avif({ quality: config.avifQuality, effort: config.avifEffort })
            .toBuffer({ resolveWithObject: true });
        const preview = await sharp(data)
            .resize({
                width: config.previewMaxDimension,
                height: config.previewMaxDimension,
                fit: config.fit,
                withoutEnlargement: true,
            })
            .toColourspace(config.colourspace)
            .ensureAlpha()
            .raw()
            .toBuffer({ resolveWithObject: true });
        const pixels = new Uint8ClampedArray(preview.data.buffer, preview.data.byteOffset, preview.data.byteLength);
        return {
            data,
            width: info.width,
            height: info.height,
            blurhash: encode(
                pixels,
                preview.info.width,
                preview.info.height,
                config.blurhashComponentsX,
                config.blurhashComponentsY,
            ),
        };
    } catch {
        throw new Error("Unable to convert favorite image: expected a valid JPEG, PNG, WebP, or AVIF image.");
    }
}

function validRevision(kind, revision) {
    if (!Array.isArray(revision)) return false;
    if (kind === "development")
        return revision.length === 1 && typeof revision[0] === "string" && sha256Pattern.test(revision[0]);
    return (
        kind === "original" &&
        revision.length === 3 &&
        (revision[0] === null || (typeof revision[0] === "string" && sha256Pattern.test(revision[0]))) &&
        Number.isSafeInteger(revision[1]) &&
        revision[1] > 0 &&
        Number.isSafeInteger(revision[2]) &&
        revision[2] >= 0
    );
}

async function readState(path) {
    let text;
    try {
        text = await readFile(path, "utf8");
    } catch (error) {
        if (error.code === "ENOENT") return null;
        throw error;
    }
    let state;
    try {
        state = JSON.parse(text);
    } catch {
        throw new Error("Invalid photo sync state: expected JSON.");
    }
    requireObject(state, "photo sync state");
    requireObject(state.photos, "photo sync state photos");
    if (
        state.version !== STATE_VERSION ||
        typeof state.processingFingerprint !== "string" ||
        !sha256Pattern.test(state.processingFingerprint)
    ) {
        throw new Error("Invalid photo sync state: unsupported version or processing fingerprint.");
    }
    for (const [id, artifact] of Object.entries(state.photos)) {
        requireId(id, "state photo ID");
        requireObject(artifact, "photo sync artifact");
        if (
            !validRevision(artifact.kind, artifact.revision) ||
            typeof artifact.sha256 !== "string" ||
            !sha256Pattern.test(artifact.sha256) ||
            !Number.isSafeInteger(artifact.byteSize) ||
            artifact.byteSize < 1 ||
            !Number.isSafeInteger(artifact.width) ||
            artifact.width < 1 ||
            !Number.isSafeInteger(artifact.height) ||
            artifact.height < 1 ||
            typeof artifact.blurhash !== "string" ||
            artifact.blurhash.length < 6 ||
            !/^[\x21-\x7e]+$/.test(artifact.blurhash)
        ) {
            throw new Error("Invalid photo sync state artifact metadata.");
        }
    }
    return state;
}

async function artifactIntegrity(path) {
    const hash = createHash("sha256");
    let byteSize = 0;
    try {
        for await (const chunk of createReadStream(path)) {
            hash.update(chunk);
            byteSize += chunk.length;
        }
    } catch (error) {
        if (error.code === "ENOENT" || error.code === "EISDIR") return null;
        throw error;
    }
    return { sha256: hash.digest("hex"), byteSize };
}

function outputPaths(outputDirectory, manifestPath, statePath) {
    const output = resolve(outputDirectory);
    const isDefault = output === resolve(defaultOutputDirectory);
    const manifest = resolve(
        manifestPath ?? (isDefault ? defaultManifestPath : join(dirname(output), `${basename(output)}.json`)),
    );
    const state = resolve(
        statePath ?? (isDefault ? defaultStatePath : join(dirname(output), `${basename(output)}-sync-state.json`)),
    );
    const paths = [output, manifest, state];
    for (let i = 0; i < paths.length; i++) {
        for (let j = i + 1; j < paths.length; j++) {
            if (
                paths[i] === paths[j] ||
                paths[i].startsWith(`${paths[j]}${sep}`) ||
                paths[j].startsWith(`${paths[i]}${sep}`)
            ) {
                throw new Error("Photo output directory, manifest, and state must be separate, nonoverlapping paths.");
            }
        }
    }
    return { output, manifest, state };
}

async function stageTarget(destination, publications) {
    await mkdir(dirname(destination), { recursive: true });
    const staging = await mkdtemp(join(dirname(destination), `.${basename(destination)}-staging-`));
    const publication = {
        destination,
        staging,
        next: join(staging, "next"),
        previous: join(staging, "previous"),
        hadPrevious: false,
        installed: false,
    };
    publications.push(publication);
    return publication;
}

async function publish(publications, onComplete) {
    try {
        for (const publication of publications) {
            try {
                await rename(publication.destination, publication.previous);
                publication.hadPrevious = true;
            } catch (error) {
                if (error.code !== "ENOENT") throw error;
            }
            await rename(publication.next, publication.destination);
            publication.installed = true;
        }
        await onComplete?.();
    } catch (error) {
        let restored = true;
        for (const publication of [...publications].reverse()) {
            try {
                if (publication.installed) await rm(publication.destination, { recursive: true, force: true });
                if (publication.hadPrevious) await rename(publication.previous, publication.destination);
            } catch {
                restored = false;
            }
        }
        if (!restored) {
            for (const publication of publications) publication.preserve = true;
            throw new Error(
                "Unable to restore the photo publication; previous outputs remain in staging directories.",
                { cause: error },
            );
        }
        throw error;
    }
}

/** Publish explicitly favorited variants; reuse only intact artifacts with identical revisions and processing. */
export async function syncPhotos({
    baseUrl = process.env.OMOIDE_API_URL || "https://omoide.nikomaru.dev",
    apiKey = process.env.OMOIDE_API_KEY,
    outputDirectory = defaultOutputDirectory,
    manifestPath,
    statePath,
    processing = PROCESSING_CONFIG,
    onProgress,
} = {}) {
    const paths = outputPaths(outputDirectory, manifestPath, statePath);
    const config = processingConfig(processing);
    const fingerprint = createProcessingFingerprint(config);
    const stats = { metadataRequests: 0, assetDownloads: 0, encodes: 0, reused: 0 };
    const sources = await collectSources(baseUrl, apiKey, { stats });
    const oldState = await readState(paths.state);
    const publications = [];
    try {
        const output = await stageTarget(paths.output, publications);
        const manifestTarget = await stageTarget(paths.manifest, publications);
        const stateTarget = await stageTarget(paths.state, publications);
        await mkdir(output.next);
        const manifest = { photos: [] };
        const state = { version: STATE_VERSION, processingFingerprint: fingerprint, photos: {} };
        for (const source of sources) {
            const id = source.entry.id;
            const old = oldState?.photos[id];
            const previousPath = join(paths.output, `${id}.avif`);
            const nextPath = join(output.next, `${id}.avif`);
            let artifact;
            if (
                oldState?.processingFingerprint === fingerprint &&
                old?.kind === source.kind &&
                JSON.stringify(old.revision) === JSON.stringify(source.revision)
            ) {
                let integrity = null;
                try {
                    await copyFile(previousPath, nextPath);
                    integrity = await artifactIntegrity(nextPath);
                } catch (error) {
                    if (error.code !== "ENOENT" && error.code !== "EISDIR") throw error;
                }
                if (integrity?.sha256 === old.sha256 && integrity.byteSize === old.byteSize) {
                    artifact = {
                        sha256: old.sha256,
                        byteSize: old.byteSize,
                        width: old.width,
                        height: old.height,
                        blurhash: old.blurhash,
                    };
                    stats.reused++;
                }
            }
            if (!artifact) {
                const converted = await convertImage(source, apiKey, config, stats);
                await writeFile(nextPath, converted.data);
                artifact = {
                    sha256: createHash("sha256").update(converted.data).digest("hex"),
                    byteSize: converted.data.length,
                    width: converted.width,
                    height: converted.height,
                    blurhash: converted.blurhash,
                };
            }
            state.photos[id] = { kind: source.kind, revision: source.revision, ...artifact };
            manifest.photos.push({
                ...source.entry,
                width: artifact.width,
                height: artifact.height,
                blurhash: artifact.blurhash,
            });
        }
        await writeFile(manifestTarget.next, `${JSON.stringify(manifest, null, 4)}\n`);
        await writeFile(stateTarget.next, `${JSON.stringify(state, null, 4)}\n`);
        await publish(publications, () => onProgress?.({ type: "complete", ...stats }));
        return manifest;
    } finally {
        for (const publication of publications) {
            if (!publication.preserve) await rm(publication.staging, { recursive: true, force: true });
        }
    }
}

if (process.argv[1] && pathToFileURL(resolve(process.argv[1])).href === import.meta.url) {
    try {
        const { photos } = await syncPhotos({
            onProgress: ({ metadataRequests, assetDownloads, encodes, reused }) => {
                process.stdout.write(
                    `Photo sync: metadataRequests=${metadataRequests} assetDownloads=${assetDownloads} encodes=${encodes} reused=${reused}\n`,
                );
            },
        });
        process.stdout.write(`Synchronized ${photos.length} favorite photo variants.\n`);
    } catch (error) {
        process.stderr.write(`Photo synchronization failed: ${error.message}\n`);
        process.exitCode = 1;
    }
}
