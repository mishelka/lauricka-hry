#!/usr/bin/env bash
set -euo pipefail

ROOT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/../.." && pwd)"
REACT_DIR="$ROOT_DIR/react"
PUBLIC_DIR="$ROOT_DIR/public"

cd "$REACT_DIR"
npm run build

rm -rf "$PUBLIC_DIR"
mkdir -p "$PUBLIC_DIR"
mkdir -p "$PUBLIC_DIR/react"

# Publish built React app under /react.
cp -r "$REACT_DIR/dist/." "$PUBLIC_DIR/react/"

# Root entry points redirect to React routes.
cp "$ROOT_DIR"/index.html "$ROOT_DIR"/obojake.html "$ROOT_DIR"/slova-yi.html "$ROOT_DIR"/yi.html "$ROOT_DIR"/ratanie.html "$PUBLIC_DIR/"

# SPA fallback for BrowserRouter deep links.
cat > "$PUBLIC_DIR/404.html" <<'EOF'
<!doctype html>
<html>
<head>
  <meta charset="utf-8">
  <title>Redirecting...</title>
  <script>
    (function () {
      var path = window.location.pathname;
      var search = window.location.search ? window.location.search.slice(1) : '';
      var hash = window.location.hash ? window.location.hash.slice(1) : '';
      var target = '/lauricka-hry/react/?p=' + encodeURIComponent(path);
      if (search) target += '&q=' + encodeURIComponent(search);
      if (hash) target += '&h=' + encodeURIComponent(hash);
      window.location.replace(target);
    })();
  </script>
</head>
<body></body>
</html>
EOF

printf 'Local Pages artifact prepared in %s\n' "$PUBLIC_DIR"
