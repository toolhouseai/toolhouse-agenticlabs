# Toolhouse AgenticLabs

An AI agent factory that receives inbound requests to build AI agents, tracks their status, and assembles them dynamically. Built on Cloudflare with a database backend.

## Features

- Accepts inbound requests to create AI agents
- Tracks agent build status and lifecycle
- Database-backed persistence on Cloudflare

## Tech Stack

- **Runtime**: Cloudflare Workers
- **Language**: TypeScript
- **Database**: Cloudflare D1 / KV

## Installation

```bash
# Clone the repository
git clone https://github.com/orliesaurus/toolhouse-agenticlabs.git
cd toolhouse-agenticlabs

# Install dependencies
npm install
```

## Usage

```bash
# Run locally
npm run dev

# Deploy to Cloudflare
npm run deploy
```

## License

[MIT](LICENSE)
