import type { Slide } from "../-types/slide";

export type SlideInfoV2 = {
    $schema: string;
    id: string;
    title: string;
    created: string;
    presentation: null | {
        date: string;
        name: string;
        url: string;
    };
    lastUpdated: string;
    type: "draft" | "public" | "private";
    tags: string[];
    pictures?: Array<{
        path: string;
        blurhash?: string;
        blur?: string;
    }>;
    sourcePath: string;
};

export function toSlides(slideInfoList: SlideInfoV2[]): Slide[] {
    return slideInfoList
        .filter((slideInfo) => slideInfo.type !== "private")
        .sort((a, b) => new Date(b.lastUpdated).getTime() - new Date(a.lastUpdated).getTime())
        .sort((a, b) => new Date(b.presentation?.date ?? "").getTime() - new Date(a.presentation?.date ?? "").getTime())
        .map((slideInfo) => toSlide(slideInfo));
}

function toSlide(slideInfo: SlideInfoV2): Slide {
    const thumbnail = slideInfo.pictures?.[0];

    return {
        id: slideInfo.id,
        title: slideInfo.title,
        // 新しい slide-info は pictures 配列を持つので、その先頭をサムネイルに使う。
        thumbnailImage: thumbnail ? `/slide/${slideInfo.id}/${thumbnail.path}` : undefined,
        // 一部データの揺れも吸収できるよう blur もフォールバックで読む。
        thumbnailBlurhash: thumbnail?.blurhash ?? thumbnail?.blur,
        pageCount: slideInfo.pictures?.length ?? 0,
        // サムネ・タイトルは常にアプリ内の Slide ビューワへ
        slideUrl: `/slide/${slideInfo.id}`,
        // 発表イベント名の行だけ外部 URL（イベントページ等）
        presentationUrl: slideInfo.presentation?.url,
        lastUpdate: slideInfo.lastUpdated,
        presentationDate: slideInfo.presentation?.date,
        presentationName: slideInfo.presentation?.name,
        tags: slideInfo.tags ?? [],
        type: slideInfo.type,
    };
}
