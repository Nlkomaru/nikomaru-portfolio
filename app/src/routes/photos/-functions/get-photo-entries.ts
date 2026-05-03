import { getBlurhashBackground } from "../../-functions/blurhash-background";
import type { PhotoDirectory, PhotoDirectoryIndex } from "../-types/photo-gallery";

const PHOTO_INDEX_PATH = "/photos/index.json";

function buildAlbumLabel(dir: string) {
    const [date, ...slugParts] = dir.split("_");
    const slug = slugParts.join(" ");

    return `${date} ${slug.replaceAll("-", " ")}`.trim();
}

function buildAltText(album: string, index: number) {
    return `${album} photo ${String(index + 1).padStart(2, "0")}`;
}

export async function getPhotoEntries() {
    const indexResponse = await fetch(PHOTO_INDEX_PATH);

    if (!indexResponse.ok) {
        throw new Error("Failed to load photo index.");
    }

    const index = (await indexResponse.json()) as PhotoDirectoryIndex;
    const directories = await Promise.all(
        index.dirs.map(async (directorySummary) => {
            const directoryResponse = await fetch(`/photos/${directorySummary.images_json}`);

            if (!directoryResponse.ok) {
                throw new Error(`Failed to load photo directory: ${directorySummary.dir}`);
            }

            return (await directoryResponse.json()) as PhotoDirectory;
        }),
    );

    return [...directories].reverse().flatMap((directory) => {
        const album = buildAlbumLabel(directory.dir);

        return [...directory.images].reverse().map((image, index) => ({
            id: `${directory.dir}-${index}`,
            album,
            src: `/photos/${image.avif}`,
            alt: buildAltText(album, index),
            width: image.width,
            height: image.height,
            blurhash: image.blurhash,
            cameraLabel: `${image.camera_make} ${image.camera_model}`.trim(),
            lensLabel: image.lens_model,
        }));
    });
}

export function getPhotoBackgroundStyle(blurhash: string) {
    return getBlurhashBackground(blurhash);
}
