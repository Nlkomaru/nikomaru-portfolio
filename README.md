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

The Photos gallery is generated from favorites in the Omoide account. Each independently favorited original and development image is included; favoriting a parent does not implicitly include its developments. PNG, WebP, JPEG, and AVIF sources are converted to AVIF at quality 60 and effort 4, resized within 2560×2560 pixels without enlargement, and given a 4×3 BlurHash. Image metadata, including GPS/EXIF, is stripped. Generated entries omit archive descriptions, filenames, and private source URLs; alt text uses only the capture date and `Original`/`Developed` version.

The generated AVIF files (`app/public/photos/<UUIDv7>.avif`), the public manifest in `app/src/routes/(site)/_main/photos/-content/photos.json`, and non-public incremental-generation state in `scripts/photo-sync-state.json` are committed. Public photo URLs use stable UUIDv7 filenames; the manifest is statically included in the site so both locale routes can be rendered during static generation. The state file is a build-time input and is not included in the client bundle; it is tracked repository metadata, not a secret. Normal builds, previews, and deployments use this committed snapshot and do not contact Omoide or require its credentials. Generated files contain no source URLs or private archive metadata.

Omoide's original `jpegSha256` identifies the source JPEG before optional upload compression, not the served bytes; the original-image HEAD response has no reliable ETag or Last-Modified validator. To avoid missing changed original bytes, the incremental state conservatively uses source identity, byte size, and Omoide's `updatedAt` revision, so a favorite/metadata/note edit that changes `updatedAt` can regenerate that original even when its image bytes are unchanged. Development `sha256` values describe the served bytes and are verified before publication; development metadata-only edits do not re-encode the image. Changed processing settings, missing or corrupt output, and changed source revisions regenerate only the affected images; valid unchanged AVIFs and their stored dimensions/BlurHash are reused.

To synchronize locally, put `OMOIDE_API_KEY` in the root `.env` file (optionally set `OMOIDE_API_URL`; it defaults to `https://omoide.nikomaru.dev`) and run:

```bash
pnpm run photos:sync
```

This command updates generated files and incremental state locally; review and commit the intended generated changes. Normal app builds and deployments consume the committed photo snapshot and do not synchronize photos or require Omoide access.

GitHub Actions runs **Refresh Photos** daily at **19:17 UTC (04:17 JST)** and supports manual runs at **Actions → Refresh Photos → Run workflow**. If generated files change, it creates a PR containing only changed UUIDv7 AVIF files, the manifest, and sync state, then merges that generated-only PR under the repository's existing `main` pull-request rule. Upon successfully merging the snapshot, the workflow invokes the **Deploy** reusable workflow to deploy the new snapshot commit, avoiding reliance on push triggers that are suppressed during `GITHUB_TOKEN` merges. A no-change run does not create a PR or deploy. This automation requires the repository's **Allow GitHub Actions to create and approve pull requests** setting; `main` remains PR-protected and normal code PRs are not auto-merged. To deploy the committed snapshot without refreshing photos, use **Actions → Deploy → Run workflow**.

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
