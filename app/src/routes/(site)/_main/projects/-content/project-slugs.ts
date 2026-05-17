export const projectSlugs = ["MineAuth"] as const;

export type ProjectSlug = (typeof projectSlugs)[number];
