import type { ConformanceLevel } from "./apca.ts";
import { bronze } from "./bronze.ts";
import { custom } from "./custom.ts";
import { silver } from "./silver.ts";

export function registerAPCACheck(conformanceLevel: ConformanceLevel) {
    switch (conformanceLevel) {
        case "custom":
            return custom;
        case "silver":
            return silver;
        case "bronze":
            return bronze;
        default:
            return bronze;
    }
}
