import { S3Client } from "@aws-sdk/client-s3";
import { Hono } from "hono";
import type { Slide } from "~/lib/type";

const app = new Hono<{ Bindings: CloudflareEnv }>();

const s3Client = new S3Client({
    region: process.env.S3_REGION || "",
    credentials: {
        accessKeyId: process.env.S3_ACCESS_ID || "",
        secretAccessKey: process.env.S3_SECRET_KEY || "",
    },
    endpoint: process.env.S3_ENDPOINT,
});

app.get("list", async (c) => {
    // 古いコード
    // let keys = [];
    // const bucketName = process.env.S3_BUCKET;
    // const time = new Date().getTime();
    // try {
    //     const listResult = await s3Client.send(
    //         new ListObjectsV2Command({
    //             Bucket: bucketName,
    //             Prefix: "",
    //             Delimiter: "/",
    //         }),
    //     );
    //     keys =
    //         listResult.CommonPrefixes?.map((prefix) =>
    //             prefix.Prefix?.replace("/", ""),
    //         ) ?? [];
    // } catch (error) {
    //     return new Response(error?.toString(), { status: 500 });

    const keys = [
        "slidev",
        "oauth2-with-ktor",
        "hono-conf-2024",
        "home-server",
        "burikaigi-2025",
        "health-connect-cursor",
    ];

    const override: { id: string; lastUpdate: Date }[] = [
        { id: "slidev", lastUpdate: new Date("2024-02-25") },
        { id: "oauth2-with-ktor", lastUpdate: new Date("2024-06-25") },
        { id: "hono-conf-2024", lastUpdate: new Date("2024-06-26") },
        { id: "home-server", lastUpdate: new Date("2024-10-24") },
    ];

    let slides: Slide[] = (
        await Promise.all(
            keys.map(async (key) => {
                const id = key as string;
                const url = `https://${process.env.NEXT_PUBLIC_S3_HOST_NAME}/${id}/index.html`;

                try {
                    const response = await fetch(url);
                    if (!response.ok) {
                        return null;
                    }

                    const html = await response.text();
                    const title = (
                        html.match(/<title>(.*?)<\/title>/)?.[1] as string
                    ).split(" - ")[0] as string;

                    const image = `https://${process.env.NEXT_PUBLIC_S3_HOST_NAME}/${id}/picture/1.png`;
                    // LastModifiedヘッダーから最終更新日を取得
                    const lastUpdate = new Date(
                        response.headers.get("last-modified") || "",
                    );

                    return { id, title, image, link: url, lastUpdate };
                } catch (error) {
                    // skip if fetch fails
                    return null;
                }
            }),
        )
    ).filter((slide) => slide !== null);

    // Override the last update date
    for (const it of override) {
        const slide = slides.find((slide) => slide.id === it.id);
        if (slide) {
            slide.lastUpdate = it.lastUpdate;
        }
    }

    slides.sort(
        (a, b) =>
            (b.lastUpdate?.getTime() ?? 0) - (a.lastUpdate?.getTime() ?? 0),
    );

    slides = slides.filter((it) => it.title !== "Test Slidev");
    // console.log(`Time: ${new Date().getTime() - time}ms`);

    c.header("Content-Type", "application/json");
    return c.json(slides);
});

export default app;
