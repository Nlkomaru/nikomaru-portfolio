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
