# Render Troubleshooting

## `ERR_MODULE_NOT_FOUND` during backend build

The backend build command must install dependencies before runtime startup. This repository now also makes `backend/src/app.js` safe to import during build validation because it uses dynamic imports inside `createApp()` instead of importing Express at module load time.

Use one of these Render configurations:

- Blueprint deployment: keep `render.yaml` as committed. The backend service runs `npm install && npm run build` from `backend/`.
- Manual backend service: set **Root Directory** to `backend`, **Build Command** to `npm install && npm run build`, and **Start Command** to `npm start`.
- Manual monorepo service from repository root: set **Build Command** to `npm install --workspaces && npm run build --workspace backend`, and **Start Command** to `npm run start --workspace backend`.

The backend `build` script performs dependency-free syntax validation, so Render does not need a database connection or runtime environment variables during build. If an older Render service still has **Build Command** set to only `npm run build`, the build step will no longer import Express from `app.js`; however, the service must still install dependencies before `npm start` can run successfully.
