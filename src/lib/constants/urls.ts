import { BookUser, Boxes, Presentation } from "lucide-react";

export const URLS = {
    HOME: "/",
    SLIDES: "/slides",
    WORKS: "/works",
    ABOUT_ME: "/about-me",
} as const;

export type URL = (typeof URLS)[keyof typeof URLS];

export const NAVIGATION_ITEMS = [
    {
        url: URLS.SLIDES,
        name: "スライド",
        rootName: "つくったスライド",
        label: "Slides",
        icon: Presentation,
    },
    {
        url: URLS.WORKS,
        name: "作ったもの",
        rootName: "作ったもの",
        label: "Works",
        icon: Boxes,
    },
    {
        url: URLS.ABOUT_ME,
        name: "私について",
        rootName: "わたしについて",
        label: "About Me",
        icon: BookUser,
    },
] as const;
