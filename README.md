# LMS — Micro-Frontend Platform

A Learning Management System built with **Next.js Multi-Zones** micro-frontends.
Each feature is an independent Next.js app ("zone"); a **shell** host stitches
them into one site via URL rewrites.

## How Multi-Zones works (read this first)

```
                 ┌─────────────────────────────────────┐
 browser ──────▶ │  shell (host)  http://localhost:3000 │  owns the root origin
                 │  next.config.ts  async rewrites()    │
                 └───────┬───────────┬───────────┬──────┘
                 /auth/* │  /courses/*│ /dashboard/* ...  (path prefix → zone)
                         ▼           ▼           ▼
                   auth-mfe     catalog-mfe   dashboard-mfe   ... each its own
                    :3001         :3002          :3005          Next.js app
```

- The **shell** is the only origin the browser sees. Its `rewrites()` proxy
  `/courses/*` → the catalog app, etc. Users never know there are 6 apps.
- Each zone sets `basePath` + `assetPrefix` (e.g. `/courses`) so its internal
  routes and static assets don't collide with other zones.
- **Navigation inside a zone** = `<Link>` → soft, no reload.
  **Navigation across zones** = plain `<a>` → full page load. (The one tradeoff.)
- **Sharing is build-time**, not runtime: shared React components live in
  `packages/ui` and are imported like any npm package. There is no runtime
  module federation. Cross-zone state (e.g. auth token) uses cookies/localStorage.

## Repo layout

```
apps/
  shell/              host app, port 3000          ✅
  auth/               login/register/forgot :3001  ✅
  catalog/            browse/search/enroll :3002   ✅
  learning/           lessons/progress :3003       ✅
  assignment/         submit/quiz/grades :3004     ✅
  dashboard/          student widgets :3005        ✅
  admin/              instructor tools :3006       ✅
packages/
  ui/                 @lms/ui — Button, Input, Modal, Navbar, Sidebar, Card, Loader
  api-client/         @lms/api-client — typed fetch + MSW mock backend
  tailwind-config/    @lms/tailwind-config — shared Tailwind v4 theme
  tsconfig/           @lms/tsconfig — shared TS configs
```

## Port map

| App        | Port | URL prefix      |
|------------|------|-----------------|
| shell      | 3000 | `/`             |
| auth       | 3001 | `/auth`         |
| catalog    | 3002 | `/courses`      |
| learning   | 3003 | `/learn`        |
| assignment | 3004 | `/assignments`  |
| dashboard  | 3005 | `/dashboard`    |
| admin      | 3006 | `/admin`        |

## Develop

```bash
pnpm install      # install whole workspace
pnpm dev          # turbo runs all apps (currently just the shell)
pnpm typecheck    # type-check everything
pnpm build        # production build
```

Open http://localhost:3000.

## Backend integration (FastAPI · `/api/v1`)

`@lms/api-client` talks to the real backend. Per-app `.env.local`:

```
NEXT_PUBLIC_API_URL=http://localhost:8000/api/v1
NEXT_PUBLIC_TENANT_ID=full-lms          # X-Tenant-ID on pre-auth calls
```

Client core ([packages/api-client/src/client.ts](packages/api-client/src/client.ts)):
- **Bearer auth** — access token attached from `tokens.ts` (localStorage, shared
  across zones via the shell origin).
- **`X-Tenant-ID`** header on every call (ignored once the JWT carries `tid`).
- **Single-flight refresh** — one 401 triggers a shared `/auth/refresh`; the
  rotating refresh token is never double-spent. Failure → `lms:unauthenticated`
  event → `AuthProvider` routes to login.
- **Error envelope** — throws `ApiError { status, code, requestId, details }`;
  branch on `code` (`permission_denied`, `module_not_enabled`, `rate_limited`…).

Session + gating ([AuthProvider.tsx](packages/api-client/src/AuthProvider.tsx)):
- `AuthProvider` bootstraps `/auth/me` → `user`, `roles`, `permissions`.
- `useAuth().can(permission)` drives nav/action visibility; `AppShell` hides
  gated items the user lacks (also approximates licensed-module visibility).

### Regenerate types when backend is hosted
```bash
cd packages/api-client
API_URL=http://<backend-host>:8000 pnpm gen:api   # writes src/schema.d.ts
```
Then migrate each zone's API module onto the generated types (replacing the
hand-written contract DTOs in `types.ts`).

### Multi-Tenancy & Subdomain Routing
This LMS architecture supports true multi-tenancy. 
- **Subdomain Detection:** The API client automatically infers the `X-Tenant-ID` from the current hostname (e.g., `abc-academy.localhost:3000` sets the tenant to `abc-academy`).
- **Vercel Fallback:** For local testing or Vercel preview URLs (e.g., `abc-academy-lms.vercel.app`), the client dynamically extracts the slug and applies it.

### Security & Role-Based Access
- **AdminGuard:** The `/admin` zone is protected by a client-side wrapper that verifies the `user.roles` (requiring `admin`, `tenant_admin`, `super_admin`, or `instructor`). Unauthorized students are silently redirected back to `/dashboard`.
- **Legacy Purge Complete:** All legacy `*Api` mock interfaces have been deleted. The application strictly adheres to the official `snake_case` backend schema (`UserOut`, `CourseOut`, etc.).

## Adding a new MFE zone (the recipe)

1. `apps/<name>` — a new Next.js app on its assigned port.
2. In its `next.config.ts`: set `basePath: '/<prefix>'`, `assetPrefix: '/<prefix>'`,
   and `transpilePackages: ['@lms/ui','@lms/api-client']`.
3. In its `globals.css`: `@import "@lms/tailwind-config/shared.css";`
4. Build pages under `app/...` using `@lms/ui` components + `@lms/api-client`.
5. Enable the matching rewrite in `apps/shell/next.config.ts`.

That's it — the zone now appears under the shell at its prefix.
