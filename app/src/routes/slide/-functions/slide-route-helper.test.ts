import { describe, expect, it } from "vitest";
import { isSlideTopHtmlResponse, isStaticAsset, resolveSlideR2Url } from "./slide-route-helper";

const r2PublicUrl = "https://r2.example.com/";

describe("resolveSlideR2Url", () => {
    it("resolves a slide top path to its index html", () => {
        expect(resolveSlideR2Url(r2PublicUrl, "introducing-react", ["introducing-react"])).toBe(
            "https://r2.example.com/introducing-react/index.html",
        );
    });

    it("resolves numeric slide page paths to the slide index html", () => {
        expect(resolveSlideR2Url(r2PublicUrl, "introducing-react/12", ["introducing-react", "12"])).toBe(
            "https://r2.example.com/introducing-react/index.html",
        );
    });

    it("passes static asset paths through to R2", () => {
        expect(
            resolveSlideR2Url(r2PublicUrl, "introducing-react/assets/style.css", [
                "introducing-react",
                "assets",
                "style.css",
            ]),
        ).toBe("https://r2.example.com/introducing-react/assets/style.css");
    });

    it("resolves exported pdf paths to the pdf inside the slide directory", () => {
        expect(
            resolveSlideR2Url(r2PublicUrl, "introducing-react-slidev-exported.pdf", [
                "introducing-react-slidev-exported.pdf",
            ]),
        ).toBe("https://r2.example.com/introducing-react-/slidev-exported.pdf");
    });
});

describe("isStaticAsset", () => {
    it.each([
        "image/png",
        "text/css; charset=utf-8",
        "application/javascript",
        "font/woff2",
    ])("detects %s as a static asset", (contentType) => {
        expect(isStaticAsset(contentType)).toBe(true);
    });

    it.each(["text/html", "application/json", "text/plain"])("does not detect %s as a static asset", (contentType) => {
        expect(isStaticAsset(contentType)).toBe(false);
    });
});

describe("isSlideTopHtmlResponse", () => {
    it("detects top html for slide root and numeric page paths", () => {
        expect(isSlideTopHtmlResponse("text/html", true, ["introducing-react"])).toBe(true);
        expect(isSlideTopHtmlResponse("text/html; charset=utf-8", true, ["introducing-react", "12"])).toBe(true);
    });

    it("rejects non-html, failed, and asset paths", () => {
        expect(isSlideTopHtmlResponse("application/javascript", true, ["introducing-react"])).toBe(false);
        expect(isSlideTopHtmlResponse("text/html", false, ["introducing-react"])).toBe(false);
        expect(isSlideTopHtmlResponse("text/html", true, ["introducing-react", "assets", "style.css"])).toBe(false);
    });
});
