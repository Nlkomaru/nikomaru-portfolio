import "server-only";
import { faker } from "@faker-js/faker";
import { getCloudflareContext } from "@opennextjs/cloudflare";
import type { Slide } from "~/lib/type";

export async function getSlides(): Promise<Slide[]> {
    const { env } = await getCloudflareContext({ async: true });
    const headers = new Headers();
    headers.append(
        "CF-Access-Client-Id",
        process.env.CF_ACCESS_CLIENT_ID ?? env.CF_ACCESS_CLIENT_ID,
    );
    headers.append(
        "CF-Access-Client-Secret",
        process.env.CF_ACCESS_CLIENT_SECRET ?? env.CF_ACCESS_CLIENT_SECRET,
    );

    const res = await fetch(
        `${process.env.R2_PUBLIC_URL ?? env.R2_PUBLIC_URL}slide-info-list.json`,
        {
            headers: headers,
        },
    );
    const data =
        await res.json<
            {
                id: string;
                title: string;
                lastUpdated: string;
                type: "draft" | "public" | "private";
            }[]
        >();

    const slides: Slide[] = [];

    for (const v of data
        .filter((v) => v.type === "public")
        .filter((v) => v.id.length !== 36)) {
        const imageUrl = await getImageUrl(v.id);
        slides.push({
            id: v.id,
            title: v.title,
            image: imageUrl,
            lastUpdate: new Date(v.lastUpdated),
            link: `/slide/${v.id}`,
        });
    }

    return slides;
}

export function getFakeSlides(): Promise<Slide[]> {
    // ダミーデータを生成する
    const slides: Slide[] = Array.from({ length: 10 }, () => ({
        id: faker.string.uuid(),
        title: faker.commerce.productName(),
        image: faker.image.url(),
        link: faker.internet.url(),
        lastUpdate: faker.date.past(),
    }));

    return new Promise((resolve) => {
        setTimeout(() => {
            resolve(slides);
        }, 1000);
    });
}

async function getImageUrl(id: string): Promise<string> {
    const { env } = await getCloudflareContext({ async: true });
    const headers = new Headers();
    headers.append(
        "CF-Access-Client-Id",
        process.env.CF_ACCESS_CLIENT_ID ?? env.CF_ACCESS_CLIENT_ID,
    );
    headers.append(
        "CF-Access-Client-Secret",
        process.env.CF_ACCESS_CLIENT_SECRET ?? env.CF_ACCESS_CLIENT_SECRET,
    );
    const res = await fetch(
        `${process.env.R2_PUBLIC_URL ?? env.R2_PUBLIC_URL}${id}/picture/1.png`,
        {
            headers: headers,
        },
    );
    const data = await res.blob();
    //base64
    const base64 = await data.arrayBuffer();
    return `data:image/png;base64,${Buffer.from(base64).toString("base64")}`;
}
