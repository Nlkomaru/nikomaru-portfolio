import { describe, expect, it } from "vitest";
import { buildSitemap } from "./build-sitemap";

describe("buildSitemap", () => {
    it("includes both locales for pages and projects and canonical slide viewer URLs", () => {
        const xml = buildSitemap(["MineAuth", "MoriPath"], ["talk-one", "talk-two"]);
        const locations = [...xml.matchAll(/<loc>([^<]+)<\/loc>/g)].map((match) => match[1]);

        expect(locations).toEqual([
            "https://nikomaru.dev/",
            "https://nikomaru.dev/ja",
            "https://nikomaru.dev/about",
            "https://nikomaru.dev/ja/about",
            "https://nikomaru.dev/photos",
            "https://nikomaru.dev/ja/photos",
            "https://nikomaru.dev/projects",
            "https://nikomaru.dev/ja/projects",
            "https://nikomaru.dev/talks",
            "https://nikomaru.dev/ja/talks",
            "https://nikomaru.dev/projects/MineAuth",
            "https://nikomaru.dev/ja/projects/MineAuth",
            "https://nikomaru.dev/projects/MoriPath",
            "https://nikomaru.dev/ja/projects/MoriPath",
            "https://nikomaru.dev/slide/talk-one",
            "https://nikomaru.dev/slide/talk-two",
        ]);
    });

    it("encodes IDs as path segments and escapes XML characters", () => {
        const xml = buildSitemap(["a/b"], ["R&D/intro"]);

        expect(xml).toContain("<loc>https://nikomaru.dev/projects/a%2Fb</loc>");
        expect(xml).toContain("<loc>https://nikomaru.dev/slide/R%26D%2Fintro</loc>");
        expect(xml).not.toContain("/slide/R&D/intro");
    });
});
