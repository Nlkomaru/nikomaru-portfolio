import type { Project } from "../-types/project";
import type { ParsedProjectMarkdown } from "./parse-project-markdown";

// 各 slug の `-content/<Slug>/assets/` に置いた画像をビルド時に取り込み、`?url` でハッシュ付き URL に変換する。
// YAML / frontmatter では `./assets/foo.avif` のようにプロジェクトルート（`-content/<Slug>/`）からの相対パスで書く。
const projectContentAssetGlob = import.meta.glob("../-content/*/assets/*.{png,jpg,jpeg,gif,webp,avif,svg}", {
    eager: true,
    query: "?url",
    import: "default",
}) as Record<string, string>;

/** glob のキーから `-content/` 以降の posix 相対パス（例: `MineAuth/assets/community.avif`）を取り出す。 */
function contentRelativePathFromGlobKey(globKey: string): string | null {
    const posixPath = globKey.replace(/\\/g, "/");
    const marker = "/-content/";
    const idx = posixPath.indexOf(marker);
    if (idx === -1) {
        return null;
    }
    return posixPath.slice(idx + marker.length);
}

const assetUrlByContentPath = new Map<string, string>();
for (const [globKey, url] of Object.entries(projectContentAssetGlob)) {
    const relativePath = contentRelativePathFromGlobKey(globKey);
    if (relativePath !== null) {
        assetUrlByContentPath.set(relativePath, url);
    }
}

/** frontmatter / section YAML で書いたパスを解決する。`-content/<Slug>/` 直下からの相対（例: `./assets/foo.avif`）を bundled URL に変換する。 */
export function resolveProjectContentAsset(slug: string, src: string): string {
    const trimmed = src.trim();
    if (trimmed.startsWith("/")) {
        return trimmed;
    }
    if (/^[a-zA-Z][a-zA-Z\d+\-.]*:/u.test(trimmed)) {
        return trimmed;
    }

    const relativeFile = trimmed.replace(/^\.\//u, "");
    const lookupKey = `${slug}/${relativeFile}`;
    const resolved = assetUrlByContentPath.get(lookupKey);
    if (resolved === undefined) {
        throw new Error(
            `[resolve-project-content-assets] Missing bundled asset for slug="${slug}" src="${src}" (lookup "${lookupKey}").`,
        );
    }
    return resolved;
}

/** パース済み markdown の画像参照を一括で解決する。 */
export function resolveParsedProjectAssets(
    slug: string,
    parsed: ParsedProjectMarkdown<Project>,
): ParsedProjectMarkdown<Project> {
    const resolveSrc = (path: string) => resolveProjectContentAsset(slug, path);

    return {
        ...parsed,
        frontmatter: {
            ...parsed.frontmatter,
            coverImage: {
                ...parsed.frontmatter.coverImage,
                src: resolveSrc(parsed.frontmatter.coverImage.src),
            },
            openGraph: {
                ...parsed.frontmatter.openGraph,
                image: resolveSrc(parsed.frontmatter.openGraph.image),
            },
        },
        sections: parsed.sections.map((section) => ({
            ...section,
            image: section.image
                ? {
                      ...section.image,
                      src: resolveSrc(section.image.src),
                  }
                : undefined,
        })),
    };
}
