import type { Locale } from "../../../../../paraglide/runtime";

export type LocalizedText = Record<Locale, string>;

export interface AboutProfile {
    pageTitle: string;
    metaDescription: string;
    avatarAlt: string;
    sectionTitles: {
        about: string;
        hobby: string;
        future: string;
    };
    paragraphs: string[];
    stories: AboutStory[];
    futureParagraphs: string[];
    careerTitle: string;
    careerDescription: string;
    qualificationTitle: string;
    qualificationDescription: string;
    qualificationEmptyLabel: string;
    qualificationExpectedLabel: string;
    presentLabel: string;
}

export interface AboutStory {
    id: string;
    title: string;
    paragraphs: string[];
    image: {
        src: string;
        alt: string;
        caption: string;
    };
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
