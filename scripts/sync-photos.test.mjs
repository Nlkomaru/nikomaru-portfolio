import assert from "node:assert/strict";
import { createHash } from "node:crypto";
import { mkdtemp, readdir, readFile, rm, writeFile } from "node:fs/promises";
import { createServer } from "node:http";
import { tmpdir } from "node:os";
import { basename, join } from "node:path";
import test from "node:test";
import { encode } from "blurhash";
import sharp from "sharp";
import {
    collectSources,
    createProcessingFingerprint,
    PROCESSING_CONFIG,
    STATE_VERSION,
    syncPhotos,
} from "./sync-photos.mjs";

const apiKey = "test-only-omoide-key";
const captureTime = Date.parse("2026-01-01T16:00:00Z");
const uuid = (number) => `019a5520-1234-7000-8000-${number.toString(16).padStart(12, "0")}`;
const digest = (data) => createHash("sha256").update(data).digest("hex");

async function fixture(format = "png", { width = 12, height = 8, color = "#3580b8", orientation } = {}) {
    let image = sharp({ create: { width, height, channels: 3, background: color } });
    if (orientation !== undefined) image = image.withMetadata({ orientation });
    const data = await image.toFormat(format).toBuffer();
    return { data, sha256: digest(data) };
}

function summary(number, image, overrides = {}) {
    const id = typeof number === "number" ? uuid(number) : number;
    return {
        id,
        originalFilename: `private-archive-${id}.jpg`,
        takenAt: captureTime,
        timezoneOffset: "+09:00",
        jpegUrl: `/assets/${id}`,
        jpegSha256: image.sha256,
        jpegByteSize: image.data.length,
        updatedAt: captureTime,
        isFavorite: true,
        favoriteDevelopmentsCount: 0,
        cameraMake: "Sony",
        cameraModel: "ILCE-7M4",
        lensModel: "FE 35mm F1.8",
        description: "private-archive-description",
        blurhash: "never-copy-the-source-blurhash",
        userId: "private-user-id",
        exif: { GPSLatitude: 35.1234, GPSLongitude: 139.1234 },
        posts: [{ body: "private-post-content" }],
        ...overrides,
    };
}

function development(number, parent, image, overrides = {}) {
    const id = typeof number === "number" ? uuid(number) : number;
    return {
        id,
        photoId: parent.id,
        format: "png",
        label: `private-development-label-${id}`,
        url: `/assets/${id}`,
        sha256: image.sha256,
        byteSize: image.data.length,
        width: 12,
        height: 8,
        blurhash: "never-copy-the-development-blurhash",
        isFavorite: true,
        developedAt: captureTime,
        createdAt: captureTime,
        ...overrides,
    };
}

function json(response, value) {
    response.writeHead(200, { "Content-Type": "application/json" });
    response.end(JSON.stringify(value));
}

function imageResponse(response, image) {
    response.writeHead(200, { "Content-Type": "application/octet-stream" });
    response.end(image.data);
}

async function localApi(t, handler) {
    const requests = [];
    const server = createServer((request, response) => {
        const url = new URL(request.url, "http://localhost");
        requests.push({ url, method: request.method, authorization: request.headers.authorization });
        Promise.resolve()
            .then(() => handler(url, response, request))
            .catch(() => {
                if (!response.headersSent) response.writeHead(500);
                response.end();
            });
    });
    await new Promise((resolve, reject) => {
        server.once("error", reject);
        server.listen(0, "127.0.0.1", resolve);
    });
    t.after(async () => {
        server.closeAllConnections();
        await new Promise((resolve, reject) => server.close((error) => (error ? reject(error) : resolve())));
    });
    return { baseUrl: `http://127.0.0.1:${server.address().port}`, requests };
}

async function galleryApi(t, model) {
    return localApi(t, (url, response, request) => {
        if (model.reply?.(url, response, request)) return;
        if (url.pathname === "/api/v1/photos") {
            const favorites = url.searchParams.has("favorite");
            return json(response, {
                photos: model.photos.filter((photo) =>
                    favorites ? photo.isFavorite : photo.favoriteDevelopmentsCount > 0,
                ),
                nextCursor: null,
            });
        }
        const parent = model.photos.find((photo) => url.pathname === `/api/v1/photos/${photo.id}`);
        if (parent) return json(response, { ...parent, developments: model.developments?.get(parent.id) ?? [] });
        const image = model.images.get(url.pathname);
        if (image) return imageResponse(response, image);
        response.writeHead(404).end();
    });
}

