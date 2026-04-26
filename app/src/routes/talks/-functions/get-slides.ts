import { env } from "cloudflare:workers";
import { createServerFn } from "@tanstack/react-start";

type SlideInfoV2 = {
    $schema: string;
    id: string;
    title: string;
    created: string;
    presentation: null | {
        date: string;
        name: string;
        url: string;
    };
    lastUpdated: string;
    type: "draft" | "public" | "private";
    tags: string[];
    sourcePath: string;
};

// R2からスライド一覧のメタデータのみを取得（画像はプロキシURL経由でブラウザが直接読み込む）
export const getSlides = createServerFn({ method: "GET" }).handler(async () => {
    const headers = new Headers();
    headers.append("CF-Access-Client-Id", env.CF_ACCESS_CLIENT_ID);
    headers.append("CF-Access-Client-Secret", env.CF_ACCESS_CLIENT_SECRET);

    const res = await fetch(`${env.R2_PUBLIC_URL}slide-info-list.json`, {
        headers,
    });

    const data = (await res.json()) as SlideInfoV2[];

    return data
        .filter((v) => v.type !== "private")
        .sort((a, b) => new Date(b.lastUpdated).getTime() - new Date(a.lastUpdated).getTime())
        .sort(
            (a, b) => new Date(b.presentation?.date ?? "").getTime() - new Date(a.presentation?.date ?? "").getTime(),
        );
});
