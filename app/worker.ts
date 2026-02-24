import handler from "@tanstack/react-start/server-entry";
import { paraglideMiddleware } from "./src/paraglide/server";

export default {
    fetch(request: Request, env: Record<string, unknown>, ctx: ExecutionContext) {
        void ctx;
        return paraglideMiddleware(request, () => handler.fetch(request, { context: env }));
    },
};
