import { env } from "cloudflare:workers";
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/slide/$")({
    server: {
        handlers: {
            // R2に格納されたSlidevプレゼンテーションのHTML/CSS/JS/画像をプロキシ配信
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

                let slideUrl = `${env.R2_PUBLIC_URL}${splat}`;

                // /slide/:id → R2の :id/index.html
                if (segments.length === 1) {
                    slideUrl = `${env.R2_PUBLIC_URL}${splat}/index.html`;
                }

                // /slide/:id/:pageNum → R2の :id/index.html（SPA内ページ遷移）
                if (
                    segments.length === 2 &&
                    !Number.isNaN(Number(segments[1]))
                ) {
                    slideUrl = `${env.R2_PUBLIC_URL}${segments[0]}/index.html`;
                }

                const res = await fetch(slideUrl, { headers });

                // 画像・CSS・JSなどの静的アセットにはキャッシュヘッダーを付与
                const contentType = res.headers.get("content-type") || "";
                const isStaticAsset =
                    contentType.startsWith("image/") ||
                    contentType.includes("css") ||
                    contentType.includes("javascript") ||
                    contentType.includes("font");

                const responseHeaders = new Headers(res.headers);
                if (isStaticAsset) {
                    responseHeaders.set(
                        "Cache-Control",
                        "public, max-age=86400, s-maxage=604800",
                    );
                }

                return new Response(res.body, {
                    status: res.status,
                    headers: responseHeaders,
                });
            },
        },
    },
    component: () => null,
});
