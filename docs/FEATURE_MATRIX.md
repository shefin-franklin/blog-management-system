# Feature Matrix

## Authentication and RBAC
- Register, login, logout, refresh tokens, password change, profile updates and OTP password reset endpoints are implemented.
- Role hierarchy covers `super_admin`, `admin`, `editor`, `author` and `subscriber` with route-level middleware enforcement.
- Session records store hashed refresh tokens, user agent, IP address and expiry metadata.

## Blog Publishing
- Blogs support drafts, review, published, scheduled, archived and soft-deleted states.
- Custom slug generation prevents duplicates and validates SEO-friendly URL formats.
- Version history is stored before updates through the `Revision` collection.
- Bulk moderation supports safe updates for status, featured, sticky and scheduled fields.

## AI Integration
- Gemini powers writing, SEO, summaries, tags, outlines, FAQ generation, analytics prompts and moderation.
- AI logs persist feature, prompt, response and user data for auditability.
- A deterministic local fallback keeps development workflows functional without a Gemini key.

## SEO and Discovery
- Blog documents include meta title, meta description, keywords, canonical URL, Open Graph image, schema data and SEO score.
- The API exposes structured article data with blog responses.
- `robots.txt` and dynamic `sitemap.xml` routes are available from the backend.

## Suggestions and Analytics
- Trending uses weighted views, likes, comments, shares, reading duration and age decay.
- Related articles combine category overlap, tag overlap and trend proximity.
- Personalized suggestions boost content that matches user interests.
