# Nikomaru Portfolio

This is a portfolio site of Nikomaru.

## Development

This site is built on the following technology stack.

- Framework: Tanstack Start
- UI Library: Chakra UI
- CSS Library: Panda CSS
- Animation Library: Motion
- 3D Library: React Three Fiber
- Formatter & Linter: Biome
- Git hook: lefthook
- CI/CD: GitHub Actions
- API Route's framework: Hono
- Hosting: Cloudflare Workers

## Workflow

- `pnpm run check` runs the repository-wide Biome checks.
- `lefthook` installs a `pre-commit` hook and runs `pnpm run check` automatically before commits.
- GitHub Actions run the same check flow in CI and include the label sync workflow for `.github/labels.json`.
