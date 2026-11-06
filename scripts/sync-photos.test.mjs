import assert from "node:assert/strict";
import { createHash } from "node:crypto";
import { mkdtemp, readdir, readFile, rm } from "node:fs/promises";
import { createServer } from "node:http";
import { tmpdir } from "node:os";
import { basename, join } from "node:path";
import test from "node:test";
import { encode } from "blurhash";
import sharp from "sharp";
import { syncPhotos } from "./sync-photos.mjs";

const apiKey = "test-only-omoide-key";
const captureTime = Date.parse("2026-01-01T16:00:00Z");

async function fixture(format = "png", { width = 12, height = 8, color = "#3580b8", orientation } = {}) {
    let image = sharp({ create: { width, height, channels: 3, background: color } });
    if (orientation !== undefined) image = image.withMetadata({ orientation });
    const data = await image.toFormat(format).toBuffer();
    return { data, sha256: createHash("sha256").update(data).digest("hex") };
}

function summary(id, image, overrides = {}) {
    return {
        id,
        originalFilename: `private-archive-${id}.jpg`,
        takenAt: captureTime,
        timezoneOffset: "+09:00",
        jpegUrl: `/assets/${encodeURIComponent(id)}`,
        jpegSha256: image.sha256,
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

function development(id, parent, image, overrides = {}) {
    return {
        id,
        photoId: parent.id,
        format: "png",
        label: id,
        url: `/assets/${encodeURIComponent(id)}`,
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
        requests.push({ url, authorization: request.headers.authorization });
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

async function outputDirectory(t) {
    const directory = await mkdtemp(join(tmpdir(), "portfolio-photo-sync-test-"));
    t.after(() => rm(directory, { recursive: true, force: true }));
    return join(directory, "photos");
}

async function snapshot(directory) {
    const index = await readFile(join(directory, "index.json"), "utf8");
    const images = [];
    for (const filename of (await readdir(join(directory, "images"))).sort()) {
        images.push([filename, await readFile(join(directory, "images", filename))]);
    }
    return { index, images };
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

test("unions both paginated lists and publishes every favorite variant, but no other versions", async (t) => {
    const jpeg = await fixture("jpeg", { orientation: 6 });
    const png = await fixture("png");
    const webp = await fixture("webp");
    const avif = await fixture("avif");
    const original = summary("original / unsafe-id", jpeg, { description: "Original photo" });
    const both = summary("both", png, {
        takenAt: captureTime - 86_400_000,
        favoriteDevelopmentsCount: 1,
        cameraModel: "Sony A7 IV",
        timezoneOffset: "-07:00",
    });
    const developedOnly = summary("developed-only", png, {
        isFavorite: false,
        favoriteDevelopmentsCount: 3,
        takenAt: captureTime + 3_600_000,
        jpegUrl: "https://must-not-fetch.invalid/private-original",
        jpegSha256: null,
        cameraMake: null,
        cameraModel: null,
        lensModel: null,
    });
    const bothFavorite = development("favorite-webp", both, webp, { label: "Soft color" });
    const onlyAvif = development("favorite-avif", developedOnly, avif, { label: "Monochrome", format: "avif" });
    const onlyPng = development("favorite-png", developedOnly, png, { label: "Warm color" });
    const samePng = development("independent-same-png", developedOnly, png, { label: "Private duplicate version" });
    const notFavorite = development("not-favorite", both, png, {
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
        if (url.pathname === `/api/v1/photos/${encodeURIComponent(both.id)}`) {
            return json(response, { ...both, developments: [notFavorite, bothFavorite] });
        }
        if (url.pathname === `/api/v1/photos/${encodeURIComponent(developedOnly.id)}`) {
            return json(response, { ...developedOnly, developments: [onlyPng, onlyAvif, samePng] });
        }
        const image = assets.get(url.pathname);
        if (image) return imageResponse(response, image);
        response.writeHead(404).end();
    });
    const output = await outputDirectory(t);
    const manifest = await syncPhotos({ baseUrl: api.baseUrl, apiKey, outputDirectory: output });
    assert.equal(manifest.photos.length, 6);
    assert.equal(new Set(manifest.photos.map((photo) => photo.id)).size, 6, "independent versions keep distinct IDs");
    assert.ok(manifest.photos.slice(0, 3).every((photo) => photo.cameraLabel === ""));
    assert.equal(manifest.photos[3].width, 8);
    assert.equal(manifest.photos[3].height, 12);
    assert.ok(manifest.photos.slice(4).every((photo) => photo.cameraLabel === "Sony A7 IV"));
    const entryKeys = ["id", "album", "src", "alt", "width", "height", "blurhash", "cameraLabel", "lensLabel"].sort();
    for (const photo of manifest.photos) {
        assert.deepEqual(Object.keys(photo).sort(), entryKeys);
        assert.match(photo.id, /^[a-z\d_-]+$/i);
        assert.equal(photo.src, `/photos/images/${photo.id}.avif`);
        const data = await readFile(join(output, "images", basename(photo.src)));
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
            assert.equal(photo.album, "2026-01-02");
            assert.equal(photo.width, 8);
            assert.equal(photo.height, 12);
            assert.equal(photo.cameraLabel, "Sony ILCE-7M4");
        }
    }
    assert.deepEqual(
        new Set(api.requests.filter(({ url }) => url.pathname.startsWith("/assets/")).map(({ url }) => url.pathname)),
        new Set(assets.keys()),
    );
    assert.ok(api.requests.every(({ authorization }) => authorization === `Bearer ${apiKey}`));
    const first = await snapshot(output);
    const privateText = [original, both, developedOnly].flatMap((photo) => [photo.originalFilename, photo.description]);
    for (const privateValue of [
        apiKey,
        api.baseUrl,
        "private-user-id",
        "GPSLatitude",
        "GPSLongitude",
        "private-post-content",
        "jpegUrl",
        ...privateText.filter(Boolean),
        bothFavorite.label,
        onlyAvif.label,
        onlyPng.label,
        samePng.label,
    ]) {
        assert.equal(first.index.includes(privateValue), false);
    }
    assert.equal(first.images.length, 6);
    const repeated = await syncPhotos({ baseUrl: api.baseUrl, apiKey, outputDirectory: output });
    assert.deepEqual(
        repeated.photos.map((photo) => photo.id),
        manifest.photos.map((photo) => photo.id),
        "published IDs stay stable across repeated synchronization",
    );
    assert.deepEqual(await snapshot(output), first, "an unchanged sync has no timestamp or encoding churn");
});

test("accepts compressed originals whose source identity hash differs from the served JPEG bytes", async (t) => {
    const original = await fixture("jpeg");
    const compressed = { data: await sharp(original.data).jpeg({ quality: 40 }).toBuffer() };
    assert.notEqual(createHash("sha256").update(compressed.data).digest("hex"), original.sha256);
    const photo = summary("compressed-original", original);
    const api = await localApi(t, (url, response) => {
        if (url.pathname === "/api/v1/photos") {
            return json(response, { photos: url.searchParams.has("favorite") ? [photo] : [], nextCursor: null });
        }
        if (url.pathname === photo.jpegUrl) return imageResponse(response, compressed);
        response.writeHead(404).end();
    });
    const output = await outputDirectory(t);
    for (const identityHash of [original.sha256, undefined]) {
        photo.jpegSha256 = identityHash;
        const { photos } = await syncPhotos({ baseUrl: api.baseUrl, apiKey, outputDirectory: output });
        assert.equal(photos.length, 1);
        const data = await readFile(join(output, "images", basename(photos[0].src)));
        assert.equal(photos[0].blurhash, await outputBlurhash(data));
        const metadata = await sharp(data).metadata();
        assert.equal(metadata.width, photos[0].width);
        assert.equal(metadata.height, photos[0].height);
    }
});

test("keeps the complete previous publication on a partial download or API failure", async (t) => {
    const originalImage = await fixture("png", { color: "#b82050" });
    const changedImage = await fixture("png", { color: "#2090a0" });
    for (const failure of [
        "http",
        "checksum",
        "invalid-image",
        "malformed-page",
        "malformed-detail",
        "repeated-cursor",
    ]) {
        await t.test(failure, async (t) => {
            let failing = false;
            let completedDownloads = 0;
            const first = summary("first", originalImage);
            const second = summary("second", changedImage, {
                isFavorite: failure !== "checksum",
                favoriteDevelopmentsCount: ["malformed-detail", "checksum"].includes(failure) ? 1 : 0,
            });
            const secondDevelopment = development("second-development", second, changedImage);
            const api = await localApi(t, (url, response) => {
                if (url.pathname === "/api/v1/photos") {
                    if (url.searchParams.has("hasFavoriteDevelopment"))
                        return json(response, { photos: [], nextCursor: null });
                    if (failing && failure === "malformed-page") return json(response, { photos: [first] });
                    if (failing && failure === "repeated-cursor")
                        return json(response, { photos: [first], nextCursor: "same" });
                    return json(response, {
                        photos: failing ? [first, second] : [first],
                        nextCursor: null,
                    });
                }
                if (url.pathname === "/api/v1/photos/second") {
                    return json(response, {
                        ...second,
                        id: failure === "malformed-detail" ? "wrong-parent" : second.id,
                        developments: failure === "checksum" ? [secondDevelopment] : [],
                    });
                }
                if (url.pathname === first.jpegUrl) {
                    completedDownloads++;
                    return imageResponse(response, failing ? changedImage : originalImage);
                }
                if (url.pathname === second.jpegUrl || url.pathname === secondDevelopment.url) {
                    if (failure === "http") return response.writeHead(503).end();
                    if (failure === "checksum") return imageResponse(response, originalImage);
                    return response.writeHead(200).end("not an image");
                }
                response.writeHead(404).end();
            });
            const output = await outputDirectory(t);
            await syncPhotos({ baseUrl: api.baseUrl, apiKey, outputDirectory: output });
            const before = await snapshot(output);
            failing = true;
            const expectedError = {
                http: /HTTP 503/,
                checksum: /SHA256 does not match/,
                "invalid-image": /Unable to convert favorite image/,
                "malformed-page": /nextCursor/,
                "malformed-detail": /parent ID does not match/,
                "repeated-cursor": /pagination cursor repeated/,
            }[failure];
            await assert.rejects(syncPhotos({ baseUrl: api.baseUrl, apiKey, outputDirectory: output }), expectedError);
            assert.deepEqual(await snapshot(output), before);
            assert.deepEqual(await readdir(join(output, "..")), ["photos"], "failed staging directories are removed");
            if (["http", "checksum", "invalid-image"].includes(failure)) {
                assert.equal(
                    completedDownloads,
                    2,
                    "a newly encoded first asset must not leak into the old publication",
                );
            }
        });
    }
});

test("removes unfavorited originals and then publishes an empty set without obsolete assets", async (t) => {
    const image = await fixture();
    let phase = 0;
    const parent = summary("changing-favorites", image, { favoriteDevelopmentsCount: 1 });
    const variant = development("remaining-development", parent, image, { label: "Favorite edit" });
    const api = await localApi(t, (url, response) => {
        const current = { ...parent, isFavorite: phase === 0 };
        if (url.pathname === "/api/v1/photos") {
            const visible = phase < 2 && (url.searchParams.has("hasFavoriteDevelopment") || phase === 0);
            return json(response, { photos: visible ? [current] : [], nextCursor: null });
        }
        if (url.pathname === `/api/v1/photos/${parent.id}`) {
            return json(response, { ...current, developments: [variant] });
        }
        if ([parent.jpegUrl, variant.url].includes(url.pathname)) return imageResponse(response, image);
        response.writeHead(404).end();
    });
    const output = await outputDirectory(t);
    const options = { baseUrl: api.baseUrl, apiKey, outputDirectory: output };
    const initial = await syncPhotos(options);
    assert.equal(initial.photos.length, 2);
    const favoriteId = initial.photos.find((photo) => photo.id.startsWith("development-")).id;
    phase = 1;
    const remaining = await syncPhotos(options);
    assert.equal(remaining.photos.length, 1);
    assert.equal(remaining.photos[0].id, favoriteId);
    assert.deepEqual(await readdir(join(output, "images")), [`${favoriteId}.avif`]);
    phase = 2;
    assert.deepEqual(await syncPhotos(options), { photos: [] });
    assert.deepEqual(JSON.parse(await readFile(join(output, "index.json"), "utf8")), { photos: [] });
    assert.deepEqual(await readdir(join(output, "images")), []);
});

test("never sends the Bearer key to cross-origin assets or redirect targets", async (t) => {
    const image = await fixture();
    for (const mode of ["absolute", "protocol-relative", "asset-redirect", "list-redirect"]) {
        await t.test(mode, async (t) => {
            const external = await localApi(t, (_url, response) => imageResponse(response, image));
            let unsafe = false;
            const photo = summary("safe-first", image);
            const api = await localApi(t, (url, response) => {
                if (url.pathname === "/api/v1/photos") {
                    if (unsafe && mode === "list-redirect") {
                        return response.writeHead(302, { Location: `${external.baseUrl}/leak` }).end();
                    }
                    if (url.searchParams.has("hasFavoriteDevelopment"))
                        return json(response, { photos: [], nextCursor: null });
                    let jpegUrl = photo.jpegUrl;
                    if (unsafe && mode === "absolute") jpegUrl = `${external.baseUrl}/leak`;
                    if (unsafe && mode === "protocol-relative") jpegUrl = `//${new URL(external.baseUrl).host}/leak`;
                    return json(response, { photos: [{ ...photo, jpegUrl }], nextCursor: null });
                }
                if (url.pathname === photo.jpegUrl) {
                    if (unsafe && mode === "asset-redirect") {
                        return response.writeHead(307, { Location: `${external.baseUrl}/leak` }).end();
                    }
                    return imageResponse(response, image);
                }
                response.writeHead(404).end();
            });
            const output = await outputDirectory(t);
            const options = { baseUrl: api.baseUrl, apiKey, outputDirectory: output };
            await syncPhotos(options);
            const before = await snapshot(output);
            unsafe = true;
            await assert.rejects(syncPhotos(options), /Omoide origin|redirects are not accepted/);
            assert.equal(external.requests.length, 0);
            assert.ok(api.requests.every(({ authorization }) => authorization === `Bearer ${apiKey}`));
            assert.deepEqual(await snapshot(output), before);
        });
    }
});

test("rejects malformed critical metadata and missing credentials without publishing", async (t) => {
    const image = await fixture();
    const original = summary("invalid-metadata", image);
    let overrides = {};
    const api = await localApi(t, (url, response) => {
        if (url.pathname === "/api/v1/photos") {
            return json(response, {
                photos: url.searchParams.has("favorite") ? [{ ...original, ...overrides }] : [],
                nextCursor: null,
            });
        }
        response.writeHead(404).end();
    });
    const output = await outputDirectory(t);
    const options = { baseUrl: api.baseUrl, apiKey, outputDirectory: output };
    await assert.rejects(syncPhotos({ ...options, apiKey: "" }), /OMOIDE_API_KEY is required/);
    assert.equal(api.requests.length, 0);
    for (const [invalid, expectedError] of [
        [{ takenAt: null }, /capture time/],
        [{ timezoneOffset: "Asia/Tokyo" }, /capture timezone/],
        [{ isFavorite: "true" }, /favorite flag/],
        [{ favoriteDevelopmentsCount: -1 }, /development count/],
    ]) {
        overrides = invalid;
        await assert.rejects(syncPhotos(options), expectedError);
        await assert.rejects(readFile(join(output, "index.json")), { code: "ENOENT" });
    }
    assert.equal(
        api.requests.some(({ url }) => url.pathname.startsWith("/assets/")),
        false,
    );
});

test("limits large images to 2560 pixels without changing their aspect ratio", async (t) => {
    const image = await fixture("png", { width: 3000, height: 1500 });
    const photo = summary("large-image", image);
    const api = await localApi(t, (url, response) => {
        if (url.pathname === "/api/v1/photos") {
            return json(response, { photos: url.searchParams.has("favorite") ? [photo] : [], nextCursor: null });
        }
        if (url.pathname === photo.jpegUrl) return imageResponse(response, image);
        response.writeHead(404).end();
    });
    const output = await outputDirectory(t);
    const { photos } = await syncPhotos({ baseUrl: api.baseUrl, apiKey, outputDirectory: output });
    assert.equal(photos[0].width, 2560);
    assert.equal(photos[0].height, 1280);
});
