export interface Slide {
    id: string;
    title: string;
    image: string;
    link: string;
    lastUpdate: string | undefined;
    type: "draft" | "public" | "private";
}
