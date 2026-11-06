import { afterEach, describe, expect, it, vi } from "vitest";
import photoIndex from "../-content/photos.json";
import { getPhotoBackgroundStyle, getPhotoEntries } from "./get-photo-entries";

afterEach(() => {
    vi.unstubAllGlobals();
});

describe("getPhotoEntries", () => {
    it("returns every committed photo unchanged without requesting a runtime index", () => {
        const fetch = vi.fn(() => {
            throw new Error("Photo entries must not require network access.");
        });
        vi.stubGlobal("fetch", fetch);

        const photos = getPhotoEntries();

        expect(photos).toBe(photoIndex.photos);
        expect(photos.length).toBeGreaterThan(0);
        expect(fetch).not.toHaveBeenCalled();
    });
});

describe("getPhotoBackgroundStyle", () => {
    it("preserves CSS BlurHash placeholders for every committed photo", () => {
        for (const photo of photoIndex.photos) {
            expect(getPhotoBackgroundStyle(photo.blurhash)).toEqual({
                backgroundImage: expect.stringContaining("gradient("),
                backgroundPosition: "center",
                backgroundRepeat: "no-repeat",
                backgroundSize: "cover",
                color: "transparent",
            });
        }
    });
});
