/**
 * Creates contact_submissions using the same IAM + OIDC setup as production.
 * Prerequisites: vercel link + vercel env pull .env.local (and AWS creds for OIDC locally).
 */
const fs = require("fs");
const path = require("path");

function loadEnvLocal() {
  const file = path.join(__dirname, "..", ".env.local");
  if (!fs.existsSync(file)) return;
  for (const line of fs.readFileSync(file, "utf8").split(/\r?\n/)) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith("#")) continue;
    const eq = trimmed.indexOf("=");
    if (eq === -1) continue;
    const key = trimmed.slice(0, eq).trim();
    let value = trimmed.slice(eq + 1).trim();
    if (
      (value.startsWith('"') && value.endsWith('"')) ||
      (value.startsWith("'") && value.endsWith("'"))
    ) {
      value = value.slice(1, -1);
    }
    if (!process.env[key]) process.env[key] = value;
  }
}

async function main() {
  loadEnvLocal();

  const { isPgConfigured, getPool } = require("../lib/pg");
  if (!isPgConfigured()) {
    console.error(
      "Postgres env not found. Run: vercel link  then  vercel env pull .env.local"
    );
    process.exit(1);
  }

  const sqlPath = path.join(__dirname, "init-contact-table.sql");
  const sql = fs.readFileSync(sqlPath, "utf8");

  const pool = getPool();
  await pool.query(sql);
  await pool.end();

  console.log("OK: contact_submissions table is ready.");
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