async function workspace(t) {
    const root = await mkdtemp(join(tmpdir(), "portfolio-photo-sync-test-"));
    t.after(() => rm(root, { recursive: true, force: true }));
    return {
        root,
        outputDirectory: join(root, "photos"),
        manifestPath: join(root, "photos.json"),
        statePath: join(root, "photos-sync-state.json"),
    };
}

function options(api, work) {
    // Intentionally omit manifestPath/statePath: custom outputs must isolate their defaults.
    return { baseUrl: api.baseUrl, apiKey, outputDirectory: work.outputDirectory };
}

async function snapshot(work) {
    const files = [];
    for (const filename of (await readdir(work.outputDirectory)).sort()) {
        files.push([filename, await readFile(join(work.outputDirectory, filename))]);
    }
    return {
        manifest: await readFile(work.manifestPath),
        state: await readFile(work.statePath),
        files,
    };
}

async function runSync(configuration) {
    const events = [];
    const manifest = await syncPhotos({ ...configuration, onProgress: (event) => events.push(event) });
    assert.deepEqual(Object.keys(manifest), ["photos"], "observability does not change the manifest contract");
    assert.equal(events.length, 1);
    assert.equal(events[0].type, "complete");
    return { manifest, report: events[0] };
}

function assertWorkCounts(report, { downloads, encodes = downloads, reused }) {
    assert.equal(report.assetDownloads, downloads);
    assert.equal(report.encodes, encodes);
    assert.equal(report.reused, reused);
}

async function outputBlurhash(data) {
    const preview = await sharp(data)
        .resize({ width: 32, height: 32, fit: "inside", withoutEnlargement: true })
        .toColourspace("srgb")
        .ensureAlpha()
        .raw()
        .toBuffer({ resolveWithObject: true });
    return encode(
        new Uint8ClampedArray(preview.data.buffer, preview.data.byteOffset, preview.data.byteLength),
        preview.info.width,
        preview.info.height,
        4,
        3,
    );
}

