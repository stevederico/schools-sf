# AGENTS.md

Project-specific guidance for AI agents. Global coding standards live in `~/.agents/AGENTS.md` — this file covers only what's unique to this repo.

## What This Is

Public directory of San Francisco preschools and K-12 schools. No login, no payments — `noLogin: true` in `src/constants.json`. Schools data is served read-only from a shipped SQLite file; the optional auth/user DB is a separate SQLite file that only matters if you flip on login.

## Development Commands

```bash
npm run install-all    # Frontend dependencies
npm run start          # Frontend (5173). Proxies are not used; the API is on :8000
npm run front          # Same as start
cd backend && cargo run    # Backend on :8000
npm run build          # Frontend typecheck + Vite production build
npm run typecheck      # tsc --noEmit for the frontend
npm test               # typecheck, script tests, docs links, tuition parser
cd backend && cargo test --locked
```

Kill ports 5173 / 8000 before starting if they're already bound.

The backend is zero-crate Rust. `backend/Cargo.toml` `[dependencies]` stays empty. Do not add a crate. Do not restore the Node/Hono server.

## Architecture

### Frontend
- **Entry:** `src/main.tsx` — uses `createSkateboardApp` with a single `home` route.
- **Main view:** `src/components/DirectoryView.tsx` — unified list+map view, state deep-linked via URL params.
- **Map:** `src/components/NeighborhoodMap.tsx` — react-leaflet, SVG pin icons, `FitBounds` helper auto-zooms to result set.
- **Detail sheet:** `src/components/SchoolDetailSheet.tsx` — shadcn Sheet, includes "View on map" deep link.
- **Filter bar:** `src/components/FilterBar.tsx` — neighborhood, program type, sector, catalog, favorites, sort.
- **Data hooks:** `src/components/useSchools.ts` (fetch + filter), `src/components/useFavorites.ts` (localStorage).
- **Tuition parser:** `src/components/tuitionSort.ts` — handles `$X–$Y/year`, `$X/month`, public schools, and unknowns. Tested in `tuitionSort.test.ts`.
- **Icons:** named imports from `lucide-react`. Do not import `@stevederico/skateboard-ui/icons` or `DynamicIcon`.

### URL State
`DirectoryView` reads and writes these query params:
- `view=list` — switch to list view (map is the default, no param needed)
- `favorites=1` — favorites-only filter
- `sort=price-asc|price-desc` — tuition sort
- `set=curated|added` — original catalog, or only the CDSS centers. Absent shows both
- `highlight=<id>&type=<preschool|upperschool>` — marker highlight from detail sheet's "View on map"

### Backend
- **Server:** `backend/src/` — zero-crate Rust (`cargo run`). Serves the built frontend from `../dist`.
- **Schools DB:** `backend/databases/preschools.db` — opened read-only at startup. Two tables: `preschools` and `upperschools`. `curated = 1` is the original directory. `curated = 0` is the CDSS center import. `DELETE FROM preschools WHERE curated = 0` rolls that import back.
- **Auth DB:** `backend/databases/PreschoolTmp.db` — created on demand from `backend/config.json`. Used only if auth flows are exercised.

### Schools API
- `GET /api/schools` — filters: `type`, `neighborhood`, `program_type`, `q`. Returns union of both tables with a `school_type` discriminator and a `curated` boolean.
- `GET /api/neighborhoods` — distinct neighborhoods across both tables.
- `GET /api/program-types` — distinct program types across both tables.

Literal `/api/...` paths are matched before the `/api/` prefix catch-all. Authenticated updates and deletes use the caller user id from the session.

See `docs/API.md` for request/response shapes and `docs/SCHEMA.md` for column definitions.

### Data Flow
```
preschools.db  →  /api/schools  →  useSchools()  →  DirectoryView
                                                    ├── SchoolCard grid
                                                    ├── NeighborhoodMap (lazy)
                                                    └── SchoolDetailSheet
```

## Dockerfile Notes

The image builds the Vite frontend and the Rust binary. `preschools.db` is copied to `/app/backend/databases/preschools.db`. Do not exclude that file in `.dockerignore`.

`SKATEBOARD_BACKEND_DIR=/app/backend`. The auth database path in `config.json` is relative to that directory.

## Deployment

Ships as one Docker image (see `Dockerfile`) that serves the frontend and the API on `PORT`.

- **Health check:** `GET /api/health`
- **Env:** `PORT`, `JWT_SECRET`, `CORS_ORIGINS`, `FRONTEND_URL`, optional `APP_NAME`. Stripe vars are optional; the app has no paid plans.
- **Data:** `preschools.db` is baked into the image at `/app/backend/databases`.

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

`package.json` has a `skateboardVersion` field (currently `5.6.0`) indicating which boilerplate release was used. Reference repo: https://github.com/stevederico/skateboard. Run `node scripts/update-skateboard.js` to 3-way merge template changes onto local edits, then diff and port carefully — **never** auto-update `constants.json`, `src/components/*`, or `backend/config.json`. Always consult before applying boilerplate changes.

`@stevederico/skateboard-ui` is pinned exact at `5.1.0`. Install it with `npm install @stevederico/skateboard-ui@5.1.0 --save-exact --min-release-age=0`. Do not put `--min-release-age=0` on any other install command.

## TypeScript Standards

### Style

- TypeScript everywhere — `.ts` / `.tsx` files, `strict` mode always on
- `@types` packages are dev-only dependencies (`@types/node`, `@types/react`, `@types/react-dom`)
- No build-step typechecking: `npm run typecheck` runs `tsc --noEmit` for the frontend; it gates `build`, `prod`, and `test`. Backend checks are `cargo test --locked`
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
