# Inmebel

Source snapshot from `/root/inmebel` on server 220 (12 October 2026).

- `api/`: Laravel API
- `admin/`: admin interface
- `frontend/`: customer interface
- `docker-compose.yml`: server deployment layout

Before building or running the services, create `./.env` and `api/.env` from their examples, and create `frontend/.env.production` from `frontend/.env.example`. Set real credentials in those local files. The frontend Dockerfile copies `.env.production` during its build. The root Compose file expects `POSTGRES_PASSWORD`; the standalone API Compose file also expects `PGADMIN_DEFAULT_PASSWORD`. Keep the API `DB_PASSWORD` aligned with the Postgres password.

Database dumps, live environment files, logs, old copies, and generated build output are excluded from this repository. The `nginx-inmebel.disabled.conf` file is a server-specific reference; adapt it before use elsewhere.
