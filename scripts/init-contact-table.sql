-- Run once against your Aurora/RDS Postgres (e.g. psql or RDS Query Editor).
CREATE TABLE IF NOT EXISTS contact_submissions (
  id TEXT PRIMARY KEY,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  source TEXT NOT NULL DEFAULT 'webxbeam.com',
  first_name TEXT NOT NULL,
  last_name TEXT,
  email TEXT NOT NULL,
  phone TEXT,
  business TEXT,
  industry TEXT,
  services JSONB NOT NULL DEFAULT '[]'::jsonb,
  budget TEXT,
  message TEXT
);

CREATE INDEX IF NOT EXISTS contact_submissions_created_at_idx
  ON contact_submissions (created_at DESC);
