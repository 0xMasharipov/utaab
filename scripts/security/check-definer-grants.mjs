#!/usr/bin/env node
/**
 * Security check: fail CI if any SECURITY DEFINER function in the public schema
 * has EXECUTE granted to PUBLIC / anon / authenticated, unless it's allowlisted.
 *
 * Env: SUPABASE_DB_URL (or standard PG* vars). Connection must allow SELECT
 * on pg_catalog + information_schema (any role works, including read-only).
 */
import { readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import pg from "pg";

const __dirname = dirname(fileURLToPath(import.meta.url));
const ALLOWLIST_PATH = join(__dirname, "allowlist.json");

const RISKY_GRANTEES = ["PUBLIC", "anon", "authenticated"];

const SQL = `
SELECT
  p.proname AS function_name,
  pg_catalog.pg_get_function_identity_arguments(p.oid) AS arg_types,
  r.grantee::text AS grantee
FROM pg_proc p
JOIN pg_namespace n ON n.oid = p.pronamespace
JOIN information_schema.routine_privileges r
  ON r.routine_schema = n.nspname
 AND r.routine_name = p.proname
 AND r.privilege_type = 'EXECUTE'
WHERE n.nspname = 'public'
  AND p.prosecdef = true
  AND r.grantee = ANY($1::text[])
ORDER BY p.proname, r.grantee;
`;

function loadAllowlist() {
  const raw = JSON.parse(readFileSync(ALLOWLIST_PATH, "utf8"));
  const set = new Set();
  for (const key of Object.keys(raw)) {
    if (key.startsWith("$")) continue;
    set.add(key.replace(/\s+/g, ""));
  }
  return set;
}

function sigOf(row) {
  return `${row.function_name}(${(row.arg_types || "").replace(/\s+/g, "")})`;
}

async function main() {
  const connectionString = process.env.SUPABASE_DB_URL || process.env.DATABASE_URL;
  if (!connectionString && !process.env.PGHOST) {
    console.error("✗ SUPABASE_DB_URL (or PG* env vars) is required.");
    process.exit(2);
  }

  const client = new pg.Client(
    connectionString
      ? { connectionString, ssl: { rejectUnauthorized: false } }
      : { ssl: { rejectUnauthorized: false } }
  );

  await client.connect();
  let rows;
  try {
    const res = await client.query(SQL, [RISKY_GRANTEES]);
    rows = res.rows;
  } finally {
    await client.end();
  }

  const allowlist = loadAllowlist();
  const violations = [];
  const allowedHits = new Set();

  for (const row of rows) {
    const sig = sigOf(row);
    if (allowlist.has(sig)) {
      allowedHits.add(sig);
      continue;
    }
    violations.push({ sig, grantee: row.grantee });
  }

  if (violations.length === 0) {
    console.log(
      `✓ Definer-grants check passed. ${rows.length} grant(s) inspected, ` +
        `${allowedHits.size}/${allowlist.size} allowlisted entries present, ` +
        `0 risky grants.`
    );
    process.exit(0);
  }

  console.error("✗ Risky EXECUTE grants on SECURITY DEFINER functions detected:\n");
  for (const v of violations) {
    console.error(`  • public.${v.sig}  →  ${v.grantee}`);
    console.error(
      `      Fix: REVOKE EXECUTE ON FUNCTION public.${v.sig} FROM ${v.grantee};`
    );
  }
  console.error(
    "\nIf one of these is intentional, add its signature to scripts/security/allowlist.json with a justification."
  );
  process.exit(1);
}

main().catch((err) => {
  console.error("✗ Definer-grants check failed to run:", err.message);
  process.exit(2);
});
