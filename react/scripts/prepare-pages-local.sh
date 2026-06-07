#!/usr/bin/env bash
set -euo pipefail

ROOT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/../.." && pwd)"
REACT_DIR="$ROOT_DIR/react"
PUBLIC_DIR="$ROOT_DIR/public"

cd "$REACT_DIR"
npm run build

rm -rf "$PUBLIC_DIR"
mkdir -p "$PUBLIC_DIR"

# React build becomes the root site, mirroring GitHub Pages workflow behavior.
cp -r "$REACT_DIR/dist/." "$PUBLIC_DIR/"

# Keep the current plain app available as a hidden fallback.
mkdir -p "$PUBLIC_DIR/plain-legacy"
cp "$ROOT_DIR"/index.html "$ROOT_DIR"/obojake.html "$ROOT_DIR"/slova-yi.html "$ROOT_DIR"/yi.html "$ROOT_DIR"/ratanie.html "$PUBLIC_DIR/plain-legacy/"
cp -r "$ROOT_DIR/css" "$ROOT_DIR/js" "$PUBLIC_DIR/plain-legacy/"

# Keep compatibility for existing bookmarks to plain *.html URLs.
cat > "$PUBLIC_DIR/yi.html" <<'EOF'
<!doctype html><html><head><meta charset="utf-8"><meta http-equiv="refresh" content="0; url=./#/yi"><script>location.replace('./#/yi');</script></head><body></body></html>
EOF

cat > "$PUBLIC_DIR/obojake.html" <<'EOF'
<!doctype html><html><head><meta charset="utf-8"><meta http-equiv="refresh" content="0; url=./#/obojake"><script>location.replace('./#/obojake');</script></head><body></body></html>
EOF

cat > "$PUBLIC_DIR/slova-yi.html" <<'EOF'
<!doctype html><html><head><meta charset="utf-8"><meta http-equiv="refresh" content="0; url=./#/slova"><script>location.replace('./#/slova');</script></head><body></body></html>
EOF

cat > "$PUBLIC_DIR/ratanie.html" <<'EOF'
<!doctype html><html><head><meta charset="utf-8"><meta http-equiv="refresh" content="0; url=./#/ratanie"><script>location.replace('./#/ratanie');</script></head><body></body></html>
EOF

printf 'Local Pages artifact prepared in %s\n' "$PUBLIC_DIR"
