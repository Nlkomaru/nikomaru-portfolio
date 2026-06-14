import { blurhashToCssGradientString } from "@unpic/placeholder";

export function getBlurhashBackground(blurhash: string) {
    return {
        backgroundImage: blurhashToCssGradientString(blurhash),
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat",
        backgroundSize: "cover",
        // Prevent browsers from painting alt text over the placeholder while the image is loading.
        color: "transparent",
    } as const;
}