test("unions both independently paginated favorite lists, preserves UUIDv7 IDs, and keeps all persisted data public-safe", async (t) => {
    const jpeg = await fixture("jpeg", { orientation: 6 });
    const png = await fixture("png");
    const webp = await fixture("webp");
    const avif = await fixture("avif");
    const original = summary(1, jpeg);
    const both = summary(2, png, {
        takenAt: captureTime - 86_400_000,
        favoriteDevelopmentsCount: 1,
        cameraModel: "Sony A7 IV",
        timezoneOffset: "-07:00",
    });
    const developedOnly = summary(3, png, {
        isFavorite: false,
        favoriteDevelopmentsCount: 3,
        takenAt: captureTime + 3_600_000,
        jpegUrl: "https://must-not-fetch.invalid/private-original",
        jpegSha256: null,
        jpegByteSize: null,
        updatedAt: null,
        cameraMake: null,
        cameraModel: null,
        lensModel: null,
    });
    const bothFavorite = development(4, both, webp);
    const onlyAvif = development(5, developedOnly, avif, { format: "avif" });
    const onlyPng = development(6, developedOnly, png);
    const samePng = development(7, developedOnly, png);
    const notFavorite = development(8, both, png, {
        isFavorite: false,
        url: "https://must-not-fetch.invalid/nonfavorite",
        sha256: null,
    });
    const assets = new Map([
        [original.jpegUrl, jpeg],
        [both.jpegUrl, png],
        [bothFavorite.url, webp],
        [onlyAvif.url, avif],
        [onlyPng.url, png],
        [samePng.url, png],
    ]);
    const favoriteCursor = "favorites-page-2&opaque=value";
    const developmentCursor = "developments-page-2+opaque";
    const api = await localApi(t, (url, response) => {
        if (url.pathname === "/api/v1/photos") {
            assert.equal(url.searchParams.get("limit"), "200");
            if (url.searchParams.get("favorite") === "true") {
                assert.equal(url.searchParams.has("hasFavoriteDevelopment"), false);
                if (url.searchParams.has("cursor")) {
                    assert.equal(url.searchParams.get("cursor"), favoriteCursor);
                    return json(response, { photos: [both], nextCursor: null });
                }
                return json(response, { photos: [original], nextCursor: favoriteCursor });
            }
            assert.equal(url.searchParams.get("hasFavoriteDevelopment"), "true");
            if (url.searchParams.has("cursor")) {
                assert.equal(url.searchParams.get("cursor"), developmentCursor);
                return json(response, { photos: [both], nextCursor: null });
            }
            return json(response, { photos: [developedOnly], nextCursor: developmentCursor });
        }
        if (url.pathname === `/api/v1/photos/${both.id}`)
            return json(response, { ...both, developments: [notFavorite, bothFavorite] });
        if (url.pathname === `/api/v1/photos/${developedOnly.id}`)
            return json(response, { ...developedOnly, developments: [samePng, onlyPng, onlyAvif] });
        const image = assets.get(url.pathname);
        if (image) return imageResponse(response, image);
        response.writeHead(404).end();
    });
    const work = await workspace(t);
    const configuration = options(api, work);
    const { manifest, report } = await runSync(configuration);
    assert.deepEqual(
        manifest.photos.map((photo) => photo.id),
        [onlyAvif.id, onlyPng.id, samePng.id, original.id, both.id, bothFavorite.id],
    );
    assert.equal(report.metadataRequests, 6);
    assertWorkCounts(report, { downloads: 6, reused: 0 });
    const entryKeys = ["id", "album", "src", "alt", "width", "height", "blurhash", "cameraLabel", "lensLabel"].sort();
    for (const photo of manifest.photos) {
        assert.deepEqual(Object.keys(photo).sort(), entryKeys);
        assert.equal(photo.src, `/photos/${photo.id}.avif`);
        const data = await readFile(join(work.outputDirectory, basename(photo.src)));
        const metadata = await sharp(data).metadata();
        assert.ok(["heif", "avif"].includes(metadata.format));
        assert.equal(metadata.width, photo.width);
        assert.equal(metadata.height, photo.height);
        assert.equal(metadata.exif, undefined);
        assert.equal(metadata.icc, undefined);
        assert.equal(photo.blurhash, await outputBlurhash(data));
        assert.notEqual(photo.blurhash, "never-copy-the-source-blurhash");
        if (photo.cameraLabel === "") {
            assert.equal(photo.album, "2026-01-02");
            assert.equal(photo.lensLabel, "");
        } else if (photo.cameraLabel === "Sony A7 IV") {
            assert.equal(photo.album, "2025-12-31");
        } else {
            assert.equal(photo.id, original.id);
            assert.equal(photo.album, "2026-01-02");
            assert.equal(photo.width, 8);
            assert.equal(photo.height, 12);
            assert.equal(photo.cameraLabel, "Sony ILCE-7M4");
        }
    }
    const before = await snapshot(work);
    const state = JSON.parse(before.state);
    assert.deepEqual(Object.keys(state).sort(), ["photos", "processingFingerprint", "version"]);
    assert.equal(state.version, STATE_VERSION);
    assert.equal(state.processingFingerprint, createProcessingFingerprint());
    assert.deepEqual(state.photos[original.id].revision, [jpeg.sha256, jpeg.data.length, captureTime]);
    assert.deepEqual(state.photos[onlyAvif.id].revision, [avif.sha256]);
    const stateKeys = ["kind", "revision", "sha256", "byteSize", "width", "height", "blurhash"].sort();
    for (const [id, artifact] of Object.entries(state.photos)) {
        assert.deepEqual(Object.keys(artifact).sort(), stateKeys);
        const data = await readFile(join(work.outputDirectory, `${id}.avif`));
        assert.equal(artifact.sha256, digest(data));
        assert.equal(artifact.byteSize, data.length);
    }
    const persisted = `${before.manifest}\n${before.state}`;
    for (const privateValue of [
        apiKey,
        api.baseUrl,
        "private-user-id",
        "GPSLatitude",
        "GPSLongitude",
        "private-post-content",
        "jpegUrl",
        "/assets/",
        ...[original, both, developedOnly].flatMap((photo) => [photo.originalFilename, photo.description]),
        ...[bothFavorite, onlyAvif, onlyPng, samePng].map((photo) => photo.label),
        "never-copy-the-source-blurhash",
        "never-copy-the-development-blurhash",
    ])
        assert.equal(persisted.includes(privateValue), false, privateValue);
    assert.deepEqual(
        new Set(before.files.map(([name]) => name)),
        new Set(manifest.photos.map((photo) => `${photo.id}.avif`)),
    );
    const requestCount = api.requests.length;
    const repeated = await runSync(configuration);
    assert.deepEqual(repeated.manifest, manifest);
    assertWorkCounts(repeated.report, { downloads: 0, reused: 6 });
    assert.equal(repeated.report.metadataRequests, 6);
    assert.deepEqual(await snapshot(work), before, "unchanged sync leaves the entire generated set byte-identical");
    assert.equal(
        api.requests.slice(requestCount).some(({ url }) => url.pathname.startsWith("/assets/")),
        false,
    );
    assert.ok(
        api.requests.every(({ method, authorization }) => method === "GET" && authorization === `Bearer ${apiKey}`),
    );
    assert.deepEqual((await readdir(work.root)).sort(), ["photos", "photos-sync-state.json", "photos.json"]);
});

