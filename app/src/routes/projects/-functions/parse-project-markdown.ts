import { parse as parseYaml } from "yaml";
import type { ProjectImage } from "../-types/project";

// 1段落分の本文 + その段落に紐づくオプションのメタ情報。
// 段落の前に YAML ブロックを置くと、その値が次の段落に適用される。
export interface ProjectSection {
    /** 本文（Markdown） */
    text: string;
    /** 段落の左右に並べる図版 */
    image?: ProjectImage;
    /** 図版を段落のどちらに置くか。未指定なら画像なしのテキストのみ */
    layout?: "left-image" | "right-image";
}

// `?raw` で取り込んだ markdown を frontmatter と本文セクション群に分解する。
export interface ParsedProjectMarkdown<TFrontmatter> {
    frontmatter: TFrontmatter;
    /** 本文 markdown（frontmatter を除いた残り） */
    body: string;
    /** 本文を `---` で区切ったセクション配列 */
    sections: ProjectSection[];
}

const FRONTMATTER_PATTERN = /^---\r?\n([\s\S]*?)\r?\n---\r?\n?([\s\S]*)$/;
// 単独行の `---`（3つ以上のハイフン）でセクションを区切る。
const SECTION_SPLITTER = /\r?\n-{3,}\r?\n/;

// セクションメタのスキーマ。markdown body 中の YAML ブロックで使う。
interface SectionMeta {
    image?: ProjectImage;
    layout?: "left-image" | "right-image";
}

// 与えられたブロックがセクションメタの YAML かを判定する。
// YAML として object を返し、かつ既知キー（image / layout）を持つ場合のみ true。
function tryParseSectionMeta(block: string): SectionMeta | null {
    try {
        const parsed = parseYaml(block);
        if (parsed && typeof parsed === "object" && !Array.isArray(parsed)) {
            const candidate = parsed as Record<string, unknown>;
            if ("image" in candidate || "layout" in candidate) {
                return candidate as SectionMeta;
            }
        }
        return null;
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

    // body を `---` で分割し、(任意の YAML メタ) → テキスト の流れでセクションを組み立てる。
    const blocks = body
        .split(SECTION_SPLITTER)
        .map((block) => block.trim())
        .filter((block) => block.length > 0);

    const sections: ProjectSection[] = [];
    let pendingMeta: SectionMeta | null = null;

    for (const block of blocks) {
        const meta = tryParseSectionMeta(block);
        if (meta) {
            // YAML メタブロックは次の本文ブロックと結合するため一時保持する。
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
