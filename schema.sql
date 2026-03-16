CREATE TABLE IF NOT EXISTS agents (
  id            TEXT PRIMARY KEY,
  name          TEXT NOT NULL,
  model         TEXT NOT NULL,
  system_prompt TEXT NOT NULL,
  tools         TEXT NOT NULL DEFAULT '[]',
  raw_input     TEXT NOT NULL,
  status        TEXT NOT NULL DEFAULT 'queued' CHECK(status IN ('queued','building','ready','failed')),
  error         TEXT,
  created_at    TEXT NOT NULL DEFAULT (datetime('now')),
  updated_at    TEXT NOT NULL DEFAULT (datetime('now'))
);
