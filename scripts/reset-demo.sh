#!/usr/bin/env bash
set -euo pipefail

# Reset git to demo-base tag and wipe local DB (Prisma migrate reset).
# Run from repo root with DATABASE_URL set.

ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
cd "$ROOT"

TAG="${DEMO_BASE_TAG:-demo-base}"

echo "==> Checking out main and resetting to tag: $TAG"
git checkout main
git reset --hard "$TAG"
git clean -fd

echo "==> Prisma migrate reset (drops data, reapplies migrations)"
npx prisma migrate reset --force

echo "==> Optional: delete other local feature branches (commented out)"
# git branch | grep -v main | xargs git branch -D

echo "Done."
