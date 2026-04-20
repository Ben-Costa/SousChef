# Recipe Copilot

Monorepo scaffold for a cooking assistant with a React frontend, a Node-based API layer, and shared packages for schemas, AI, voice, and utilities.

## Quick start

1. `cp .env.example .env`
2. `cp apps/web/.env.example apps/web/.env`
3. `cp apps/api/.env.example apps/api/.env`
4. `pnpm install`
5. `pnpm dev:web`
6. `pnpm dev:api`

## Workspace layout

- `apps/web`: Vite + React + Jest frontend
- `apps/api`: Express-based local API scaffold with serverless-style route modules
- `packages/shared-types`: Shared Zod schemas and inferred types
- `packages/ai`: OpenAI client wrappers and prompt helpers
- `packages/voice`: Voice recognition and transcription helpers
- `packages/utils`: Shared logging, fetch, and error utilities

## Documentation

- Full setup and usage guide: [docs/USAGE.md](docs/USAGE.md)