# Nikomaru Portfolio

This is a portfolio site of Nikomaru.

## Development

This site is built on the following technology stack.

- Framework: Tanstack Start
- UI Library: Chakra UI
- CSS Library: Panda CSS
- Animation Library: Motion
- Formatter & Linter: Biome
- Git hook: lefthook
- CI/CD: GitHub Actions
- API Route's framework: Hono
- Hosting: Cloudflare Workers

## Workflow

- `pnpm run check` runs the repository-wide Biome checks.
- `lefthook` installs a `pre-commit` hook and runs `pnpm run check` automatically before commits.
- GitHub Actions run the same check flow in CI and include the label sync workflow for `.github/labels.json`.

## Photos

The Photos gallery is generated from the favorites in the Omoide account. It includes each independently favorited original and each independently favorited development image; favoriting a parent image does not implicitly include its developments. PNG, WebP, JPEG, and AVIF sources are converted to AVIF at quality 60 and effort 4, resized within 2560×2560 pixels without enlargement, and given a 4×3 BlurHash. Image metadata, including GPS/EXIF, is stripped. Generated entries omit archive descriptions, filenames, and private source URLs; alt text uses only the capture date and `Original`/`Developed` version. Output is written under the ignored `app/public/photos/` directory.

Omoide's original `jpegSha256` identifies the source JPEG before optional upload compression, not the served bytes. Development `sha256` values describe the served bytes and are verified before publication.

For local synchronization, put `OMOIDE_API_KEY` in the root `.env` file (optionally set `OMOIDE_API_URL`; it defaults to `https://omoide.nikomaru.dev`) and run:

```bash
pnpm run photos:sync
```

Run `pnpm run photos:sync` before local `pnpm run build` or `pnpm run preview`; builds remain network-free. The app's deploy script synchronizes photos automatically before building.

GitHub Actions runs the same synchronization before building the app. Configure the repository Actions secret `OMOIDE_API_KEY`; the optional Actions variable `OMOIDE_API_URL` can override the API endpoint. The Deploy workflow refreshes photos daily at 19:17 UTC (04:17 JST) and on normal deployments. To refresh manually, open **Actions → Deploy → Run workflow** in GitHub. A synchronization failure stops the app build/deployment, leaving the currently deployed site unchanged.

## Project links

Project detail source and documentation URLs are maintained in both `en.md` and `ja.md` under `app/src/routes/(site)/_main/projects/-content/`. Update both locales when repositories or documentation domains move. Links to another project article use `./Slug` and are rendered as locale-aware router links.

## Search indexing

The production origin is `https://www.nikomaru.dev`; the apex domain redirects to `www`. `/sitemap.xml` and the sitemap declaration in `app/public/robots.txt` must use this same origin. The sitemap lists public pages in both locales, project articles, and public slides (excluding draft and private).

After deployment, submit `https://www.nikomaru.dev/sitemap.xml` in the matching Search Console property. A successful browser request does not prove Googlebot can fetch it; if Search Console still reports a fetch failure, check its error details and Cloudflare security events for blocked Google requests.

## Image presentation

About story photos keep their original aspect ratio and align to the top of the copy. On desktop, each story section fills the available page width; its image column starts at half the section and narrows until the photo and adjacent copy have similar heights, with the copy taking the freed space. The Photos gallery shows thumbnails without an entrance animation; selecting one opens the full-size lightbox.

## APM

This repository includes an `apm.yml` manifest for MCP setup.

- `playwright`: local stdio server via `npx -y @playwright/mcp@0.0.71`
- `figma`: official Figma remote MCP bridged through `npx -y mcp-remote@0.1.38 https://mcp.figma.com/mcp` so Codex can launch it as a local stdio server
- Playwright artifacts are written to `.playwright-mcp/artifacts` instead of the repository root.

If you use APM, run the following after cloning:

```bash
apm install
```

Notes:

- `apm_modules/` is ignored and should not be committed.
- Figma authentication and client-side connection flow are handled when your MCP client connects to the remote Figma server.
