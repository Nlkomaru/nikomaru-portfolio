import "server-only";
import { faker } from "@faker-js/faker";
import type { Works } from "~/lib/type";

export async function getWorks(): Promise<Works[]> {
    // return getFakeWorks();
    const url = "https://nikomaru-portfolio-01.microcms.io/api/v1/products";
    const response = await fetch(url, {
        headers: {
            "X-MICROCMS-API-KEY": process.env.MICROCMS_API_KEY as string,
        },
        method: "GET",
    });

    if (!response.ok) {
        throw new Error("fetch error");
    }

    const data: { contents: Works[] } = await response.json();
    return data.contents;
}

function getFakeWorks(): Promise<Works[]> {
    // ダミーデータを生成する
    const works: Works[] = Array.from({ length: 10 }, () => ({
        id: faker.string.uuid(),
        title: faker.commerce.productName(),
        image:
            Math.random() > 0.7
                ? {
                      url: faker.image.url(),
                      width: faker.number.int({ min: 800, max: 1200 }),
                      height: faker.number.int({ min: 600, max: 900 }),
                  }
                : undefined,
        emoji: faker.internet.emoji(),
        description: faker.lorem.paragraphs(),
        client: faker.company.name(),
        position: faker.person.jobTitle(),
        link: faker.internet.url(),
        updatedAt: faker.date.past(),
    }));

    return new Promise((resolve) => {
        setTimeout(() => {
            resolve(works);
        }, 1000);
    });
}
