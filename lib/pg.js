const { Signer } = require("@aws-sdk/rds-signer");
const { awsCredentialsProvider } = require("@vercel/functions/oidc");
const { attachDatabasePool } = require("@vercel/functions");
const { Pool } = require("pg");
const {
  env,
  PGHOST,
  PGPORT,
  PGUSER,
  PGDATABASE,
  AWS_REGION,
  AWS_ROLE_ARN,
} = require("./env-keys");

function getPgConfig() {
  const host = env(...PGHOST);
  const port = Number(env(...PGPORT) || "5432");
  const user = env(...PGUSER);
  const database = env(...PGDATABASE) || "postgres";
  const region = env(...AWS_REGION);
  const roleArn = env(...AWS_ROLE_ARN);

  return { host, port, user, database, region, roleArn };
}

function isPgConfigured() {
  const { host, user, region, roleArn } = getPgConfig();
  return Boolean(host && user && region && roleArn);
}

let pool;

function getPool() {
  if (pool) return pool;

  const { host, port, user, database, region, roleArn } = getPgConfig();
  if (!isPgConfigured()) {
    throw new Error(
      "Missing PGHOST, PGUSER, AWS_REGION, or AWS_ROLE_ARN (or beamxweb_* / integration-prefixed equivalents)"
    );
  }

  const signer = new Signer({
    hostname: host,
    port,
    username: user,
    region,
    credentials: awsCredentialsProvider({
      roleArn,
      clientConfig: { region },
    }),
  });

  pool = new Pool({
    host,
    user,
    database,
    port,
    password: () => signer.getAuthToken(),
    ssl: { rejectUnauthorized: false },
    max: 10,
  });

  attachDatabasePool(pool);
  return pool;
}

module.exports = { getPgConfig, isPgConfigured, getPool };
