# Render Deployment

1. Push the repository to GitHub.
2. In Render, create services from `render.yaml`.
3. Add MongoDB Atlas connection string, Gemini API key, Cloudinary credentials and SMTP settings.
4. Confirm backend health check `/api/v1/health` returns `{status:"ok"}`.
5. Set `VITE_API_URL` for the static frontend if the default proxy path is not used.
