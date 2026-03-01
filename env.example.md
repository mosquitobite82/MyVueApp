# Shared environment (workspace root)

Frontend (`my-vue-app`) and backend (`MyBackendApp`) both use the same config from the **workspace root** so URLs and CORS stay in sync.

## Setup

1. Copy the example file:
   ```bash
   cp .env.example .env
   ```
2. Edit `.env` if you need different ports or origins. Do not commit `.env` (it is gitignored).

## Variables

| Variable | Used by | Description |
|----------|---------|-------------|
| `VITE_API_URL` | Frontend | Backend base URL for API and SignalR (e.g. `http://localhost:5215`). |
| `ASPNETCORE_URLS` | Backend | URL(s) the backend listens on. |
| `CORS_ORIGINS` | Backend | Comma-separated origins allowed for CORS (e.g. Vite dev server URLs). |

## How it’s loaded

- **Frontend:** Vite is configured with `envDir` pointing at the workspace root, so it loads root `.env` and exposes `VITE_*` variables to the app.
- **Backend:** On startup it loads `.env` from the current or parent directory (DotNetEnv) and uses `CORS_ORIGINS` and `ASPNETCORE_URLS`.