test("accepts original precompression identities without checking them against served bytes", async (t) => {
    const original = await fixture("jpeg");
    const compressed = { data: await sharp(original.data).jpeg({ quality: 40 }).toBuffer() };
    assert.notEqual(digest(compressed.data), original.sha256);
    const photo = summary(1, original);
    const model = { photos: [photo], images: new Map([[photo.jpegUrl, compressed]]) };
    const api = await galleryApi(t, model);
    const work = await workspace(t);
    const configuration = options(api, work);
    for (const identity of [original.sha256, undefined, "a".repeat(64)]) {
        photo.jpegSha256 = identity;
        const { manifest, report } = await runSync(configuration);
        assertWorkCounts(report, { downloads: 1, reused: 0 });
        assert.equal(
            manifest.photos[0].blurhash,
            await outputBlurhash(await readFile(join(work.outputDirectory, `${photo.id}.avif`))),
        );
        assert.deepEqual(JSON.parse(await readFile(work.statePath)).photos[photo.id].revision, [
            identity ?? null,
            original.data.length,
            captureTime,
        ]);
    }
});

test("updates public metadata without downloads, ignores development-only metadata revisions, and conservatively invalidates original updatedAt", async (t) => {
    const image = await fixture();
    const changed = await fixture("png", { color: "#b84050" });
    const parent = summary(1, image, { favoriteDevelopmentsCount: 1 });
    const variant = development(2, parent, image);
    const model = {
        photos: [parent],
        developments: new Map([[parent.id, [variant]]]),
        images: new Map([
            [parent.jpegUrl, image],
            [variant.url, image],
        ]),
    };
    const api = await galleryApi(t, model);
    const work = await workspace(t);
    const configuration = options(api, work);
    await syncPhotos(configuration);
    const before = await snapshot(work);
    Object.assign(parent, {
        cameraMake: "Canon",
        cameraModel: "EOS R6",
        lensModel: "RF 50mm",
        takenAt: captureTime + 86_400_000,
        timezoneOffset: "-07:00",
    });
    Object.assign(variant, {
        label: "new-private-label",
        developedAt: captureTime + 1000,
        createdAt: captureTime + 1000,
        updatedAt: captureTime + 2000,
        byteSize: 999999,
    });
    const edited = await runSync(configuration);
    assertWorkCounts(edited.report, { downloads: 0, reused: 2 });
    assert.ok(
        edited.manifest.photos.every(
            (photo) =>
                photo.cameraLabel === "Canon EOS R6" && photo.lensLabel === "RF 50mm" && photo.album === "2026-01-02",
        ),
    );
    const after = await snapshot(work);
    assert.notDeepEqual(after.manifest, before.manifest);
    assert.deepEqual(after.state, before.state);
    assert.deepEqual(after.files, before.files);
    // The served original can change without changing its precompression identity.
    parent.updatedAt++;
    model.images.set(parent.jpegUrl, changed);
    const updatedOriginal = await runSync(configuration);
    assertWorkCounts(updatedOriginal.report, { downloads: 1, reused: 1 });
    assert.notDeepEqual((await snapshot(work)).files[0][1], before.files[0][1]);
    parent.jpegByteSize++;
    assertWorkCounts((await runSync(configuration)).report, { downloads: 1, reused: 1 });
});

