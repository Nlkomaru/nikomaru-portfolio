import { env } from "cloudflare:workers";
import { createServerFn } from "@tanstack/react-start";
import { type SlideInfoV2, toSlides } from "./slide-info";

// R2からスライド一覧のメタデータのみを取得（画像はプロキシURL経由でブラウザが直接読み込む）
export const getSlides = createServerFn({ method: "GET" }).handler(async () => {
    const headers = new Headers();
    // CF_ACCESS_CLIENT_ID / SECRET は Secrets Store バインディングのため .get() で非同期取得する
    const [clientId, clientSecret] = await Promise.all([
        env.CF_ACCESS_CLIENT_ID.get(),
        env.CF_ACCESS_CLIENT_SECRET.get(),
    ]);
    headers.append("CF-Access-Client-Id", clientId);
    headers.append("CF-Access-Client-Secret", clientSecret);

    const res = await fetch(`${env.R2_PUBLIC_URL}slide-info-list.json`, {
        headers,
    });

    const data = (await res.json()) as SlideInfoV2[];

    return toSlides(data);
});
