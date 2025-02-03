import type { Readable } from "node:stream";
import {
    GetObjectCommand,
    type GetObjectCommandOutput,
    ListObjectsV2Command,
    S3Client,
} from "@aws-sdk/client-s3";
import { Hono } from "hono";

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
    let keys = [];
    const bucketName = process.env.S3_BUCKET;
    const time = new Date().getTime();
    try {
        const listResult = await s3Client.send(
            new ListObjectsV2Command({
                Bucket: bucketName,
                Prefix: "",
                Delimiter: "/",
            }),
        );
        keys =
            listResult.CommonPrefixes?.map((prefix) =>
                prefix.Prefix?.replace("/", ""),
            ) ?? [];
    } catch (error) {
        return new Response(error?.toString(), { status: 500 });
    }

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
                let object: GetObjectCommandOutput;
                try {
                    object = await s3Client.send(
                        new GetObjectCommand({
                            Bucket: bucketName,
                            Key: `${id}/index.html`,
                        }),
                    );
                } catch (error) {
                    // skip if object not found
                    return null;
                }
                const stream = object.Body as Readable;
                const html = await new Promise<string>((resolve, reject) => {
                    let data = "";
                    stream.on("data", (chunk) => {
                        data += chunk;
                    });
                    stream.on("end", () => resolve(data));
                    stream.on("error", reject);
                });
                const title = (
                    html.match(/<title>(.*?)<\/title>/)?.[1] as string
                ).split(" - ")[0] as string;
                const image = `https://${process.env.NEXT_PUBLIC_S3_HOST_NAME}/${id}/picture/1.png`;
                const link = `https://${process.env.NEXT_PUBLIC_S3_HOST_NAME}/${id}/index.html`;
                const lastUpdate = object.LastModified;

                return { id, title: title, image, link, lastUpdate };
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
