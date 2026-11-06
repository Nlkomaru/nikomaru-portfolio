import { getBlurhashBackground } from "../../../../-functions/blurhash-background";
import photoIndex from "../-content/photos.json";
import type { PhotoEntry } from "../-types/photo-gallery";

export function getPhotoEntries(): PhotoEntry[] {
    return photoIndex.photos;
}
export function getPhotoBackgroundStyle(blurhash: string) {
    return getBlurhashBackground(blurhash);
}
