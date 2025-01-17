import { Hono } from "hono";
import { handle } from "hono/vercel";
import { getWorks } from "~/lib/works";
import slide from "./slide";

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

app.route("/slides", slide);

export const GET = handle(app);
export const POST = handle(app);
