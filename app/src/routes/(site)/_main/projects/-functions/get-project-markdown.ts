import type { Locale } from "../../../../../paraglide/runtime";
import { type ProjectSlug, projectSlugs } from "../-content/project-slugs";

const markdownGlob = import.meta.glob("../-content/*/*.md", {
    query: "?raw",
    import: "default",
    eager: true,
}) as Record<string, string>;

function parseSlugAndLocale(path: string): { slug: string; locale: Locale } | null {
    const normalizedPath = path.replace(/\\/g, "/");
    const match = normalizedPath.match(/\/([^/]+)\/(en|ja)\.md$/);
    if (!match) {
        return null;
    }
    return { slug: match[1], locale: match[2] as Locale };
}

function buildProjectMarkdownBySlug(): Record<ProjectSlug, Partial<Record<Locale, string>>> {
    const bySlug = Object.fromEntries(
        projectSlugs.map((slug) => [slug, {} as Partial<Record<Locale, string>>]),
    ) as Record<ProjectSlug, Partial<Record<Locale, string>>>;

    for (const [path, raw] of Object.entries(markdownGlob)) {
        const parsed = parseSlugAndLocale(path);
        if (!parsed) {
            continue;
        }
        const { slug, locale } = parsed;
        if (!(projectSlugs as readonly string[]).includes(slug)) {
            continue;
        }
        bySlug[slug as ProjectSlug][locale] = raw;
    }

    return bySlug;
}

const projectMarkdownBySlug = buildProjectMarkdownBySlug();

for (const slug of projectSlugs) {
    if (!projectMarkdownBySlug[slug]?.ja) {
        throw new Error(`[get-project-markdown] Expected ../-content/${slug}/ja.md (Japanese markdown is required).`);
    }
}

export { projectSlugs };

export function isProjectSlug(slug: string): slug is ProjectSlug {
    return (projectSlugs as readonly string[]).includes(slug);
}

// 英語記事をまだ持たない project は、日本語記事を fallback として表示する。
export function getProjectMarkdown(slug: ProjectSlug, locale: Locale): string {
    const localizedMarkdown = projectMarkdownBySlug[slug];
    const resolved = localizedMarkdown[locale] ?? localizedMarkdown.ja;
    if (resolved === undefined) {
        throw new Error(`[get-project-markdown] No markdown body for "${slug}" (locale ${locale}).`);
    }
    return resolved;
}
