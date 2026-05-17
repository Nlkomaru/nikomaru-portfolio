export type PhotoDirectoryIndex = {
    dirs: PhotoDirectorySummary[];
    dir_count: number;
    image_count: number;
    warning_count: number;
};

export type PhotoDirectorySummary = {
    dir: string;
    source: string;
    image_count: number;
    warning_count: number;
    images_json: string;
};

export type PhotoDirectory = {
    dir: string;
    image_count: number;
    warning_count: number;
    images: PhotoImage[];
};

export type PhotoImage = {
    src_webp: string;
    src_raw: string;
    avif: string;
    width: number;
    height: number;
    blurhash: string;
    camera_make: string;
    camera_model: string;
    lens_model: string;
    warnings: string[];
};

export type PhotoEntry = {
    id: string;
    album: string;
    src: string;
    alt: string;
    width: number;
    height: number;
    blurhash: string;
    cameraLabel: string;
    lensLabel: string;
};
