import type { Agent, AgentStatus, ParsedAgentConfig } from '../types';

export async function insertAgent(
  db: D1Database,
  id: string,
  name: string,
  rawInput: string,
): Promise<void> {
  await db
    .prepare(
      `INSERT INTO agents (id, name, model, system_prompt, tools, raw_input, status)
       VALUES (?, ?, '', '', '[]', ?, 'queued')`,
    )
    .bind(id, name, rawInput)
    .run();
}

export async function updateAgentStatus(
  db: D1Database,
  id: string,
  status: AgentStatus,
  error?: string,
): Promise<void> {
  await db
    .prepare(
      `UPDATE agents SET status = ?, error = ?, updated_at = datetime('now') WHERE id = ?`,
    )
    .bind(status, error ?? null, id)
    .run();
}

export async function updateAgentConfig(
  db: D1Database,
  id: string,
  config: ParsedAgentConfig,
): Promise<void> {
  await db
    .prepare(
      `UPDATE agents
       SET model = ?, system_prompt = ?, tools = ?, status = 'ready', updated_at = datetime('now')
       WHERE id = ?`,
    )
    .bind(config.model, config.system_prompt, JSON.stringify(config.tools), id)
    .run();
}

export async function getAgentById(
  db: D1Database,
  id: string,
): Promise<Agent | null> {
  return db
    .prepare('SELECT * FROM agents WHERE id = ?')
    .bind(id)
    .first<Agent>();
}

export async function listAgents(
  db: D1Database,
  status?: string,
): Promise<Agent[]> {
  if (status) {
    const result = await db
      .prepare('SELECT * FROM agents WHERE status = ? ORDER BY created_at DESC')
      .bind(status)
      .all<Agent>();
    return result.results;
  }
  const result = await db
    .prepare('SELECT * FROM agents ORDER BY created_at DESC')
    .all<Agent>();
  return result.results;
}

export async function deleteAgent(
  db: D1Database,
  id: string,
): Promise<boolean> {
  const result = await db
    .prepare('DELETE FROM agents WHERE id = ?')
    .bind(id)
    .run();
  return result.meta.changes > 0;
}
