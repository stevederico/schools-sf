<div align="center">
  <p>
    <img src="public/icons/icon.png" width="60" height="60" alt="SF Schools">
  </p>
  <h1 align="center" style="border-bottom: none; margin-bottom: 0;">SF Schools</h1>
  <h3 align="center" style="margin-top: 0; font-weight: normal;">
    a directory of san francisco preschools and K-12 schools with map, filters, and tuition
  </h3>
</div>

<br />

## 🎬 Demo

Open the live site, browse 107 schools on a Leaflet map or in a grid, filter by neighborhood, program type, and sector, sort by tuition, and save favorites to localStorage — no login required.

<br />

## 🚀 Quick Start

```bash
git clone https://github.com/stevederico/preschool
cd preschool
npm run install-all
npm run start
```

Frontend on `http://localhost:5173`, backend on `http://localhost:8000`.

<br />

## ✨ What's Included

### 🗺️ **Map + Directory**
- **Interactive map** with Leaflet — markers for every school with GPS coordinates
- **Grid directory** with cards showing neighborhood, ages, program type, and tuition
- **Deep-linked state** — view mode, filters, sort, and highlighted school live in the URL
- **Detail sheet** with full address, hours, pricing, website, and "View on map"

### 🎯 **Filters & Sort**
- **Neighborhood, program type, and sector** (public/private) filters
- **School type tabs** — preschool vs. K-12 upper school
- **Price sort** — low→high, high→low; unknown tuition sorts above the top
- **Tuition parser** handles ranges, per-month rates, and free-text formats
- **Favorites toggle** — heart schools, persists in localStorage, filter by favorites-only

### 🏫 **Curated Data**
- **65 preschools + 42 upper schools** across San Francisco
- **Tuition researched** from public sources with OCR-extracted rate charts where available
- **Neighborhood coverage** spans Marina, Presidio, Pacific Heights, and beyond
- **Age cutoff and cohort placement** reference doc included

### 🛠️ **Stack**
- **React 19 + Vite 7** frontend
- **Rust + SQLite** backend serving a read-only schools database
- **Tailwind v4** with shadcn/ui primitives via skateboard-ui
- **react-leaflet** for the map, **@tanstack/react-table** for tabular views, **@dnd-kit** for interactions

<br />

## 📖 Configuration

**Frontend** — `src/constants.json` controls the app name, tagline, features grid, and legal copy. `noLogin: true` keeps the site public with no auth flow.

**Backend** — `backend/config.json` points at the SQLite database:

```json
{
  "staticDir": "../dist",
  "database": {
    "db": "PreschoolTmp",
    "dbType": "sqlite",
    "connectionString": "./databases/PreschoolTmp.db"
  }
}
```

The main schools dataset lives at `backend/databases/preschools.db` and is opened read-only by the server.

**Environment** — `backend/.env`:

```bash
JWT_SECRET=your-secret-key
```

Stripe variables are optional — the site runs without payments.

<br />

## 🏗️ Tech Stack

| Technology | Version | Purpose |
|------------|---------|---------|
| **React** | v19 | UI framework |
| **Vite** | v8 | Build tool and dev server |
| **Tailwind CSS** | v4 | Styling |
| **React Router** | v7 | URL state (via skateboard-ui) |
| **react-leaflet** | v5 | Map rendering |
| **Rust** | stable | Backend server (zero-crate) |
| **SQLite** | system libsqlite3 | Schools directory and optional auth |
| **skateboard-ui** | 5.1.0 | App shell and shadcn primitives |

<br />

## 📚 Architecture

Built on the skateboard Application Shell pattern — skateboard-ui owns routing, layout, and auth scaffolding; this repo owns the browse experience (`DirectoryView`, `NeighborhoodMap`, `SchoolDetailSheet`, `FilterBar`) and the schools API endpoints in `backend/src/routes.rs`.

Three API endpoints power the frontend:

- `GET /api/schools` — filtered school list (type, neighborhood, program_type, query)
- `GET /api/neighborhoods` — distinct neighborhood list for filters
- `GET /api/program-types` — distinct program type list for filters

<br />

## 🚀 Deployment

See [docs/DEPLOY.md](docs/DEPLOY.md). The Dockerfile builds the frontend and the Rust backend. The schools database is copied into the image. Mount a persistent volume at `/app/databases` if you need the user/auth database to survive redeploys.

<br />

## 🤝 Contributing

```bash
git clone https://github.com/stevederico/preschool
cd preschool
npm run install-all
npm run start
```

Run tests with `npm run test`.

<br />

## 📬 Community & Support

- **🐦 X**: [@stevederico](https://x.com/stevederico)
- **🐛 Issues**: [GitHub Issues](https://github.com/stevederico/preschool/issues)

<br />

## 🙏 Acknowledgements

- [React](https://react.dev) — UI library
- [Vite](https://vitejs.dev) — build tool
- [Tailwind CSS](https://tailwindcss.com) — utility-first CSS
- [Shadcn/ui](https://ui.shadcn.com) — accessible components
- [Leaflet](https://leafletjs.com) — open-source maps
- [OpenStreetMap](https://www.openstreetmap.org/copyright) — map tile data

<br />

## 🎪 Related Projects

- [skateboard](https://github.com/stevederico/skateboard) — React boilerplate with auth and payments
- [skateboard-ui](https://github.com/stevederico/skateboard-ui) — component library

<br />

## 📄 License

MIT License — see [LICENSE](LICENSE).

<br />

---

<div align="center">
  <p>
    Made with <a href="https://github.com/stevederico/skateboard">Skateboard</a> — a React boilerplate with auth and payments
  </p>
  <p>
    Built by <a href="https://github.com/stevederico">Steve Derico</a>
  </p>
</div>