test("adds and changes only affected artifacts and removes unfavorited assets and state through the empty set", async (t) => {
    const image = await fixture();
    const changed = await fixture("png", { color: "#2080a0" });
    const first = summary(1, image, { favoriteDevelopmentsCount: 1 });
    const variant = development(2, first, image);
    const second = summary(3, changed, { takenAt: captureTime + 1 });
    const model = {
        photos: [first],
        developments: new Map([[first.id, [variant]]]),
        images: new Map([
            [first.jpegUrl, image],
            [variant.url, image],
            [second.jpegUrl, changed],
        ]),
    };
    const api = await galleryApi(t, model);
    const work = await workspace(t);
    const configuration = options(api, work);
    await syncPhotos(configuration);
    model.photos.push(second);
    variant.sha256 = changed.sha256;
    model.images.set(variant.url, changed);
    const added = await runSync(configuration);
    assertWorkCounts(added.report, { downloads: 2, reused: 1 });
    assert.deepEqual(
        added.manifest.photos.map((photo) => photo.id),
        [second.id, first.id, variant.id],
    );
    first.isFavorite = false;
    const removed = await runSync(configuration);
    assertWorkCounts(removed.report, { downloads: 0, reused: 2 });
    assert.deepEqual(
        removed.manifest.photos.map((photo) => photo.id),
        [second.id, variant.id],
    );
    assert.deepEqual((await readdir(work.outputDirectory)).sort(), [`${variant.id}.avif`, `${second.id}.avif`]);
    assert.equal(Object.hasOwn(JSON.parse(await readFile(work.statePath)).photos, first.id), false);
    model.photos = [];
    const empty = await runSync(configuration);
    assert.deepEqual(empty.manifest, { photos: [] });
    assertWorkCounts(empty.report, { downloads: 0, reused: 0 });
    assert.deepEqual(JSON.parse(await readFile(work.manifestPath)), { photos: [] });
    assert.deepEqual(JSON.parse(await readFile(work.statePath)).photos, {});
    assert.deepEqual(await readdir(work.outputDirectory), []);
});

test("repairs only missing or same-size corrupt artifacts and fingerprints every processing setting", async (t) => {
    const image = await fixture();
    const photos = [1, 2, 3].map((number) => summary(number, image));
    const api = await galleryApi(t, { photos, images: new Map(photos.map((photo) => [photo.jpegUrl, image])) });
    const work = await workspace(t);
    const configuration = options(api, work);
    await syncPhotos(configuration);
    const before = await snapshot(work);
    await rm(join(work.outputDirectory, `${photos[0].id}.avif`));
    const corrupted = Buffer.from(before.files[1][1]);
    corrupted[corrupted.length - 1] ^= 1;
    await writeFile(join(work.outputDirectory, `${photos[1].id}.avif`), corrupted);
    assertWorkCounts((await runSync(configuration)).report, { downloads: 2, reused: 1 });
    assert.deepEqual(await snapshot(work), before);
    const altered = { ...configuration, processing: { avifQuality: 61 } };
    assertWorkCounts((await runSync(altered)).report, { downloads: 3, reused: 0 });
    assert.equal(
        JSON.parse(await readFile(work.statePath)).processingFingerprint,
        createProcessingFingerprint({ avifQuality: 61 }),
    );
    const changedSnapshot = await snapshot(work);
    assertWorkCounts((await runSync(altered)).report, { downloads: 0, reused: 3 });
    assert.deepEqual(await snapshot(work), changedSnapshot);
    assertWorkCounts((await runSync({ ...altered, processing: { avifQuality: 61, version: 2 } })).report, {
        downloads: 3,
        reused: 0,
    });
    for (const [key, value] of Object.entries({
        ...PROCESSING_CONFIG,
        maxDimension: 1280,
        previewMaxDimension: 24,
        blurhashComponentsX: 3,
        blurhashComponentsY: 2,
        avifEffort: 3,
    })) {
        if (value !== PROCESSING_CONFIG[key])
            assert.notEqual(createProcessingFingerprint({ [key]: value }), createProcessingFingerprint());
    }
    const reordered = Object.fromEntries(Object.entries(PROCESSING_CONFIG).reverse());
    assert.equal(createProcessingFingerprint(reordered), createProcessingFingerprint());
});

