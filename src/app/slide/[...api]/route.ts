import { getSlides } from "@/src/lib/slides";
import type { Slide } from "@/src/lib/type";
import { getCloudflareContext } from "@opennextjs/cloudflare";
import { Hono } from "hono";
import { handle } from "hono/vercel";

const app = new Hono().basePath("/slide");

let slides: Slide[] | null = null;
let lastUpdated: Date | null = null;

app.get("*", async (c) => {
    // 15分に1回更新する
    if (
        slides === null ||
        lastUpdated === null ||
        lastUpdated < new Date(Date.now() - 1000 * 60 * 15)
    ) {
        slides = await getSlides();
        lastUpdated = new Date();
    }

    const { env } = getCloudflareContext();
    const headers = new Headers();
    const { pathname } = new URL(c.req.url);
    headers.append("CF-Access-Client-Id", env.CF_ACCESS_CLIENT_ID);
    headers.append("CF-Access-Client-Secret", env.CF_ACCESS_CLIENT_SECRET);

    const splited = pathname
        .split("/")
        .filter((v) => v !== "")
        .slice(1);

    if (!slides.map((v) => v.id).includes(splited[0])) {
        return c.json(
            {
                message: "Slide not found",
            },
            404,
        );
    }

    const removed = splited.join("/");
    let slideUrl = `${env.R2_PUBLIC_URL}${removed}`;

    if (splited.length === 1) {
        slideUrl = `${env.R2_PUBLIC_URL}${removed}/index.html`;
    }

    if (splited.length === 2 && !Number.isNaN(Number(splited[1]))) {
        slideUrl = `${env.R2_PUBLIC_URL}${splited[0]}/index.html`;
    }

    if (splited[0].endsWith("assets")) {
        slideUrl.replace("assets", "/assets");
    }

    const res = await fetch(slideUrl, {
        headers: headers,
    });
    return res;
});

export const GET = handle(app);
export const POST = handle(app);
