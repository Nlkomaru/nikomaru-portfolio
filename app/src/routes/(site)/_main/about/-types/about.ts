import type { Locale } from "../../../../../paraglide/runtime";

export type LocalizedText = Record<Locale, string>;

export interface AboutSectionTitles {
    about: string;
    hobby: string;
    future: string;
}

export interface AboutImage {
    src: string;
    alt: string;
    caption: string;
}

// story のうち、Markdown 本文を除いた構造化データ（frontmatter 由来）。
export interface AboutStoryMeta {
    id: string;
    title: string;
    image: AboutImage;
}

// about 記事 markdown の frontmatter（本文以外の構造化データ）。
export interface AboutFrontmatter {
    pageTitle: string;
    metaDescription: string;
    avatarAlt: string;
    sectionTitles: AboutSectionTitles;
    stories: AboutStoryMeta[];
    careerTitle: string;
    careerDescription: string;
    qualificationTitle: string;
    qualificationDescription: string;
    qualificationEmptyLabel: string;
    qualificationExpectedLabel: string;
    presentLabel: string;
}

export interface AboutProfile {
    pageTitle: string;
    metaDescription: string;
    avatarAlt: string;
    sectionTitles: AboutSectionTitles;
    /** 冒頭の自己紹介（Markdown）。 */
    intro: string;
    stories: AboutStory[];
    /** 「今後」セクション本文（Markdown）。 */
    future: string;
    careerTitle: string;
    careerDescription: string;
    qualificationTitle: string;
    qualificationDescription: string;
    qualificationEmptyLabel: string;
    qualificationExpectedLabel: string;
    presentLabel: string;
}

export interface AboutStory extends AboutStoryMeta {
    /** story 本文（Markdown）。 */
    body: string;
}

export interface Career {
    id: string;
    startDate: string;
    endDate: string | null;
    title: LocalizedText;
    description: LocalizedText;
}

export interface LocalizedCareer extends Omit<Career, "title" | "description"> {
    title: string;
    description: string;
}

type QualificationDate = { acquiredAt: string; expectedAt?: never } | { acquiredAt?: never; expectedAt: string };

export type Qualification = QualificationDate & {
    id: string;
    name: LocalizedText;
    issuer: LocalizedText;
};

export interface LocalizedQualification extends Omit<Qualification, "name" | "issuer"> {
    name: string;
    issuer: string;
}

export interface AboutData {
    profile: Record<Locale, AboutProfile>;
}
