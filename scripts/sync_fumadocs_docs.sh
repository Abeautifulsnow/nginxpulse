#!/usr/bin/env bash
set -euo pipefail

ROOT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
WIKI_DIR="$ROOT_DIR/docs/wiki"
FUMADOCS_DIR="$ROOT_DIR/docs/fumadocs"
TARGET_DIR="$FUMADOCS_DIR/content/docs"

if [[ ! -d "$WIKI_DIR" ]]; then
  echo "Wiki directory not found: $WIKI_DIR" >&2
  exit 1
fi

if [[ ! -d "$FUMADOCS_DIR" ]]; then
  echo "Fumadocs directory not found: $FUMADOCS_DIR" >&2
  exit 1
fi

mkdir -p "$TARGET_DIR"

# Keep index.mdx and meta.json managed by Fumadocs, refresh only markdown docs.
find "$TARGET_DIR" -maxdepth 1 -type f -name '*.md' -delete

escape_yaml_double_quoted() {
  printf '%s' "$1" | sed -e 's/\\/\\\\/g' -e 's/"/\\"/g'
}

extract_title() {
  local file="$1"
  local title=""

  title="$(sed -n 's/^# \{1,\}\(.*\)$/\1/p' "$file" | head -n 1 | sed 's/^[[:space:]]*//; s/[[:space:]]*$//')"
  if [[ -z "$title" ]]; then
    local base
    base="$(basename "$file" .md)"
    title="$(printf '%s' "$base" | sed 's/-/ /g')"
  fi
  printf '%s' "$title"
}

for src in "$WIKI_DIR"/*.md; do
  base="$(basename "$src")"
  if [[ "$base" == "_Sidebar.md" ]]; then
    continue
  fi

  dest="$TARGET_DIR/$base"
  first_line="$(sed -n '1p' "$src")"
  if [[ "$first_line" == "---" ]]; then
    cp "$src" "$dest"
    continue
  fi

  title="$(extract_title "$src")"
  escaped_title="$(escape_yaml_double_quoted "$title")"
  tmp="$(mktemp)"
  {
    printf '%s\n' '---'
    printf 'title: "%s"\n' "$escaped_title"
    printf '%s\n\n' '---'
    cat "$src"
  } > "$tmp"
  mv "$tmp" "$dest"
done

echo "Synced wiki markdown files to $TARGET_DIR"
