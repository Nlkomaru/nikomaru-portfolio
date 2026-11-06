import { getBlurhashBackground } from "../../../../-functions/blurhash-background";
import type { PhotoEntry } from "../-types/photo-gallery";

const PHOTO_INDEX_PATH = "/photos/index.json";

type PhotoIndex = {
    photos: PhotoEntry[];
};

export async function getPhotoEntries() {
    const response = await fetch(PHOTO_INDEX_PATH);

    if (!response.ok) {
        throw new Error("Failed to load photo index.");
    }

    const index = (await response.json()) as PhotoIndex;
    return index.photos;
}
export function getPhotoBackgroundStyle(blurhash: string) {
    return getBlurhashBackground(blurhash);
}
