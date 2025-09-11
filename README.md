# SDI---Capstone-Project

## ERD
![](docs/ERD/ERD.png)

## Quick Start (Frontend ↔ Backend)

- Backend: runs Express on `http://localhost:8080` with Postgres. Use `backend/docker-compose-dev/docker-compose.yaml` to start DB + API in dev.
- Frontend: set the API base URL in Vite env.

Frontend env (create `Frontend/.env.local`):

```
VITE_API_URL=http://localhost:8080
# Set to `cookie` only if your backend uses cookie sessions
VITE_AUTH_MODE=none
```

Notes:
- No auth routes are wired yet; development uses a local dev user.
- CORS: credentials are only sent when `VITE_AUTH_MODE=cookie`.
