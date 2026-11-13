export function normalizeR2PublicUrl(r2PublicUrl: string): string {
    return r2PublicUrl.endsWith("/") ? r2PublicUrl : `${r2PublicUrl}/`;
}

export function resolveSlideR2Url(r2PublicUrl: string, splat: string, segments: string[]): string {
    const baseUrl = normalizeR2PublicUrl(r2PublicUrl);
    // /slide/:id → :id/index.html
    if (segments.length === 1) {
        if (segments[0].endsWith("slidev-exported.pdf")) {
            return `${baseUrl}${segments[0].replace("slidev-exported.pdf", "/slidev-exported.pdf")}`;
        }
        return `${baseUrl}${splat}/index.html`;
    }

    // /slide/:id/:pageNum → :id/index.html（SPA内ページ遷移）
    if (isSlidePagePath(segments)) {
        return `${baseUrl}${segments[0]}/index.html`;
    }

    return `${baseUrl}${splat}`;
}

export function isStaticAsset(contentType: string): boolean {
    return (
        contentType.startsWith("image/") ||
        contentType.includes("css") ||
        contentType.includes("javascript") ||
        contentType.includes("font")
    );
}

export function isSlideTopHtmlResponse(contentType: string, responseOk: boolean, segments: string[]): boolean {
    return contentType.includes("text/html") && responseOk && (segments.length === 1 || isSlidePagePath(segments));
}

function isSlidePagePath(segments: string[]): boolean {
    return segments.length === 2 && !Number.isNaN(Number(segments[1]));
}
