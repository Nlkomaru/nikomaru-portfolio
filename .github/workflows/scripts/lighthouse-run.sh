#!/usr/bin/env bash
set -euo pipefail

urls_file="${1:-lighthouse-urls.txt}"
config_file="${2:-.lighthouserc.generated.json}"
log_file="${3:-lighthouse.log}"

node .github/workflows/scripts/lighthouse-write-config.mjs "$urls_file" "$config_file"

pnpm exec lhci autorun --config="$config_file" | tee "$log_file"
