# Render Troubleshooting

## `ERR_MODULE_NOT_FOUND` during backend build

The backend build command must install dependencies before running any Node validation. Use one of these Render configurations:

- Blueprint deployment: keep `render.yaml` as committed. The backend service runs `npm install && npm run build` from `backend/`.
- Manual backend service: set **Root Directory** to `backend`, **Build Command** to `npm install && npm run build`, and **Start Command** to `npm start`.
- Manual monorepo service from repository root: set **Build Command** to `npm install --workspaces && npm run build --workspace backend`, and **Start Command** to `npm run start --workspace backend`.

The backend `build` script intentionally performs dependency-free syntax validation instead of importing the Express app, so Render does not need a database connection or runtime environment variables during build.
