import { Hono } from 'hono';
import type { Bindings } from './types';
import agents from './routes/agents';

const app = new Hono<{ Bindings: Bindings }>();

app.route('/agents', agents);

export default app;
