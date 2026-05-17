import type { Locale } from "../../../paraglide/runtime";
import mineAuthEnMarkdown from "../-content/MineAuth/en.md?raw";
import mineAuthJaMarkdown from "../-content/MineAuth/ja.md?raw";
import { type ProjectSlug, projectSlugs } from "../-content/project-slugs";

const projectMarkdownBySlug = {
    MineAuth: {
        en: mineAuthEnMarkdown,
        ja: mineAuthJaMarkdown,
    },
} satisfies Record<ProjectSlug, Partial<Record<Locale, string>>>;

export { projectSlugs };

export function isProjectSlug(slug: string): slug is ProjectSlug {
    return slug in projectMarkdownBySlug;
}

// 英語記事をまだ持たない project は、日本語記事を fallback として表示する。
export function getProjectMarkdown(slug: ProjectSlug, locale: Locale): string {
    const localizedMarkdown = projectMarkdownBySlug[slug];
    return localizedMarkdown[locale] ?? localizedMarkdown.ja;
}
