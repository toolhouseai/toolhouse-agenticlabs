# Toolhouse AgenticLabs

An AI agent factory built on Cloudflare Workers. Send freeform JSON describing what kind of AI agent you want — the system uses OpenAI to parse it into a structured agent config (model, system prompt, tools), then stores and tracks the agent.

## Tech Stack

- **Hono** — web framework
- **Cloudflare D1** — SQLite database
- **OpenAI Responses API** — parses freeform input into structured agent configs (gpt-5 + structured outputs)
- **TypeScript**

## Project Structure

```
src/
├── index.ts              # Hono app entry point
├── types.ts              # Shared types
├── routes/
│   └── agents.ts         # Agent CRUD handlers
├── db/
│   └── agents.ts         # D1 query functions
└── ai/
    └── parser.ts         # OpenAI-powered JSON → agent config parser
```

## Setup

### Prerequisites

- [Node.js](https://nodejs.org/) (v18+)
- A [Cloudflare account](https://dash.cloudflare.com/sign-up)
- An [OpenAI API key](https://platform.openai.com/api-keys)

### Install dependencies

```bash
npm install
```

### Create the D1 database

```bash
wrangler d1 create agenticlabs-db
```

This outputs a `database_id`. Copy it and update `wrangler.toml`:

```toml
[[d1_databases]]
binding = "DB"
database_name = "agenticlabs-db"
database_id = "your-database-id-here"
```

### Set the OpenAI API key

```bash
wrangler secret put OPENAI_API_KEY
```

You'll be prompted to enter the key.

### Apply the database schema

Local:

```bash
npm run db:migrate:local
```

Remote (production):

```bash
npm run db:migrate:remote
```

## Local Development

```bash
npm run dev
```

This starts a local server at `http://localhost:8787` with a local D1 database.

## Deploy to Production

```bash
npm run deploy
```

This deploys the Worker to Cloudflare. Make sure you've:

1. Created the D1 database and updated the `database_id` in `wrangler.toml`
2. Set the `OPENAI_API_KEY` secret via `wrangler secret put`
3. Applied the schema to the remote database via `npm run db:migrate:remote`

## API

All responses use the envelope: `{ success: true, data: ... }` or `{ success: false, error: "..." }`

### POST /agents

Send freeform JSON describing your agent. Must include a `name` field.

```bash
curl -X POST http://localhost:8787/agents \
  -H 'Content-Type: application/json' \
  -d '{
    "name": "my-helper",
    "purpose": "help users write Python code",
    "personality": "friendly and patient"
  }'
```

Returns `201` with the created agent (status `ready`) or `500` if parsing fails (status `failed`).

### GET /agents

List all agents. Optionally filter by status.

```bash
curl http://localhost:8787/agents
curl http://localhost:8787/agents?status=ready
```

### GET /agents/:id

Get a single agent by ID.

```bash
curl http://localhost:8787/agents/:id
```

### DELETE /agents/:id

Delete an agent. Returns `204` on success, `404` if not found.

```bash
curl -X DELETE http://localhost:8787/agents/:id
```

## License

[MIT](LICENSE)
