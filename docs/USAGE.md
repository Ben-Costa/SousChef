# Recipe Copilot Usage Guide

This document explains how to set up the monorepo, configure keys, run the frontend and backend, test the project, and work in the codebase without fighting the current structure.

## What This Repo Is

Recipe Copilot is a pnpm monorepo with:

- a React frontend in `apps/web`
- an Express API scaffold in `apps/api`
- shared schemas, AI helpers, voice helpers, and utilities in `packages/*`
- CI and deploy workflows in `.github/workflows`

The current scaffold is intentionally lightweight. The frontend renders a basic home page, and the backend exposes placeholder endpoints for auth, recipes, pantry, ingredients, and copilot chat.

## Prerequisites

Install these before working in the repo:

1. Node.js 20.11 or newer
2. Corepack enabled so pnpm can be used reliably

Recommended setup:

```bash
node -v
corepack enable
corepack pnpm --version
```

If `pnpm` is not installed globally, use `corepack pnpm ...` from this repo. That is the safest option in this workspace.

## First-Time Setup

From the repo root:

```bash
cp .env.example .env
cp apps/web/.env.example apps/web/.env
cp apps/api/.env.example apps/api/.env
corepack pnpm install
```

After install, verify the scaffold:

```bash
corepack pnpm lint
corepack pnpm test
corepack pnpm typecheck
corepack pnpm build
```

## Environment Variables And Keys

There are three env scopes in the repo.

### Root env

File: `.env.example`

Use this for shared credentials used by multiple apps or deployment workflows.

Variables:

- `OPENAI_API_KEY`: OpenAI API key for server-side AI integrations
- `SUPABASE_URL`: Supabase project URL
- `SUPABASE_ANON_KEY`: Supabase public anon key, mostly for frontend usage
- `SUPABASE_SERVICE_ROLE_KEY`: Supabase service role key, backend only
- `VERCEL_ORG_ID`: Vercel organization ID used by the deploy workflow
- `VERCEL_PROJECT_ID`: Vercel project ID used by the deploy workflow

### Frontend env

File: `apps/web/.env.example`

Variables:

- `VITE_API_BASE_URL`: Base URL for the backend API, defaults to `http://localhost:4000`
- `VITE_SUPABASE_URL`: Supabase URL exposed to the browser
- `VITE_SUPABASE_ANON_KEY`: Supabase anon key exposed to the browser

Anything prefixed with `VITE_` is bundled into the frontend and is not secret.

### Backend env

File: `apps/api/.env.example`

Variables:

- `API_PORT`: Local API port, default is `4000`
- `OPENAI_API_KEY`: Server-side OpenAI key
- `SUPABASE_URL`: Supabase project URL
- `SUPABASE_SERVICE_ROLE_KEY`: Supabase service role key

Backend secrets should stay in `apps/api/.env` or your deployment environment. Do not move service-role keys into frontend env files.

## Local Development

### Run the frontend

From the repo root:

```bash
corepack pnpm dev:web
```

Vite starts the frontend on port `5173` by default.

Current frontend behavior:

- renders a single home page
- uses React Router for routing
- uses Zustand for basic app state
- includes browser speech recognition wiring through `react-speech-recognition`

### Run the backend

From the repo root:

```bash
corepack pnpm dev:api
```

The API runs on port `4000` by default.

Current API endpoints:

- `GET /health`: health check
- `GET /auth/session`: returns a placeholder auth payload
- `GET /ingredients`: returns an empty ingredient list
- `GET /pantry`: returns an empty pantry list
- `GET /recipes`: returns an empty recipe list
- `POST /copilot/chat`: returns a placeholder copilot response

### Run both together

From the repo root:

```bash
corepack pnpm dev
```

That starts both workspace apps in parallel.

## Testing And Validation

### Root commands

Run these from the repo root:

```bash
corepack pnpm lint
corepack pnpm test
corepack pnpm typecheck
corepack pnpm build
```

What they do:

- `lint`: runs ESLint in each workspace package
- `test`: runs package-level Jest commands
- `typecheck`: runs TypeScript validation without emitting output
- `build`: compiles packages and builds the web app with Vite

