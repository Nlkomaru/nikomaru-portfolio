import { Hono } from "hono";
import { handle } from "hono/vercel";
import { getSlides } from "~/lib/slides";
import { getWorks } from "~/lib/works";

const app = new Hono().basePath("/api");

app.get("/hello", (c) => {
    return c.json({
        message: "Hello Next.js!",
    });
});

app.get("/products", async (c) => {
    const data = await getWorks();
    return c.json(data);
});

app.get("/slides", async (c) => {
    const slides = await getSlides();
    return c.json(slides);
});

export const GET = handle(app);
export const POST = handle(app);
