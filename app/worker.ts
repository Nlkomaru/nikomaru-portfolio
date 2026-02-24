import handler from "@tanstack/react-start/server-entry";
import { paraglideMiddleware } from "./src/paraglide/server";

export default {
    fetch(request: Request, env: unknown, ctx: ExecutionContext) {
        return paraglideMiddleware(request, () => handler.fetch(request, env, ctx));
    },
};
