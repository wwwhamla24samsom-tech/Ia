# AGENTS.md — Base44 dev environment

## Stack
- Vite 6 + React 19 + TypeScript frontend (single-page, Arabic RTL).
- Package manager: npm (package-lock.json is canonical; bun.lock also present but unused by compose).
- No backend/database — all logic is client-side. Gemini AI calls go directly from the browser via `@google/genai`.

## Running
- `docker compose -f docker-compose.base44.yml up -d` starts the Vite dev server on port 3000.
- Source is bind-mounted; edits hot-reload without rebuild.
- Dependencies install on container startup (`npm install`) into a named volume (`node_modules`).

## Secrets
- `GEMINI_API_KEY` is optional for boot. The app reads it via `vite.config.ts` `define` (`process.env.API_KEY` / `process.env.GEMINI_API_KEY`). A committed `.env.local` already provides a value. Without a valid key the UI loads but Gemini-powered features fail at runtime.
- To enable AI features, set `GEMINI_API_KEY` in the Base44 secrets dashboard (aistudio.google.com/apikey).

## Notes
- Vite is configured with `host: 0.0.0.0` and `cors: true`; `__VITE_ADDITIONAL_SERVER_ALLOWED_HOSTS` is passed for preview host allowlisting.
- No tests configured (`lint` runs `tsc --noEmit`).
