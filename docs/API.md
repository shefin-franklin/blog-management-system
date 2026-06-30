# API Documentation

Base URL: `/api/v1`.

Authentication uses HTTP-only `accessToken` and `refreshToken` cookies. Protected endpoints accept `Authorization: Bearer <token>` as well.

## Roles
`super_admin`, `admin`, `editor`, `author`, `subscriber` are enforced by middleware.

## Algorithms
Trending score weights views, likes, comments, shares, reading duration and content age. Related articles combine tag overlap, category overlap and trend proximity. Personalized recommendations boost posts matching user interests.