### Frontend testing

Frontend tests are configured with:

- Jest
- `ts-jest`
- React Testing Library
- `@testing-library/jest-dom`
- MSW for request mocking when tests are added

Current command:

```bash
corepack pnpm --filter @recipe-copilot/web test
```

### Backend testing

Backend tests are configured with:

- Jest
- `ts-jest`
- `supertest`

Current command:

```bash
corepack pnpm --filter @recipe-copilot/api test
```

### End-to-end and integration test folders

The repo already includes:

- `tests/e2e`
- `tests/integration`

These are placeholders right now. Use them when flows span more than one package or require browser-level automation.

## Development Best Practices

### Source of truth

Use the TypeScript files as the source of truth.

- edit `.ts` and `.tsx` files for application logic
- keep shared data contracts in `packages/shared-types`
- avoid duplicating types separately in frontend and backend

If you see `.js` mirrors in frontend source folders, treat the TypeScript files as canonical unless you intentionally convert that area of the app.

### Shared contracts first

When adding a new domain feature:

1. define or update the schema in `packages/shared-types`
2. use that schema in the backend route or service
3. consume the same type or schema in the frontend

This keeps request and response shapes from drifting.

### Keep secrets in the backend

- `OPENAI_API_KEY` and `SUPABASE_SERVICE_ROLE_KEY` should stay server-side
- only `VITE_*` variables should be exposed to the browser
- never commit populated `.env` files

### Add features by vertical slice

Prefer building one complete feature at a time:

1. schema in `packages/shared-types`
2. backend route in `apps/api/functions/*`
3. frontend API client in `apps/web/src/services/api`
4. UI state in `apps/web/src/state` or `apps/web/src/features/*`
5. tests for the changed slice

### Validate before pushing

Before opening a PR or merging:

```bash
corepack pnpm lint
corepack pnpm test
corepack pnpm typecheck
corepack pnpm build
```

Those same checks are aligned with CI.

### Keep packages focused

- put AI-specific prompt and client logic in `packages/ai`
- put speech or transcription-specific utilities in `packages/voice`
- put logging, error helpers, and generic fetch utilities in `packages/utils`
- keep app-specific UI logic inside `apps/web`
- keep transport and route logic inside `apps/api`

## CI And Deploy

### CI

File: `.github/workflows/ci.yml`

CI runs on pushes to `main` and `feature/**`, and on pull requests. It performs:

1. install
2. lint
3. test
4. typecheck
5. build

### Deploy

File: `.github/workflows/deploy.yml`

Deploy is scaffolded for:

- Vercel web deploys
- Supabase function deploys

Required GitHub secrets:

- `VERCEL_TOKEN`
- `VERCEL_ORG_ID`
- `VERCEL_PROJECT_ID`
- `SUPABASE_ACCESS_TOKEN`
- `SUPABASE_PROJECT_REF`

If those are missing, the workflow logs a skip message and exits cleanly.

## File And Folder Map

This section explains what the current scaffold files contain. Placeholder `.gitkeep` files are omitted.

### Root files

- `package.json`: workspace-wide scripts for dev, lint, test, typecheck, build, and formatting
- `pnpm-workspace.yaml`: declares `apps/*` and `packages/*` as workspace members
- `tsconfig.base.json`: shared TypeScript defaults inherited by all packages
- `eslint.config.mjs`: shared ESLint configuration for TS, browser, node, and Jest contexts
- `.editorconfig`: editor-level whitespace and newline rules
- `.gitignore`: ignores build output, env files, node modules, and local temp files
- `.env.example`: root-level shared env template
- `pnpm-lock.yaml`: resolved dependency lockfile for the monorepo
- `README.md`: short project overview and pointer to this document

### GitHub workflow files

- `.github/workflows/ci.yml`: CI pipeline for install, lint, test, typecheck, and build
- `.github/workflows/deploy.yml`: deploy scaffold for Vercel and Supabase-based releases

### Frontend app files

Location: `apps/web`

- `package.json`: frontend dependencies and scripts
- `tsconfig.json`: frontend TypeScript configuration
- `vite.config.ts`: Vite dev/build config
- `jest.config.ts`: Jest config for frontend tests
- `index.html`: Vite HTML entry document
- `.env.example`: frontend env template

