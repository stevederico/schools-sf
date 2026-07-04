# AGENTS.md

Project-specific guidance for AI agents. Global coding standards live in `~/.agents/AGENTS.md` — this file covers only what's unique to this repo.

## What This Is

Public directory of San Francisco preschools and K-12 schools. No login, no payments — `noLogin: true` in `src/constants.json`. Schools data is served read-only from a shipped SQLite file; the optional auth/user DB is a separate SQLite file that only matters if you flip on login.

## Development Commands

```bash
npm run install-all    # Install root + backend workspace
npm run start          # Frontend (5173) + backend (8000)
npm run front          # Frontend only
npm run server         # Backend only
npm run build          # Production build into ./dist (typecheck-gated)
npm run typecheck      # tsc --noEmit for root + backend (no build-step typecheck)
npm run test           # typecheck, then backend tests (node --test, backend workspace)
npm run test:watch     # backend tests in watch mode
```

Kill ports 5173 / 8000 before starting if they're already bound.

## Architecture

### Frontend
- **Entry:** `src/main.tsx` — uses `createSkateboardApp` with a single `home` route.
- **Main view:** `src/components/DirectoryView.tsx` — unified list+map view, state deep-linked via URL params.
- **Map:** `src/components/NeighborhoodMap.tsx` — react-leaflet, SVG pin icons, `FitBounds` helper auto-zooms to result set.
- **Detail sheet:** `src/components/SchoolDetailSheet.tsx` — shadcn Sheet, includes "View on map" deep link.
- **Filter bar:** `src/components/FilterBar.tsx` — neighborhood, program type, sector, favorites, sort.
- **Data hooks:** `src/components/useSchools.ts` (fetch + filter), `src/components/useFavorites.ts` (localStorage).
- **Tuition parser:** `src/components/tuitionSort.ts` — handles `$X–$Y/year`, `$X/month`, public schools, and unknowns. Tested in `tuitionSort.test.ts`.

### URL State
`DirectoryView` reads and writes these query params:
- `view=list` — switch to list view (map is the default, no param needed)
- `favorites=1` — favorites-only filter
- `sort=price-asc|price-desc` — tuition sort
- `highlight=<id>&type=<preschool|upperschool>` — marker highlight from detail sheet's "View on map"

### Backend
- **Server:** `backend/server.ts` — Hono + `@hono/node-server`, serves the built frontend from `../dist`.
- **Schools DB:** `backend/databases/preschools.db` — opened read-only at startup via native `node:sqlite`. Two tables: `preschools` (65 rows) and `upperschools` (42 rows).
- **Auth DB:** `backend/databases/PreschoolTmp.db` — used only if auth flows are exercised. Created on demand via the skateboard adapter manager.

### Schools API
- `GET /api/schools` — filters: `type`, `neighborhood`, `program_type`, `q`. Returns union of both tables with a `school_type` discriminator.
- `GET /api/neighborhoods` — distinct neighborhoods across both tables.
- `GET /api/program-types` — distinct program types across both tables.

See `docs/API.md` for request/response shapes and `docs/SCHEMA.md` for column definitions.

### Data Flow
```
preschools.db  →  /api/schools  →  useSchools()  →  DirectoryView
                                                    ├── SchoolCard grid
                                                    ├── NeighborhoodMap (lazy)
                                                    └── SchoolDetailSheet
```

## Dockerfile Notes

Backend is an npm workspace. `npm install` at root **hoists all dependencies to `/app/node_modules`** — `backend/node_modules` does not exist. The Dockerfile must copy `/app/node_modules` (not `/app/backend/node_modules`) into the runtime stage. This tripped up the Railway deploy in 0.10.1.

## Deployment

Deployed to Railway project `bixby`, service `schools`:
- **URL:** https://schools-production-782b.up.railway.app
- **Volume:** `schools-volume` mounted at `/app/databases` so the auth/user DB survives redeploys. The read-only schools DB lives at `/app/backend/databases/preschools.db` inside the image — it doesn't need persistence.
- **Env vars not yet set:** `JWT_SECRET`, `STRIPE_KEY`, `STRIPE_ENDPOINT_SECRET`, `CORS_ORIGINS`, `FRONTEND_URL`. Auth and payments will error until these exist. The schools browse experience works without them.
- **Deploy command:** `railway up` (run from repo root while linked to the `schools` service). Never use git-based deploy.

## Tuition Data

Tuition values in `preschools.db` are free-text (e.g., `$16,350-$22,000/year`, `Not publicly available`, `Public (SFUSD)`). The parser in `tuitionSort.ts` extracts a numeric sort key; unknown/unpriced values intentionally sort **above** the highest priced row so users see them first.

OCR was used for Stella Maris, Little School, Little Bee, and similar image-only tuition charts. Keep the `research/` directory when updating tuition — it has the source snapshots.

## Reference Docs

| Doc | Purpose |
|---|---|
| `docs/ARCHITECTURE.md` | Application shell pattern, production config |
| `docs/API.md` | REST endpoint reference |
| `docs/SCHEMA.md` | SQLite column definitions |
| `docs/DEPLOY.md` | Host-agnostic deploy guide |
| `docs/MIGRATION.md` | Upgrading between skateboard versions |

## Updating From Skateboard Boilerplate

`package.json` has a `skateboardVersion` field (currently `3.14.0`) indicating which boilerplate release was used. Reference repo: https://github.com/stevederico/skateboard. Run `node scripts/update-skateboard.js` to 3-way merge template changes onto local edits, then diff and port carefully — **never** auto-update `constants.json`, `src/components/*`, or `backend/config.json`. Always consult before applying boilerplate changes.

## TypeScript Standards

### Style

- TypeScript everywhere — `.ts` / `.tsx` files, `strict` mode always on
- `@types` packages are dev-only dependencies (`@types/node`, `@types/react`, `@types/react-dom`)
- No build-step typechecking: `npm run typecheck` runs `tsc --noEmit` for both root and backend; it gates `build`, `prod`, and `test`
- Always use ES modules — never use `require()`

### TypeScript Anti-Patterns (prohibited)

All of these silence the compiler instead of proving correctness:

- Never use `any` — use `unknown` and narrow with type guards
- Never use `as` casts to silence errors (especially `as unknown as X`) — prove the type instead
- Never use `!` non-null assertions — handle the null/undefined case
- Never use `@ts-ignore` — if truly unavoidable, use `@ts-expect-error` with a reason comment (it fails when the error goes away)
- Never use `@ts-nocheck` — it disables type checking for the entire file; stronger than `@ts-ignore` and equally prohibited
- Never disable or loosen `strict` in tsconfig
- Never use loose built-in types (`Function`, `object`, `{}`) — write precise signatures and shapes
- Never cast unvalidated data at boundaries — no `JSON.parse(x) as User` without a runtime check
