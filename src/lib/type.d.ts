interface Slide {
    id: string;
    title: string;
    image: string;
    link: string;
    lastUpdate: Date | undefined;
}

interface Works {
    id: string;
    title: string;
    image: {
        url: string;
        width: number;
        height: number;
    };
    emoji: string;
    description: string;
    client: string;
    position: string;
    link: string;
}

interface SmartphoneImage {
    src: string;
    alt: string;
}

interface DesktopImage {
    src: string;
    alt: string;
}

interface Emoji {
    src: string;
    alt: string;
}
