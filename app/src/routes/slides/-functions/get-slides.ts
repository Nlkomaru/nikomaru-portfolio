import { env } from "cloudflare:workers";
import { createServerFn } from "@tanstack/react-start";
import type { Slide } from "../-types/slide";

// R2からスライド一覧のメタデータのみを取得（画像はプロキシURL経由でブラウザが直接読み込む）
export const getSlides = createServerFn({ method: "GET" }).handler(async () => {
    const headers = new Headers();
    headers.append("CF-Access-Client-Id", env.CF_ACCESS_CLIENT_ID);
    headers.append("CF-Access-Client-Secret", env.CF_ACCESS_CLIENT_SECRET);

    const res = await fetch(`${env.R2_PUBLIC_URL}slide-info-list.json`, {
        headers,
    });

    const data = (await res.json()) as Array<{
        id: string;
        title: string;
        lastUpdated: string;
        type: "draft" | "public" | "private";
    }>;

    return data
        .filter((v) => v.type !== "private")
        .filter((v) => v.id.length !== 36)
        .map<Slide>((v) => ({
            id: v.id,
            title: v.title,
            image: `/slide/${v.id}/picture/1.png`,
            lastUpdate: v.lastUpdated,
            link: `/slide/${v.id}`,
            type: v.type,
        }));
});
