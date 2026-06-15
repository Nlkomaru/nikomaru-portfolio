import type { Locale } from "../../../../../paraglide/runtime";

export type LocalizedText = Record<Locale, string>;

export interface AboutProfile {
    pageTitle: string;
    metaDescription: string;
    title: string;
    paragraphs: string[];
    highlights: string[];
    careerTitle: string;
    careerDescription: string;
    qualificationTitle: string;
    qualificationDescription: string;
    qualificationEmptyLabel: string;
    presentLabel: string;
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

export interface Qualification {
    id: string;
    acquiredAt: string;
    name: LocalizedText;
    issuer: LocalizedText;
}

export interface LocalizedQualification extends Omit<Qualification, "name" | "issuer"> {
    name: string;
    issuer: string;
}

export interface AboutData {
    profile: Record<Locale, AboutProfile>;
}
