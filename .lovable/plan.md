## Problem

The `Security checks / SECURITY DEFINER grants` job fails at the **Install pg client** step (~16s). The current step runs:

```yaml
- name: Install pg client
  run: npm install --no-save pg@8
```

Even with `--no-save`, npm still resolves and installs the project's entire `package.json` dependency tree. This repo is managed with Bun (no `package-lock.json`, peer-dep conflicts), so the npm install fails before `pg` is available.

## Fix

Edit `.github/workflows/security-checks.yml` to install `pg` in an isolated location that ignores the project's `package.json`, then point Node at it when running the check.

Replace the two steps with:

```yaml
- name: Install pg client (isolated)
  run: |
    mkdir -p "$RUNNER_TEMP/pgdeps"
    cd "$RUNNER_TEMP/pgdeps"
    npm init -y >/dev/null
    npm install --no-audit --no-fund --silent pg@8

- name: Check definer grants
  env:
    SUPABASE_DB_URL: ${{ secrets.SUPABASE_DB_URL }}
    NODE_PATH: ${{ runner.temp }}/pgdeps/node_modules
  run: node scripts/security/check-definer-grants.mjs
```

This avoids touching the repo's `package.json` entirely and makes `import pg from "pg"` resolve via `NODE_PATH`.

## Out of scope

- No changes to `scripts/security/check-definer-grants.mjs` or `allowlist.json`.
- No changes to the previously-planned voucher retry work.

## Files

- `.github/workflows/security-checks.yml`
