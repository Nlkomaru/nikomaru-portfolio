export interface Slide {
    id: string;
    title: string;
    image: string;
    link: string;
    lastUpdate: Date | undefined;
    type: "draft" | "public" | "private";
}

export interface Works {
    id: string;
    title: string;
    image?: {
        url: string;
        width: number;
        height: number;
    };
    emoji: string;
    description: string;
    client: string;
    position: string;
    link: string;
    updatedAt: Date | undefined;
}

export interface SmartphoneImage {
    src: string;
    alt: string;
}

export interface DesktopImage {
    src: string;
    alt: string;
}

export interface Emoji {
    src: string;
    alt: string;
}