test("exposes clean source and explicit output contracts without putting a manifest or state among public assets", async (t) => {
    const image = await fixture();
    const photo = summary(1, image);
    const api = await galleryApi(t, { photos: [photo], images: new Map([[photo.jpegUrl, image]]) });
    const sources = await collectSources(new URL(api.baseUrl), apiKey);
    assert.equal(sources[0].entry.id, photo.id);
    assert.equal(sources[0].kind, "original");
    assert.equal(sources[0].sha256, null);
    assert.deepEqual(sources[0].revision, [image.sha256, image.data.length, captureTime]);
    const work = await workspace(t);
    work.manifestPath = join(work.root, "content", "photos.json");
    work.statePath = join(work.root, "generated", "state.json");
    await syncPhotos({ ...options(api, work), manifestPath: work.manifestPath, statePath: work.statePath });
    assert.deepEqual(await readdir(work.outputDirectory), [`${photo.id}.avif`]);
    assert.deepEqual(
        JSON.parse(await readFile(work.manifestPath)).photos.map((entry) => entry.id),
        [photo.id],
    );
    assert.equal(JSON.parse(await readFile(work.statePath)).version, STATE_VERSION);
    assert.deepEqual((await readdir(work.root)).sort(), ["content", "generated", "photos"]);
    await assert.rejects(
        syncPhotos({ ...options(api, work), statePath: join(work.outputDirectory, "state.json") }),
        /nonoverlapping paths/,
    );
});

test("rejects noncanonical UUIDs and collisions before downloading or publishing", async (t) => {
    const image = await fixture();
    const cases = [
        { name: "path traversal", photoId: "../../private" },
        { name: "uppercase", photoId: uuid(10).toUpperCase() },
        { name: "wrong version", photoId: uuid(1).replace("-7000-", "-4000-") },
        { name: "wrong variant", photoId: uuid(1).replace("-8000-", "-c000-") },
        { name: "development UUID", developmentId: "unsafe-development" },
        { name: "original-development collision", developmentId: uuid(1) },
        { name: "duplicate development", duplicate: true },
        { name: "cross-parent development collision", crossParent: true },
    ];
    for (const scenario of cases) {
        await t.test(scenario.name, async (t) => {
            const first = summary(scenario.photoId ?? uuid(1), image, { favoriteDevelopmentsCount: 1 });
            const variant = development(scenario.developmentId ?? uuid(2), first, image);
            const photos = [first];
            const developments = new Map([[first.id, scenario.duplicate ? [variant, variant] : [variant]]]);
            if (scenario.crossParent) {
                const second = summary(3, image, { favoriteDevelopmentsCount: 1, isFavorite: false });
                photos.push(second);
                developments.set(second.id, [development(2, second, image)]);
            }
            const api = await galleryApi(t, { photos, developments, images: new Map() });
            const work = await workspace(t);
            await assert.rejects(syncPhotos(options(api, work)), /canonical lowercase UUIDv7|duplicate/);
            assert.equal(
                api.requests.some(({ url }) => url.pathname.startsWith("/assets/")),
                false,
            );
            assert.deepEqual(await readdir(work.root), []);
        });
    }
});

