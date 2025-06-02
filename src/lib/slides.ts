import "server-only";
import { faker } from "@faker-js/faker";
import { getCloudflareContext } from "@opennextjs/cloudflare";
import type { Slide } from "~/lib/type";

export async function getSlides(): Promise<Slide[]> {
    const { env } = getCloudflareContext();
    const headers = new Headers();
    headers.append("CF-Access-Client-Id", env.CF_ACCESS_CLIENT_ID);
    headers.append("CF-Access-Client-Secret", env.CF_ACCESS_CLIENT_SECRET);

    const res = await fetch(`${env.R2_PUBLIC_URL}slide-info-list.json`, {
        headers: headers,
    });
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

    //biome-ignore lint/complexity/noForEach: <explanation>
    data.filter((v) => v.type === "public")
        .filter((v) => v.id.length !== 36)
        .forEach((v) => {
            slides.push({
                id: v.id,
                title: v.title,
                image: `/slide/${v.id}/picture/1.png`,
                lastUpdate: new Date(v.lastUpdated),
                link: `/slide/${v.id}`,
            });
        });

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
