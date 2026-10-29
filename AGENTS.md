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

Deployed on a VPS `server` via the host (project `bixby`, app `schools`, applicationId `APP_ID`, Swarm service `schools`):
- **URL:** https://schools.bixbyapps.com (routed by bixby-proxy to `schools:8080`)
- **Port:** `PORT=8080`, Swarm health check overridden to `http://127.0.0.1:8080/api/health`.
- **No volume.** All DB files live inside the container at `/app/backend/databases` (`preschools.db` from the image, an empty `PreschoolTmp.db`). A redeploy wipes anything written there. Fine today: no login, no Stripe plans.
- **Env set:** `APP_NAME`, `CORS_ORIGINS`, `FRONTEND_URL`, `JWT_SECRET`, `PORT`. Not set: `STRIPE_KEY`, `STRIPE_ENDPOINT_SECRET` (payments will error until these exist).
- **History:** Railway (project `bixby`, service `schools`, volume `schools-volume`) is retired since 2026-10-27. That volume was never copied. Never `railway up`; only Steve deletes Railway leftovers.

Deploy: commit first, then build from a clean tree, push to the server registry, save the new tag, deploy. A plain the host redeploy reuses the pinned image.

```bash
SHA=$(git rev-parse --short HEAD)
D=$(mktemp -d); git archive HEAD | tar -x -C "$D"
docker build --platform linux/amd64 -t localhost:5000/schools:$SHA "$D"
ssh -f -N -L 127.0.0.1:5000:localhost:5000 server
docker push localhost:5000/schools:$SHA
kill $(pgrep -f "^ssh -f -N -L 127.0.0.1:5000:localhost:5000 server")
APP=APP_ID
echo "{\"applicationId\":\"$APP\",\"dockerImage\":\"localhost:5000/schools:$SHA\",\"username\":\"\",\"password\":\"\",\"registryUrl\":\"\"}" \
  | deploy-api POST application.saveDockerProvider
echo "{\"applicationId\":\"$APP\"}" | deploy-api POST application.deploy
ssh server 'sudo docker service ls | grep schools'   # 1/1 on the new tag
curl -s -A "Mozilla/5.0 (X11; Linux x86_64) Chrome/130" https://schools.bixbyapps.com/api/health
```

Rollback: save the previous tag and deploy. Full runbook: the private ops notes.

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