test("preserves the complete publication on partial-download, network, checksum, and malformed API failures", async (t) => {
    const originalImage = await fixture("png", { color: "#b82050" });
    const changedImage = await fixture("png", { color: "#2090a0" });
    const failures = {
        http: /HTTP 503/,
        network: /network errors and redirects/,
        checksum: /SHA256 does not match/,
        "invalid-image": /Unable to convert favorite image/,
        "malformed-page": /nextCursor/,
        "malformed-json": /expected JSON/,
        "malformed-detail": /parent ID does not match/,
        "malformed-developments": /developments array/,
        "repeated-cursor": /pagination cursor repeated/,
        "invalid-digest": /image SHA256/,
        "wrong-development-parent": /parent ID does not match/,
    };
    for (const [failure, expectedError] of Object.entries(failures)) {
        await t.test(failure, async (t) => {
            let failing = false;
            let firstDownloads = 0;
            const first = summary(1, originalImage);
            const requiresDevelopment = [
                "checksum",
                "malformed-detail",
                "malformed-developments",
                "invalid-digest",
                "wrong-development-parent",
            ].includes(failure);
            const second = summary(2, changedImage, {
                isFavorite: !requiresDevelopment,
                favoriteDevelopmentsCount: requiresDevelopment ? 1 : 0,
            });
            const variant = development(3, second, changedImage);
            const api = await localApi(t, (url, response, request) => {
                if (url.pathname === "/api/v1/photos") {
                    if (url.searchParams.has("hasFavoriteDevelopment"))
                        return json(response, { photos: [], nextCursor: null });
                    if (failing && failure === "malformed-page") return json(response, { photos: [first] });
                    if (failing && failure === "malformed-json") return response.writeHead(200).end("{");
                    if (failing && failure === "repeated-cursor")
                        return json(response, { photos: [first], nextCursor: "same" });
                    return json(response, { photos: failing ? [first, second] : [first], nextCursor: null });
                }
                if (url.pathname === `/api/v1/photos/${second.id}`) {
                    return json(response, {
                        ...second,
                        id: failure === "malformed-detail" ? uuid(99) : second.id,
                        developments:
                            failure === "malformed-developments"
                                ? null
                                : [
                                      {
                                          ...variant,
                                          sha256: failure === "invalid-digest" ? "not-a-digest" : variant.sha256,
                                          photoId: failure === "wrong-development-parent" ? first.id : second.id,
                                      },
                                  ],
                    });
                }
                if (url.pathname === first.jpegUrl) {
                    firstDownloads++;
                    return imageResponse(response, failing ? changedImage : originalImage);
                }
                if ([second.jpegUrl, variant.url].includes(url.pathname)) {
                    if (failure === "http") return response.writeHead(503).end();
                    if (failure === "network") return request.socket.destroy();
                    if (failure === "checksum") return imageResponse(response, originalImage);
                    return response.writeHead(200).end("not an image");
                }
                response.writeHead(404).end();
            });
            const work = await workspace(t);
            const configuration = options(api, work);
            await syncPhotos(configuration);
            const before = await snapshot(work);
            first.updatedAt++;
            failing = true;
            await assert.rejects(syncPhotos(configuration), expectedError);
            assert.deepEqual(await snapshot(work), before);
            assert.deepEqual((await readdir(work.root)).sort(), ["photos", "photos-sync-state.json", "photos.json"]);
            if (["http", "network", "checksum", "invalid-image"].includes(failure))
                assert.equal(
                    firstDownloads,
                    2,
                    "a successfully staged replacement must not leak into the previous publication",
                );
        });
    }
});

test("rolls back all three published destinations if failure occurs after installing them", async (t) => {
    const image = await fixture();
    const changed = await fixture("png", { color: "#d03070" });
    const first = summary(1, image);
    const model = { photos: [first], images: new Map([[first.jpegUrl, image]]) };
    const api = await galleryApi(t, model);
    const work = await workspace(t);
    const configuration = options(api, work);
    await syncPhotos(configuration);
    const before = await snapshot(work);
    first.updatedAt++;
    first.cameraModel = "Changed camera";
    model.images.set(first.jpegUrl, changed);
    const second = summary(2, changed);
    model.photos.push(second);
    model.images.set(second.jpegUrl, changed);
    await assert.rejects(
        syncPhotos({
            ...configuration,
            onProgress: () => {
                throw new Error("publication observer failed");
            },
        }),
        /publication observer failed/,
    );
    assert.deepEqual(await snapshot(work), before);
    assert.deepEqual((await readdir(work.root)).sort(), ["photos", "photos-sync-state.json", "photos.json"]);
});

test("does not send credentials to cross-origin URLs or follow API and asset redirects", async (t) => {
    const image = await fixture();
    for (const mode of ["absolute", "protocol-relative", "asset-redirect", "list-redirect"]) {
        await t.test(mode, async (t) => {
            const external = await localApi(t, (_url, response) => imageResponse(response, image));
            let unsafe = false;
            const photo = summary(1, image);
            const api = await localApi(t, (url, response) => {
                if (url.pathname === "/api/v1/photos") {
                    if (unsafe && mode === "list-redirect")
                        return response.writeHead(302, { Location: `${external.baseUrl}/leak` }).end();
                    if (url.searchParams.has("hasFavoriteDevelopment"))
                        return json(response, { photos: [], nextCursor: null });
                    let jpegUrl = photo.jpegUrl;
                    if (unsafe && mode === "absolute") jpegUrl = `${external.baseUrl}/leak`;
                    if (unsafe && mode === "protocol-relative") jpegUrl = `//${new URL(external.baseUrl).host}/leak`;
                    return json(response, { photos: [{ ...photo, jpegUrl }], nextCursor: null });
                }
                if (url.pathname === photo.jpegUrl) {
                    if (unsafe && mode === "asset-redirect")
                        return response.writeHead(307, { Location: `${external.baseUrl}/leak` }).end();
                    return imageResponse(response, image);
                }
                response.writeHead(404).end();
            });
            const work = await workspace(t);
            const configuration = options(api, work);
            await syncPhotos(configuration);
            const before = await snapshot(work);
            unsafe = true;
            photo.updatedAt++;
            await assert.rejects(syncPhotos(configuration), /Omoide origin|redirects are not accepted/);
            assert.equal(external.requests.length, 0);
            assert.ok(api.requests.every(({ authorization }) => authorization === `Bearer ${apiKey}`));
            assert.deepEqual(await snapshot(work), before);
        });
    }
});

