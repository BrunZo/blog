#!/usr/bin/env bash
set -euo pipefail

# Build here, ship static HTML. The vault never leaves this machine: the box
# receives dist/, which holds published notes and nothing else.
#
#   ./deploy.sh            build, test, upload
#   ./deploy.sh --dry-run  build and test, show what rsync would send

# ── config ────────────────────────────────────────────────────────────────────
REPO_DIR="${REPO_DIR:-$HOME/code/blog}"
VAULT_PATH="${VAULT_PATH:-$HOME/notes}"
REMOTE="${REMOTE:-bziger.com}"
REMOTE_DIR="${REMOTE_DIR:-/srv/blog}"
DIST_DIR="$REPO_DIR/dist"
# ──────────────────────────────────────────────────────────────────────────────

DRY_RUN=""
[ "${1:-}" = "--dry-run" ] && DRY_RUN="--dry-run"

cd "$REPO_DIR"

echo "==> build"
python -m core.build --out "$DIST_DIR" --vault "$VAULT_PATH"

# The publish gate has to hold both ways: no page may link somewhere that does
# not exist, and no page may reveal a note that is not published.
echo "==> check the publish gate"
python -m pytest tests/ --site "$DIST_DIR" --vault "$VAULT_PATH" -q

echo "==> upload to $REMOTE:$REMOTE_DIR"
rsync -az --delete $DRY_RUN --itemize-changes "$DIST_DIR/" "$REMOTE:$REMOTE_DIR/"

[ -n "$DRY_RUN" ] && echo "(dry run — nothing uploaded)"
echo "done"
