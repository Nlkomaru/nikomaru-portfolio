import {
    GetObjectCommand,
    ListObjectsV2Command,
    S3Client,
} from "@aws-sdk/client-s3";
import { Hono } from "hono";

const app = new Hono<{ Bindings: CloudflareEnv }>();

const s3Client = new S3Client({
    region: process.env.S3_REGION as string,
    credentials: {
        accessKeyId: process.env.S3_ACCESS_ID as string,
        secretAccessKey: process.env.S3_SECRET_KEY as string,
    },
    endpoint: process.env.S3_ENDPOINT as string,
});
const jsonHeader = {
    "Content-Type": "Application/Json",
};

app.get("list", async (req, res) => {
    let keys = [];
    try {
        const command = new ListObjectsV2Command({
            Bucket: process.env.S3_BUCKET as string,
            Prefix: "",
            Delimiter: "",
        });
        const result = await s3Client.send(command);
        keys =
            Array.from(
                new Set(
                    result.Contents?.map((o) => o.Key).map(
                        (id) => id?.split("/")[0],
                    ),
                ),
            ) || [];
        keys = keys.filter((key): key is string => key !== undefined);
    } catch (error) {
        return new Response(error?.toString(), { status: 500 });
    }
    type Slide = {
        id: string;
        title: string;
        image: string;
        link: string;
    };

    const slides: Slide[] = await Promise.all(
        keys.map(async (key) => {
            const id = key as string;
            const htmlGetCommand = new GetObjectCommand({
                Bucket: process.env.S3_BUCKET as string,
                Key: `${id}/index.html`,
            });

            const result = await s3Client.send(htmlGetCommand);
            const html = await result.Body?.transformToString();
            const title = (
                html?.match(/<title>(.*?)<\/title>/)?.[1] as string
            ).split(" - ")[0] as string;
            const image = `${process.env.BUCKET_URL}/${id}/picture/1.png`;
            const link = `${process.env.BUCKET_URL}/${id}/index.html`;
            return { id, title, image, link };
        }),
    );

    return new Response(JSON.stringify(slides), { headers: jsonHeader });
});

export default app;
