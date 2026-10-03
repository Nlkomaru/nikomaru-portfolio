import { JSDOM } from "jsdom";
import { describe, expect, it } from "vitest";
import { buildSitemap } from "./build-sitemap";

describe("buildSitemap", () => {
    it("lists canonical www URLs rather than redirecting apex URLs", () => {
        const sitemap = buildSitemap(["MineAuth"], ["hono-conf-2024"]);
        const { window } = new JSDOM(sitemap, { contentType: "application/xml" });
        const locations = Array.from(window.document.getElementsByTagName("loc"));
        const origins = new Set(locations.map((location) => new URL(location.textContent ?? "").origin));

        window.close();
        expect([...origins]).toEqual(["https://www.nikomaru.dev"]);
    });
});
