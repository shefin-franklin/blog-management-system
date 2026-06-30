# Gemini BlogOS — MERN Blog Management System

Production-oriented MERN blogging platform with RBAC, JWT refresh sessions, Google Gemini AI, TipTap editing, SEO metadata, analytics scoring, media uploads, and Render deployment.

## Structure
- `backend/src`: Express clean architecture with models, controllers, services, middleware, AI and analytics modules.
- `frontend/src`: React 19 Vite app with routed SaaS UI, admin dashboard, editor, services and Zustand store.
- `docs`: deployment and API notes.

## Local setup
1. Copy `.env.example` to `.env` and configure MongoDB Atlas, Gemini, Cloudinary and JWT secrets.
2. Run `npm install` in the repository root.
3. Start MongoDB locally or use Atlas.
4. Run `npm run dev`.

## Core API
All routes are versioned under `/api/v1`.
- Auth: register, login, logout, refresh, profile, password change, OTP password reset.
- Blogs: CRUD, soft delete, restore, bulk actions, likes, bookmarks, personalized suggestions.
- Admin: overview analytics, users, categories, tags, comments, settings.
- AI: generation and moderation powered by Gemini with deterministic local fallback for development.
- Media: Multer uploads to Cloudinary when configured.

## Deployment
Use `render.yaml` to create a backend web service and static frontend. Configure environment variables in Render and point MongoDB to Atlas. The backend health check is `/api/v1/health`.
