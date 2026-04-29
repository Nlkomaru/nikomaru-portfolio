export interface Slide {
    id: string;
    title: string;
    image: string;
    /** アプリ内の Slide 閲覧 URL（`/slide/:id`） */
    slideUrl: string;
    /** 発表イベント・イベントページ等の URL（メタデータに含まれる場合のみ） */
    presentationUrl: string | undefined;
    lastUpdate: string | undefined;
    presentationDate: string | undefined;
    presentationName: string | undefined;
    tags: string[];
    type: "draft" | "public" | "private";
}
