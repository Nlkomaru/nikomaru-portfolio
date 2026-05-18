// Worker / SSR でも .md をソースとして解析させないよう、必ず ?raw（get-project-markdown と揃える）。
const projectJaMarkdownGlob = import.meta.glob("../-content/*/ja.md", {
    query: "?raw",
    import: "default",
    eager: true,
}) as Record<string, string>;

function slugFromJaMarkdownPath(path: string): string | null {
    const normalizedPath = path.replace(/\\/g, "/");
    const match = normalizedPath.match(/\/([^/]+)\/ja\.md$/);
    return match?.[1] ?? null;
}

const sortedSlugs = [
    ...new Set(
        Object.keys(projectJaMarkdownGlob)
            .map(slugFromJaMarkdownPath)
            .filter((slug): slug is string => slug !== null),
    ),
].sort((a, b) => a.localeCompare(b));

if (sortedSlugs.length === 0) {
    throw new Error("[project-slugs] Expected at least one ../-content/<Slug>/ja.md.");
}

/** `ja.md` がある `-content/<Slug>/` から収集（ソート済み）。 */
export const projectSlugs = Object.freeze(sortedSlugs);

export type ProjectSlug = (typeof projectSlugs)[number];
