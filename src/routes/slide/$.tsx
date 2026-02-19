import { env } from "cloudflare:workers";
import { createFileRoute } from "@tanstack/react-router";

const STATIC_CACHE_CONTROL = "public, max-age=86400, s-maxage=604800";

function resolveR2Url(splat: string, segments: string[]): string {
    // /slide/:id → :id/index.html
    if (segments.length === 1) {
        return `${env.R2_PUBLIC_URL}${splat}/index.html`;
    }
    // /slide/:id/:pageNum → :id/index.html（SPA内ページ遷移）
    if (segments.length === 2 && !Number.isNaN(Number(segments[1]))) {
        return `${env.R2_PUBLIC_URL}${segments[0]}/index.html`;
    }
    return `${env.R2_PUBLIC_URL}${splat}`;
}

function isStaticAsset(contentType: string): boolean {
    return (
        contentType.startsWith("image/") ||
        contentType.includes("css") ||
        contentType.includes("javascript") ||
        contentType.includes("font")
    );
}

export const Route = createFileRoute("/slide/$")({
    server: {
        handlers: {
            GET: async ({ params }) => {
                const splat = params._splat || "";
                const segments = splat.split("/").filter(Boolean);

                if (segments.length === 0) {
                    return new Response("Not found", { status: 404 });
                }

                const headers = new Headers();
                headers.append("CF-Access-Client-Id", env.CF_ACCESS_CLIENT_ID);
                headers.append(
                    "CF-Access-Client-Secret",
                    env.CF_ACCESS_CLIENT_SECRET,
                );

                const slideUrl = resolveR2Url(splat, segments);
                const res = await fetch(slideUrl, { headers });

                const contentType = res.headers.get("content-type") || "";
                if (!isStaticAsset(contentType)) {
                    return res;
                }

                // 静的アセットにはブラウザ・CDNキャッシュヘッダーを付与
                const responseHeaders = new Headers(res.headers);
                responseHeaders.set("Cache-Control", STATIC_CACHE_CONTROL);
                return new Response(res.body, {
                    status: res.status,
                    headers: responseHeaders,
                });
            },
        },
    },
    component: () => null,
});
