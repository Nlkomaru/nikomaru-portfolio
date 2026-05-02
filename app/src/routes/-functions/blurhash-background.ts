import { blurhashToCssGradientString } from "@unpic/placeholder";

export function getBlurhashBackground(blurhash: string) {
    return {
        backgroundImage: blurhashToCssGradientString(blurhash),
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat",
        backgroundSize: "cover",
    } as const;
}
