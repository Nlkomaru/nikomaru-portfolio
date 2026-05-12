import { describe, expect, it } from "vitest";
import { type SlideInfoV2, toSlides } from "./slide-info";

const baseSlideInfo = {
    $schema: "https://example.com/schema.json",
    created: "2026-01-01",
    sourcePath: "slides/example.md",
    tags: ["react"],
} satisfies Pick<SlideInfoV2, "$schema" | "created" | "sourcePath" | "tags">;

describe("toSlides", () => {
    it("filters private slides and maps public metadata to slide cards", () => {
        const slides = toSlides([
            createSlideInfo({
                id: "public-slide",
                title: "Public Slide",
                type: "public",
                presentation: {
                    date: "2026-02-01",
                    name: "Frontend Meetup",
                    url: "https://example.com/events/frontend-meetup",
                },
                pictures: [
                    {
                        path: "picture/1.png",
                        blurhash: "LEHV6nWB2yk8pyo0adR*.7kCMdnj",
                        blur: "legacy-blur",
                    },
                    {
                        path: "picture/2.png",
                    },
                ],
            }),
            createSlideInfo({
                id: "private-slide",
                title: "Private Slide",
                type: "private",
            }),
        ]);

        expect(slides).toEqual([
            {
                id: "public-slide",
                title: "Public Slide",
                thumbnailImage: "/slide/public-slide/picture/1.png",
                thumbnailBlurhash: "LEHV6nWB2yk8pyo0adR*.7kCMdnj",
                pageCount: 2,
                slideUrl: "/slide/public-slide",
                presentationUrl: "https://example.com/events/frontend-meetup",
                lastUpdate: "2026-01-01",
                presentationDate: "2026-02-01",
                presentationName: "Frontend Meetup",
                tags: ["react"],
                type: "public",
            },
        ]);
    });

    it("uses legacy blur fallback and empty thumbnail values when pictures are missing", () => {
        const slides = toSlides([
            createSlideInfo({
                id: "legacy-blur-slide",
                title: "Legacy Blur Slide",
                pictures: [
                    {
                        path: "picture/1.png",
                        blur: "legacy-blur",
                    },
                ],
            }),
            createSlideInfo({
                id: "no-picture-slide",
                title: "No Picture Slide",
                pictures: undefined,
            }),
        ]);

        expect(slides).toMatchObject([
            {
                id: "legacy-blur-slide",
                thumbnailImage: "/slide/legacy-blur-slide/picture/1.png",
                thumbnailBlurhash: "legacy-blur",
                pageCount: 1,
            },
            {
                id: "no-picture-slide",
                thumbnailImage: undefined,
                thumbnailBlurhash: undefined,
                pageCount: 0,
            },
        ]);
    });

    it("orders by presentation date when both slides have one and otherwise keeps last update ordering", () => {
        const slides = toSlides([
            createSlideInfo({
                id: "older-presentation",
                title: "Older Presentation",
                lastUpdated: "2026-01-20",
                presentation: {
                    date: "2026-03-01",
                    name: "Older Event",
                    url: "https://example.com/events/older",
                },
            }),
            createSlideInfo({
                id: "newer-draft",
                title: "Newer Draft",
                lastUpdated: "2026-04-01",
                type: "draft",
                presentation: null,
            }),
            createSlideInfo({
                id: "newer-presentation",
                title: "Newer Presentation",
                lastUpdated: "2026-01-10",
                presentation: {
                    date: "2026-04-01",
                    name: "Newer Event",
                    url: "https://example.com/events/newer",
                },
            }),
            createSlideInfo({
                id: "older-draft",
                title: "Older Draft",
                lastUpdated: "2026-03-01",
                type: "draft",
                presentation: null,
            }),
        ]);

        expect(slides.map((slide) => slide.id)).toEqual([
            "newer-draft",
            "older-draft",
            "newer-presentation",
            "older-presentation",
        ]);
    });
});

function createSlideInfo(overrides: Partial<SlideInfoV2>): SlideInfoV2 {
    return {
        ...baseSlideInfo,
        id: "slide",
        title: "Slide",
        lastUpdated: "2026-01-01",
        type: "public",
        presentation: null,
        pictures: [],
        ...overrides,
    };
}
