import { parse as parseYaml } from "yaml";

// 本文セクションの種別。intro / story / future のいずれかに紐づける。
export type AboutSectionKind = "intro" | "story" | "future";

// `---` で区切った本文セクション 1 つ分。
export interface AboutSection {
    /** セクション種別。 */
    kind: AboutSectionKind;
    /** kind が "story" のとき、どの story に対応するかを示す id。 */
    id?: string;
    /** セクション本文（Markdown）。 */
    text: string;
}

// `?raw` で取り込んだ markdown を frontmatter と本文セクション群に分解した結果。
export interface ParsedAboutMarkdown<TFrontmatter> {
    frontmatter: TFrontmatter;
    /** `---` ごとに区切った本文セクション。 */
    sections: AboutSection[];
}

// frontmatter ブロック（先頭の --- ... ---）を取り出す。
const FRONTMATTER_PATTERN = /^---\r?\n([\s\S]*?)\r?\n---\r?\n?([\s\S]*)$/;
// 本文を区切る `---` 行。projects の markdown と同じ記法を踏襲する。
const SECTION_SPLITTER = /\r?\n-{3,}\r?\n/;

// セクション meta ブロック（section: ... を持つ YAML）。本文ブロックの直前に置く。
interface SectionMeta {
    section: AboutSectionKind;
    id?: string;
}

// `section` キーを持つ YAML ブロックだけを section meta として扱う。
function tryParseSectionMeta(block: string): SectionMeta | null {
    try {
        const parsed = parseYaml(block);
        if (!parsed || typeof parsed !== "object" || Array.isArray(parsed)) {
            return null;
        }

        const candidate = parsed as Record<string, unknown>;
        if (typeof candidate.section !== "string") {
            return null;
        }

        return candidate as SectionMeta;
    } catch {
        return null;
    }
}

// markdown 文字列をパースする。frontmatter が無い場合は例外で気付けるようにする。
export function parseAboutMarkdown<TFrontmatter>(raw: string): ParsedAboutMarkdown<TFrontmatter> {
    const match = raw.match(FRONTMATTER_PATTERN);
    if (!match) {
        throw new Error("About markdown is missing a YAML frontmatter block (--- ... ---).");
    }

    const [, yamlSource, body] = match;
    const frontmatter = parseYaml(yamlSource) as TFrontmatter;
    const blocks = body
        .split(SECTION_SPLITTER)
        .map((block) => block.trim())
        .filter((block) => block.length > 0);

    const sections: AboutSection[] = [];
    let pendingMeta: SectionMeta | null = null;

    for (const block of blocks) {
        const meta = tryParseSectionMeta(block);
        if (meta) {
            // meta ブロックの直後の本文へ、その section 種別を適用する。
            pendingMeta = meta;
            continue;
        }

        if (!pendingMeta) {
            throw new Error("About markdown body is missing a section meta block (section: ...) before its text.");
        }

        sections.push({ kind: pendingMeta.section, id: pendingMeta.id, text: block });
        pendingMeta = null;
    }

    return { frontmatter, sections };
}
