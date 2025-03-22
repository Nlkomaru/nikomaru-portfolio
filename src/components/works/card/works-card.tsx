"use client";
import type { Works } from "~/lib/type";
import EmojiCard from "./emoji-card";
import ImageCard from "./image-card";

type Params = {
    works: Works;
};

export default function WorksCard({ works }: Params) {
    if (!works.image) {
        return <EmojiCard works={works} />;
    }
    return <ImageCard works={works} />;
}
