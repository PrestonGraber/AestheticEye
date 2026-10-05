# Base44 development notes

- This is a frontend-only concept collection. No backend, database, migrations, or external credentials are required. Booking and secondary navigation use links to the original practice website, not local services.
- Start with `docker compose -f docker-compose.base44.yml up -d`. The web service runs the bind-mounted checkout with Vite, exposes host port 3000, and installs the lockfile with `npm ci` on each container startup. The named volume holds container dependencies only.
- Compose overrides Vite's loopback binding with `--host 0.0.0.0`; the platform-provided `__VITE_ADDITIONAL_SERVER_ALLOWED_HOSTS` permits the preview proxy without hardcoding sandbox hostnames.
- Routes use hashes: `/` is the collection; `/#/clarity`, `/#/form`, `/#/perspective`, `/#/editorial`, `/#/serene`, and `/#/modern` are concepts. Shortlists persist only in browser localStorage.
- Verify with `docker compose -f docker-compose.base44.yml exec -T web npm test` (106 tests passed at setup) and `docker compose -f docker-compose.base44.yml exec -T web npm run build`. Production output is not the preview server; keep Vite running for live source edits.
- `curl -fsS http://localhost:3000/` should include `/@vite/client` and `/src/main.jsx`. The collection should show six cards; selecting Dark shows two, and All directions restores six.
