/** Env keys checked in order (standard, then Vercel integration prefixes). */
const AWS_REGION = ["AWS_REGION", "beamxweb_AWS_REGION", "SPACEKAYSONKELLY_AWS_REGION"];
const AWS_ROLE_ARN = [
  "AWS_ROLE_ARN",
  "beamxweb_AWS_ROLE_ARN",
  "SPACEKAYSONKELLY_AWS_ROLE_ARN",
];
const PGHOST = ["PGHOST", "beamxweb_PGHOST", "SPACEKAYSONKELLY_PGHOST"];
const PGPORT = ["PGPORT", "beamxweb_PGPORT", "SPACEKAYSONKELLY_PGPORT"];
const PGUSER = ["PGUSER", "beamxweb_PGUSER", "SPACEKAYSONKELLY_PGUSER"];
const PGDATABASE = [
  "PGDATABASE",
  "beamxweb_PGDATABASE",
  "SPACEKAYSONKELLY_PGDATABASE",
];

function env(...keys) {
  for (const key of keys) {
    if (process.env[key]) return process.env[key];
  }
  return undefined;
}

module.exports = {
  AWS_REGION,
  AWS_ROLE_ARN,
  PGHOST,
  PGPORT,
  PGUSER,
  PGDATABASE,
  env,
};
