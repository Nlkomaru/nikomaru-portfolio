import { parse as parseYaml } from "yaml";
import type { ProjectImage } from "../-types/project";

// 1つの Markdown セクションに対して、任意で図版レイアウトを付与できる。
export interface ProjectSection {
    /** セクション本文。通常の Markdown として描画する。 */
    text: string;
    /** セクション横に並べる図版。 */
    image?: ProjectImage;
    /** 図版を置く位置。未指定なら通常の Markdown セクション。 */
    layout?: "left-image" | "right-image";
}

// `?raw` で取り込んだ markdown を frontmatter と本文セクション群に分解する。
export interface ParsedProjectMarkdown<TFrontmatter> {
    frontmatter: TFrontmatter;
    /** 本文 markdown（frontmatter を除いた残り） */
    body: string;
    /** `---` ごとに区切った本文セクション。 */
    sections: ProjectSection[];
}

const FRONTMATTER_PATTERN = /^---\r?\n([\s\S]*?)\r?\n---\r?\n?([\s\S]*)$/;
const SECTION_SPLITTER = /\r?\n-{3,}\r?\n/;

interface SectionMeta {
    image?: ProjectImage;
    layout?: "left-image" | "right-image";
}

// image/layout のどちらかを含む YAML ブロックだけを旧 section meta として扱う。
function tryParseSectionMeta(block: string): SectionMeta | null {
    try {
        const parsed = parseYaml(block);
        if (!parsed || typeof parsed !== "object" || Array.isArray(parsed)) {
            return null;
        }

        const candidate = parsed as Record<string, unknown>;
        if (!("image" in candidate) && !("layout" in candidate)) {
            return null;
        }

        return candidate as SectionMeta;
    } catch {
        return null;
    }
}

// markdown 文字列をパースする。frontmatter が無い場合は例外で気付けるようにする。
export function parseProjectMarkdown<TFrontmatter>(raw: string): ParsedProjectMarkdown<TFrontmatter> {
    const match = raw.match(FRONTMATTER_PATTERN);
    if (!match) {
        throw new Error("Project markdown is missing a YAML frontmatter block (--- ... ---).");
    }

    const [, yamlSource, body] = match;
    const frontmatter = parseYaml(yamlSource) as TFrontmatter;
    const blocks = body
        .split(SECTION_SPLITTER)
        .map((block) => block.trim())
        .filter((block) => block.length > 0);

    const sections: ProjectSection[] = [];
    let pendingMeta: SectionMeta | null = null;

    for (const block of blocks) {
        const meta = tryParseSectionMeta(block);
        if (meta) {
            // 旧記法では meta ブロックの直後の本文へレイアウトを適用する。
            pendingMeta = meta;
            continue;
        }

        sections.push({
            text: block,
            image: pendingMeta?.image,
            layout: pendingMeta?.layout,
        });
        pendingMeta = null;
    }

    return {
        frontmatter,
        body,
        sections,
    };
}
