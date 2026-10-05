# AestheticEye Design Collection

Vite + React 19 + Tailwind v4 single-page app showing six homepage design directions. Routing is hash-based (`#/clarity`, `#/editorial`, etc.); the root shows the collection grid.

## Running in Base44

- `docker compose -f docker-compose.base44.yml up -d` — starts the Vite dev server on host port 3000 (container port 5173).
- The repo's `vite.config.js` binds the dev server to `127.0.0.1` with `strictPort`, which is unreachable through the container's published port. The compose `command` overrides this with `--host 0.0.0.0 --port 5173 --strictPort`. **Do not remove that override** or the preview goes blank.
- No external secrets or backend services are required.

## Verification

- `npm run build` compiles cleanly (large-bundle warning is expected).
- Curl `http://localhost:3000/` returns the source `index.html` with Vite's dev client injected (confirms live source, not a prebuilt bundle).
- Preview: root renders the collection grid; `#/clarity` renders the design with a `#main` element and no console errors.
