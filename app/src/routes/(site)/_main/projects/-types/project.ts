// プロジェクト詳細ページの表示に必要なデータ構造。

export interface ProjectImage {
    src: string;
    alt: string;
    caption?: string;
}

export interface ProjectMetaItem {
    /** "Role" / "Stack" 等のラベル */
    term: string;
    /** ラベルに対応する値（リンクの場合は表示テキスト） */
    description: string;
    /** リンクとして表示する場合の遷移先 URL */
    href?: string;
    /** 外部リンクかどうか（target="_blank"の付与判定に使う） */
    external?: boolean;
}

export interface ProjectOpenGraph {
    title: string;
    description: string;
    /** SNS クローラ互換のため PNG を使う。 */
    image: string;
    imageAlt: string;
}

export interface Project {
    /** ルーティングで使う slug（URL の /projects/$project と一致する） */
    slug: string;
    title: string;
    /** 一覧カードで表示する分類。未指定の場合は "Project" として扱う。 */
    category?: string;
    abstract: string;
    /** Definition List に表示するメタ情報。リンク（live / source 等）もここに含める。 */
    metaItems: ProjectMetaItem[];
    coverImage: ProjectImage;
    openGraph: ProjectOpenGraph;
}

export interface ProjectIndexItem {
    slug: Project["slug"];
    title: Project["title"];
    category: string;
    image: ProjectImage;
    year?: string;
}
