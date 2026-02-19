#!/usr/bin/env bash
set -euo pipefail

urls_file="${1:-lighthouse-urls.txt}"
output_dir="${2:-lighthouse}"
parallelism="${3:-4}"
runs_per_url="${4:-1}"
max_attempts="${5:-2}"
failures_file="${output_dir}/failures.txt"

mkdir -p "$output_dir"
rm -f "$failures_file"

export LIGHTHOUSE_CHROME_FLAGS="--headless --no-sandbox --disable-gpu"

cat "$urls_file" | tr -d '\r' | sed '/^$/d' | xargs -I {} -P "$parallelism" bash -c '
  url="{}"
  safe=$(echo "$url" | sed "s#https\?://##" | sed "s#[^a-zA-Z0-9._-]#_#g")
  for run in $(seq 1 "'$runs_per_url'"); do
    attempt=1
    succeeded=0
    while [ "$attempt" -le "'$max_attempts'" ]; do
      if pnpm dlx lighthouse "$url" \
        --output=json \
        --output-path="'$output_dir'/${safe}__run${run}.json" \
        --chrome-flags="$LIGHTHOUSE_CHROME_FLAGS"; then
        succeeded=1
        break
      fi
      attempt=$((attempt + 1))
      sleep 1
    done

    if [ "$succeeded" -ne 1 ]; then
      echo "$url run=$run failed_after='"$max_attempts"'" >> "'$failures_file'"
    fi
  done
  exit 0
'

if [ -f "$failures_file" ] && [ -s "$failures_file" ]; then
  echo "Lighthouse failed for some runs:"
  cat "$failures_file"
  exit 1
fi
