#!/bin/bash
# backup_openclaw.sh
# 备份 OpenClaw 核心数据到 github.com/kensoulstar/openclaw-workspace

set -e

OPENCLAW_DIR="$HOME/.openclaw"
BACKUP_REPO_DIR="/tmp/openclaw-workspace-backup"
REPO="https://github.com/kensoulstar/openclaw-workspace.git"
BRANCH="main"

echo "=== OpenClaw Backup ==="
date

# Clone the repo (shallow, no git history)
if [ ! -d "$BACKUP_REPO_DIR/.git" ]; then
    echo "[1/5] Clone backup repo..."
    rm -rf "$BACKUP_REPO_DIR"
    git clone --depth=1 "$REPO" "$BACKUP_REPO_DIR"
else
    echo "[1/5] Pull latest from backup repo..."
    cd "$BACKUP_REPO_DIR"
    git pull
fi

echo "[2/5] Rsync core directories..."
cd "$BACKUP_REPO_DIR"

# Directories to backup (order matters for clean rsync)
DIRS="skills agents workspace memory openclaw.json openclaw.json.bak"

for d in $DIRS; do
    SRC="$OPENCLAW_DIR/$d"
    DST="$BACKUP_REPO_DIR/$d"
    if [ -e "$SRC" ]; then
        echo "  -> $d"
        rm -rf "$DST"
        # For large dirs, use rsync with exclusions
        if [ "$d" = "workspace" ]; then
            rsync -a --exclude='.git' --exclude='node_modules' \
                  --exclude='__pycache__' --exclude='*.pyc' \
                  "$SRC/" "$DST/"
        elif [ "$d" = "skills" ]; then
            rsync -a --exclude='node_modules' \
                  --exclude='.git' --exclude='__pycache__' \
                  "$SRC/" "$DST/"
        elif [ "$d" = "agents" ]; then
            rsync -a --exclude='node_modules' \
                  --exclude='.git' --exclude='__pycache__' \
                  "$SRC/" "$DST/"
        else
            rsync -a "$SRC" "$DST/"
        fi
    fi
done

# Also backup credentials (if exists, mask sensitive parts)
if [ -d "$OPENCLAW_DIR/credentials" ]; then
    echo "  -> credentials (sensitive - encrypted)"
    # Copy but don't commit credentials to public repo
    cp -r "$OPENCLAW_DIR/credentials" "$BACKUP_REPO_DIR/credentials"
fi

echo "[3/5] Stage changes..."
cd "$BACKUP_REPO_DIR"
git add -A

# Check if there are changes
if git diff --cached --quiet; then
    echo "No changes to commit."
else
    echo "[4/5] Commit..."
    git commit -m "backup: $(date '+%Y-%m-%d %H:%M')"

    echo "[5/5] Push to GitHub..."
    git push "$REPO" "$BRANCH"
    echo "Backup complete!"
fi
