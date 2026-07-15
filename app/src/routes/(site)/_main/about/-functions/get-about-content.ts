import type { Locale } from "../../../../paraglide/runtime";
import type { AboutData, AboutFrontmatter, AboutProfile } from "../-types/about";
import { parseAboutMarkdown } from "./parse-about-markdown";

// 各ロケールの about 記事を `?raw` でビルド時に取り込む。
const markdownGlob = import.meta.glob("../-content/about/*.md", {
    query: "?raw",
    import: "default",
    eager: true,
}) as Record<string, string>;

// ファイルパス末尾の `<locale>.md` からロケールを判定する。
function parseLocale(path: string): Locale | null {
    const match = path.replace(/\\/g, "/").match(/\/(en|ja)\.md$/);
    return match ? (match[1] as Locale) : null;
}

// frontmatter（構造化データ）と本文セクション（Markdown）から 1 ロケール分の profile を組み立てる。
function buildProfile(raw: string): AboutProfile {
    const { frontmatter, sections } = parseAboutMarkdown<AboutFrontmatter>(raw);

    const intro = sections.find((section) => section.kind === "intro");
    const future = sections.find((section) => section.kind === "future");
    if (!intro) {
        throw new Error('[get-about-content] Missing "section: intro" block.');
    }
    if (!future) {
        throw new Error('[get-about-content] Missing "section: future" block.');
    }

    // story 本文は frontmatter の並び順に揃え、id でセクションと突き合わせる。
    const stories = frontmatter.stories.map((meta) => {
        const body = sections.find((section) => section.kind === "story" && section.id === meta.id);
        if (!body) {
            throw new Error(`[get-about-content] Missing "section: story" block for id "${meta.id}".`);
        }
        return { ...meta, body: body.text };
    });

    return {
        pageTitle: frontmatter.pageTitle,
        metaDescription: frontmatter.metaDescription,
        avatarAlt: frontmatter.avatarAlt,
        sectionTitles: frontmatter.sectionTitles,
        intro: intro.text,
        stories,
        future: future.text,
        careerTitle: frontmatter.careerTitle,
        careerDescription: frontmatter.careerDescription,
        qualificationTitle: frontmatter.qualificationTitle,
        qualificationDescription: frontmatter.qualificationDescription,
        qualificationEmptyLabel: frontmatter.qualificationEmptyLabel,
        qualificationExpectedLabel: frontmatter.qualificationExpectedLabel,
        presentLabel: frontmatter.presentLabel,
    };
}

// すべてのロケールの記事を読み込み、ロケール別 profile としてまとめる。
function buildAboutData(): AboutData {
    const profile = {} as Record<Locale, AboutProfile>;

    for (const [path, raw] of Object.entries(markdownGlob)) {
        const locale = parseLocale(path);
        if (!locale) {
            continue;
        }
        profile[locale] = buildProfile(raw);
    }

    return { profile };
}

export const aboutData = buildAboutData();