test("rejects malformed critical metadata, state, and credentials without changing existing output", async (t) => {
    const image = await fixture();
    const original = summary(1, image);
    let overrides = {};
    const api = await localApi(t, (url, response) => {
        if (url.pathname === "/api/v1/photos")
            return json(response, {
                photos: url.searchParams.has("favorite") ? [{ ...original, ...overrides }] : [],
                nextCursor: null,
            });
        if (url.pathname === original.jpegUrl) return imageResponse(response, image);
        response.writeHead(404).end();
    });
    const work = await workspace(t);
    const configuration = options(api, work);
    await assert.rejects(syncPhotos({ ...configuration, apiKey: "" }), /OMOIDE_API_KEY is required/);
    await assert.rejects(
        syncPhotos({ ...configuration, baseUrl: "https://user:secret@example.invalid" }),
        /without credentials/,
    );
    assert.equal(api.requests.length, 0);
    for (const [invalid, expectedError] of [
        [{ takenAt: null }, /capture time/],
        [{ timezoneOffset: "Asia/Tokyo" }, /capture timezone/],
        [{ isFavorite: "true" }, /favorite flag/],
        [{ favoriteDevelopmentsCount: -1 }, /development count/],
        [{ jpegByteSize: undefined }, /JPEG byte size/],
        [{ jpegByteSize: 0 }, /JPEG byte size/],
        [{ updatedAt: undefined }, /original updatedAt/],
        [{ updatedAt: "2026-01-01T00:00:00Z" }, /original updatedAt/],
        [{ updatedAt: Number.MAX_SAFE_INTEGER + 1 }, /original updatedAt/],
        [{ jpegSha256: "not-a-hash" }, /JPEG identity/],
        [{ cameraModel: 42 }, /camera model/],
    ]) {
        overrides = invalid;
        await assert.rejects(syncPhotos(configuration), expectedError);
        assert.deepEqual(await readdir(work.root), []);
    }
    assert.equal(
        api.requests.some(({ url }) => url.pathname.startsWith("/assets/")),
        false,
    );
    overrides = {};
    await syncPhotos(configuration);
    const before = await snapshot(work);
    for (const invalidState of [
        "{",
        JSON.stringify({
            version: STATE_VERSION,
            processingFingerprint: createProcessingFingerprint(),
            photos: { [original.id]: {} },
        }),
    ]) {
        await writeFile(work.statePath, invalidState);
        const invalidBefore = await snapshot(work);
        await assert.rejects(syncPhotos(configuration), /Invalid photo sync/);
        assert.deepEqual(await snapshot(work), invalidBefore);
    }
    await writeFile(work.statePath, before.state);
    assert.deepEqual(await snapshot(work), before);
});

test("limits large images to 2560 pixels without enlarging small inputs or changing aspect ratio", async (t) => {
    const large = await fixture("png", { width: 3000, height: 1500 });
    const small = await fixture("png", { width: 12, height: 8 });
    const photos = [summary(1, large), summary(2, small)];
    const api = await galleryApi(t, {
        photos,
        images: new Map([
            [photos[0].jpegUrl, large],
            [photos[1].jpegUrl, small],
        ]),
    });
    const work = await workspace(t);
    const { photos: entries } = await syncPhotos(options(api, work));
    assert.deepEqual(
        entries.map(({ width, height }) => [width, height]),
        [
            [2560, 1280],
            [12, 8],
        ],
    );
});