Frontend source files:

- `src/index.tsx`: React DOM entry point and router bootstrap
- `src/App.tsx`: route table, currently maps `/` to `HomePage`
- `src/pages/HomePage.tsx`: current landing page content
- `src/state/app-store.ts`: Zustand store for active assistant mode
- `src/services/api/client.ts`: thin fetch wrapper for backend requests
- `src/services/voice/browser-voice.ts`: browser speech recognition wrapper
- `src/test/setup.ts`: Jest test setup for browser assertions
- `src/types/react-speech-recognition.d.ts`: local type declarations for the speech recognition dependency

Frontend scaffold folders:

- `src/components`: reusable UI components
- `src/hooks`: custom React hooks
- `src/features/auth`: auth-specific frontend logic
- `src/features/recipes`: recipe feature UI and state
- `src/features/pantry`: pantry feature UI and state
- `src/features/copilot`: copilot-specific UI and flows
- `src/utils`: frontend-only helpers
- `public`: static assets served directly by Vite

### Backend app files

Location: `apps/api`

- `package.json`: backend dependencies and scripts
- `tsconfig.json`: backend TypeScript configuration
- `jest.config.ts`: Jest config for API tests
- `index.ts`: Express app setup, route mounting, health route, and server start
- `.env.example`: backend env template
- `middleware/error-handler.ts`: shared Express error response middleware
- `utils/env.ts`: Zod-based backend env parsing
- `supabase/types.ts`: placeholder location for generated Supabase types

Backend route files:

- `functions/auth/index.ts`: auth router, currently exposes `GET /auth/session`
- `functions/copilot/index.ts`: copilot router, currently exposes `POST /copilot/chat`
- `functions/ingredients/index.ts`: ingredient router, currently exposes `GET /ingredients`
- `functions/pantry/index.ts`: pantry router, currently exposes `GET /pantry`
- `functions/recipes/index.ts`: recipe router, currently exposes `GET /recipes`

Backend scaffold folders:

- `supabase/migrations`: SQL migrations or generated migration history

### Shared package files

#### `packages/shared-types`

- `package.json`: shared-types package definition and scripts
- `tsconfig.json`: package build config
- `src/ingredient.ts`: Zod schema and TS type for ingredients
- `src/pantry.ts`: Zod schema and TS type for pantry items
- `src/recipe.ts`: Zod schema and TS type for recipes
- `src/user.ts`: Zod schema and TS type for user profiles
- `src/index.ts`: barrel export for all shared schemas and types

#### `packages/ai`

- `package.json`: AI package definition and scripts
- `tsconfig.json`: package build config
- `src/clients/openai-client.ts`: OpenAI client factory using `OPENAI_API_KEY`
- `src/prompts/cooking-assistant.ts`: base cooking assistant system prompt
- `src/tools/recipe-planner.ts`: helper for summarizing a recipe plan
- `src/index.ts`: barrel export for AI helpers

#### `packages/voice`

- `package.json`: voice package definition and scripts
- `tsconfig.json`: package build config
- `src/recognition.ts`: transcript normalization helpers and recognition result type
- `src/transcription.ts`: transcription chunk helpers
- `src/pipeline.ts`: voice command assembly pipeline
- `src/index.ts`: barrel export for voice utilities

#### `packages/utils`

- `package.json`: utilities package definition and scripts
- `tsconfig.json`: package build config
- `src/logger.ts`: shared logger wrapper
- `src/errors.ts`: shared `AppError` type
- `src/fetch.ts`: generic JSON fetch helper
- `src/index.ts`: barrel export for utils

### Test folders

- `tests/e2e/README.md`: placeholder for browser or full-stack E2E coverage
- `tests/integration/README.md`: placeholder for integration coverage across services or packages

## Recommended Next Steps

If you are extending the scaffold, the most sensible order is:

1. wire Supabase client setup in frontend and backend
2. replace placeholder API responses with validated request and response schemas
3. build one full vertical slice such as pantry or recipes
4. add real frontend and API tests for that slice