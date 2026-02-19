#!/usr/bin/env bash
set -euo pipefail

urls_file="${1:-lighthouse-urls.txt}"
output_dir="${2:-lighthouse}"
parallelism="${3:-4}"

mkdir -p "$output_dir"

export LIGHTHOUSE_CHROME_FLAGS="--headless --no-sandbox --disable-gpu"

cat "$urls_file" | tr -d '\r' | sed '/^$/d' | xargs -I {} -P "$parallelism" bash -c '
  url="{}"
  safe=$(echo "$url" | sed "s#https\?://##" | sed "s#[^a-zA-Z0-9._-]#_#g")
  pnpm dlx lighthouse "$url" \
    --output=json \
    --output-path="'$output_dir'/$safe.json" \
    --chrome-flags="$LIGHTHOUSE_CHROME_FLAGS"
'
