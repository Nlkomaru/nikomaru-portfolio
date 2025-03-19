import "server-only";
import type { Works } from "~/lib/type";
export async function getWorks(): Promise<Works[]> {
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
