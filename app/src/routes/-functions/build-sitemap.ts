const SITE_ORIGIN = "https://nikomaru.dev";
const PUBLIC_PATHS = ["/", "/about", "/photos", "/projects", "/talks"];

// URLs are generated from the same project and slide collections as the public pages.
export function buildSitemap(projectSlugs: readonly string[], slideIds: readonly string[]): string {
    const projectPaths = projectSlugs.flatMap((slug) => {
        const path = `/projects/${encodeURIComponent(slug)}`;
        return [path, `/ja${path}`];
    });
    const paths = [
        ...PUBLIC_PATHS.flatMap((path) => [path, path === "/" ? "/ja" : `/ja${path}`]),
        ...projectPaths,
        // The slide viewer serves the same deck in both locales; index one canonical URL.
        ...slideIds.map((id) => `/slide/${encodeURIComponent(id)}`),
    ];
    const urls = paths.map((path) => `  <url><loc>${escapeXml(`${SITE_ORIGIN}${path}`)}</loc></url>`).join("\n");

    return `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urls}\n</urlset>`;
}

function escapeXml(value: string): string {
    return value.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
}
