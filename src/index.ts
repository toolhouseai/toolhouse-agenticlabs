import { Hono } from "hono";
import { bearerAuth } from "hono/bearer-auth";
import type { Bindings } from "./types";
import agents from "./routes/agents";

const VALID_API_KEYS = [
  "th-09a82edf29b147111b492baf192f47bb",
  "th-09a82edf29b147111b492baf192f47bc",
];

const app = new Hono<{ Bindings: Bindings }>();

app.use(
  "/*",
  bearerAuth({ verifyToken: (token) => VALID_API_KEYS.includes(token) }),
);

app.route("/agents", agents);

export default app;
