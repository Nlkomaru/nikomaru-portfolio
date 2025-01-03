import { Hono } from "hono";
import { handle } from "hono/vercel";
import slide from "./slide";

export const runtime = "edge";

const app = new Hono().basePath("/api");

app.get("/hello", (c) => {
    return c.json({
        message: "Hello Next.js!",
    });
});

app.route("/slides", slide);

export const GET = handle(app);
export const POST = handle(app);
