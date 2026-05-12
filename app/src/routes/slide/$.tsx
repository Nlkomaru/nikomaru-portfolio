import { env } from "cloudflare:workers";
import { createFileRoute } from "@tanstack/react-router";
import { isSlideTopHtmlResponse, isStaticAsset, resolveSlideR2Url } from "./-functions/slide-route-helper";

const STATIC_CACHE_CONTROL = "public, max-age=86400, s-maxage=604800";

// HTML属性に安全に埋め込むためのエスケープ処理。
// OGP用のmetaタグはユーザーが共有するURLに直接出るため、念のため最低限のサニタイズを行う。
function escapeHtmlAttribute(value: string): string {
    return value
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&#39;");
}

// R2 上の slide-info-list.json から該当スライドのタイトルを取得する。
// 取得失敗時はサムネ画像の OGP だけ付けたいので例外は呑んで undefined を返す。
async function fetchSlideTitle(slideId: string, authHeaders: Headers): Promise<string | undefined> {
    try {
        const res = await fetch(`${env.R2_PUBLIC_URL}slide-info-list.json`, {
            headers: authHeaders,
            // タイトル取得用のリクエストは Cloudflare のキャッシュに任せて軽量化する。
            cf: { cacheTtl: 300, cacheEverything: true },
        } as RequestInit);
        if (!res.ok) {
            return undefined;
        }
        const list = (await res.json()) as Array<{ id: string; title: string }>;
        return list.find((item) => item.id === slideId)?.title;
    } catch {
        return undefined;
    }
}

// スライドのトップページ向けに OGP / Twitter Card 用の meta タグを HTML に注入する。
// 画像は `/slide/:id/picture/1.png` を絶対URLとして使用する（Slidev側で生成済みのページ画像）。
function injectSlideOgpMeta(
    response: Response,
    requestUrl: string,
    slideId: string,
    slideTitle: string | undefined,
): Response {
    const origin = new URL(requestUrl).origin;
    const pageUrl = `${origin}/slide/${slideId}`;
    const ogImage = `${origin}/slide/${slideId}/picture/1.png`;

    const metaTags = [
        `<meta property="og:url" content="${escapeHtmlAttribute(pageUrl)}">`,
        `<meta property="og:type" content="article">`,
        `<meta property="site_name" content="Nikomaru Portfolio">`,
        `<meta property="og:image" content="${escapeHtmlAttribute(ogImage)}">`,
        `<meta property="og:image:alt" content="${escapeHtmlAttribute(slideTitle ?? "")}">`,
        `<meta property="og:image:width" content="1920">`,
        `<meta property="og:image:height" content="1080">`,
        `<meta name="twitter:card" content="summary_large_image">`,
        `<meta name="twitter:image" content="${escapeHtmlAttribute(ogImage)}">`,
        `<meta name="twitter:site" content="@nikomaru0102">`,
        // slide-info-list.json から取得できた場合のみ og:title / twitter:title を上書きする。
        ...(slideTitle
            ? [
                  `<meta property="og:title" content="${escapeHtmlAttribute(slideTitle)}">`,
                  `<meta name="twitter:title" content="${escapeHtmlAttribute(slideTitle)}">`,
              ]
            : []),
    ].join("");

    // HTMLRewriter は Cloudflare Workers のグローバルAPI。<head> の末尾に meta タグを差し込む。
    const rewriter = new HTMLRewriter().on("head", {
        element(element) {
            element.append(metaTags, { html: true });
        },
    });
    return rewriter.transform(response);
}

export const Route = createFileRoute("/slide/$")({
    server: {
        handlers: {
            GET: async ({ request, params }) => {
                const splat = params._splat || "";
                const segments = splat.split("/").filter(Boolean);

                if (segments.length === 0) {
                    return new Response("Not found", { status: 404 });
                }

                const headers = new Headers();
                headers.append("CF-Access-Client-Id", env.CF_ACCESS_CLIENT_ID);
                headers.append("CF-Access-Client-Secret", env.CF_ACCESS_CLIENT_SECRET);

                const slideUrl = resolveSlideR2Url(env.R2_PUBLIC_URL, splat, segments);
                const res = await fetch(slideUrl, { headers });

                const contentType = res.headers.get("content-type") || "";

                // スライドのトップ HTML (`/slide/:id` または `/slide/:id/:pageNum`) には OGP メタを注入する。
                // SNS でシェアされた際に Slidev のページ画像をサムネイルとして表示させるための処置。
                if (isSlideTopHtmlResponse(contentType, res.ok, segments)) {
                    const slideTitle = await fetchSlideTitle(segments[0], headers);
                    return injectSlideOgpMeta(res, request.url, segments[0], slideTitle);
                }

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
