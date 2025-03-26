import { Hono } from "hono";
import { getSlides } from "~/lib/slides";

const app = new Hono<{ Bindings: CloudflareEnv }>();

app.get("list", async (c) => {
    const slides = await getSlides();

    c.header("Content-Type", "application/json");
    return c.json(slides);
});

export default app;
