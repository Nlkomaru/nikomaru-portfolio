// プロジェクト詳細ページの表示に必要なデータ構造。

export interface ProjectImage {
    src: string;
    alt: string;
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

export interface Project {
    /** ルーティングで使う slug（URL の /projects/$project と一致する） */
    slug: string;
    /** "Project / 002" の "002" 部分。プロジェクト一覧での通し番号。 */
    serialNumber: string;
    title: string;
    abstract: string;
    /** Definition List に表示するメタ情報。リンク（live / source 等）もここに含める。 */
    metaItems: ProjectMetaItem[];
    coverImage: ProjectImage;
}
