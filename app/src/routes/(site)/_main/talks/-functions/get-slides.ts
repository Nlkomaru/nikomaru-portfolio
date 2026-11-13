import { env } from "cloudflare:workers";
import { createServerFn } from "@tanstack/react-start";
import { normalizeR2PublicUrl } from "../../slide/-functions/slide-route-helper";
import { type SlideInfoV2, toSlides } from "./slide-info";

// R2からスライド一覧のメタデータのみを取得（画像はプロキシURL経由でブラウザが直接読み込む）
export const getSlides = createServerFn({ method: "GET" }).handler(async () => {
    const headers = new Headers();
    headers.append("CF-Access-Client-Id", env.CLOUDFLARE_ACCESS_CLIENT_ID);
    headers.append("CF-Access-Client-Secret", env.CLOUDFLARE_ACCESS_CLIENT_SECRET);

    const res = await fetch(`${normalizeR2PublicUrl(env.R2_PUBLIC_URL)}slide-info-list.json`, {
        headers,
    });

    const data = (await res.json()) as SlideInfoV2[];

    return toSlides(data);
});
