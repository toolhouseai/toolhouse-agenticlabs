import { Hono } from 'hono';
import type { Bindings } from '../types';
import {
  insertAgent,
  updateAgentStatus,
  updateAgentConfig,
  getAgentById,
  listAgents,
  deleteAgent,
} from '../db/agents';
import { parseAgentConfig } from '../ai/parser';

const agents = new Hono<{ Bindings: Bindings }>();

agents.post('/', async (c) => {
  const body = await c.req.json().catch(() => null);

  if (!body || typeof body !== 'object' || !body.name) {
    return c.json({ success: false, error: 'Request body must include a "name" field' }, 400);
  }

  const id = crypto.randomUUID();
  const rawInput = JSON.stringify(body);

  await insertAgent(c.env.DB, id, body.name, rawInput);

  const db = c.env.DB;
  const apiKey = c.env.OPENAI_API_KEY;

  c.executionCtx.waitUntil(
    (async () => {
      try {
        await updateAgentStatus(db, id, 'building');
        const config = await parseAgentConfig(apiKey, rawInput);
        await updateAgentConfig(db, id, config);
      } catch (err) {
        const message = err instanceof Error ? err.message : 'Unknown error';
        await updateAgentStatus(db, id, 'failed', message);
      }
    })(),
  );

  return c.json({ success: true, data: { id, name: body.name, status: 'queued' } }, 202);
});

agents.get('/', async (c) => {
  const status = c.req.query('status');
  const result = await listAgents(c.env.DB, status);
  return c.json({ success: true, data: result });
});

agents.get('/:id', async (c) => {
  const agent = await getAgentById(c.env.DB, c.req.param('id'));
  if (!agent) {
    return c.json({ success: false, error: 'Agent not found' }, 404);
  }
  return c.json({ success: true, data: agent });
});

agents.delete('/:id', async (c) => {
  const deleted = await deleteAgent(c.env.DB, c.req.param('id'));
  if (!deleted) {
    return c.json({ success: false, error: 'Agent not found' }, 404);
  }
  return c.body(null, 204);
});

export default agents;
