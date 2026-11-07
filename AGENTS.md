<!-- BEGIN:nextjs-agent-rules -->

## This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->

# ImpactPulse client

Next.js 16 App Router frontend (React 19, Tailwind v4) for a volunteer-event platform. The API is a separate repo at `../impactpulse-server` (Express 5 + MongoDB driver, port 5000). No tests, no CI, no monorepo tooling.

## Commands

- `npm run dev` — Next on http://localhost:3000.
- `cd ../impactpulse-server && node index.js` — API on :5000. There is no `dev` script (only a failing `test` stub); it needs its own `.env` with `MONGODB_URI`.
- `npm run lint` — ESLint 9 flat config; currently passes clean. It enforces `react-hooks/set-state-in-effect`, so don't call state-setting loaders directly from an effect (use `useApiData`).
- `npx tsc --noEmit` — the only typecheck; currently passes with 0 errors. `npm run build` typechecks too.
- `next.config.ts` is non-default: `cacheComponents`, `partialPrefetching`, `reactCompiler`, and `experimental.agentFeedback` are on. Read `node_modules/next/dist/docs/` before adding server components, caching, or `use cache`.

## Next.js 16 specifics

- Route protection is `src/proxy.ts` (Next 16 renamed Middleware to Proxy), matcher `/dashboard/:path*`. It only checks for the Better Auth session cookie and redirects to `/login?redirect=...`; real authorization is enforced by the API.
- `src/app/dashboard/layout.tsx` exists and renders a tab bar (Overview, Create Event, Manage Events, Joined Events). The profile page has no tab.
- `(auth)` is a route group: URLs are `/login` and `/register`, not `/auth/*`.
- Root layout wraps everything in `SiteShell`, which hides the Footer on auth pages only.

## UI: shadcn on Base UI, not Radix

- `components.json` style is `base-nova`; `src/components/ui/*` is generated from `@base-ui/react`. Add more with `npx shadcn@latest add <component>`.
- `Button` does **not** accept `asChild`. Compose with Base UI's `render` prop:
  `<Button render={<Link href="/events" />}>Events</Button>`.
- `cn` is the `cn` npm package; `src/lib/utils.ts` only re-exports it, and generated components import directly from `"cn"`.
- Tailwind is v4 CSS-first: no `tailwind.config.*`; theme tokens live in `src/app/globals.css`, and CSS is compiled by `@tailwindcss/turbopack` via `turbopack.rules` in `next.config.ts`.

## Data and auth

- Pages are client components. Fetch with `useApiData` (`src/hooks/use-api-data.ts`) and a `useCallback` fetcher; it owns `data`/`loading`/`error`/`reload`. Use `useIsMounted` (`src/hooks/use-mounted.ts`) for client-only values such as local dates.
- `apiRequest(endpoint, init?, requiresAuth = false)` in `src/lib/api.ts` uses `NEXT_PUBLIC_BACKEND_URL` (fallback `http://localhost:5000`), `credentials: "include"`, and `cache: "no-store"`, and throws `Error(message)` on non-2xx. With `requiresAuth`, it fetches `/api/auth/token`, sends `Authorization: Bearer`, caches the token for 10 minutes, and clears it on 401.
- Better Auth is served by this app (`src/lib/auth.ts`, mounted at `src/app/api/auth/[...all]/route.ts`), stores users/sessions in MongoDB database `impactpulse` (hardcoded), and enables the JWT plugin (`/api/auth/token`, `/api/auth/jwks`) with audience `impactpulse-api`.
- The Express server verifies that JWT against `${BETTER_AUTH_URL}/api/auth/jwks`, then falls back to forwarding the cookie to `${BETTER_AUTH_URL}/api/auth/get-session`. Its `BETTER_AUTH_URL` must be the running Next origin (`http://localhost:3000` locally).
- Env is `.env` (gitignored), not `.env.local`: `MONGODB_URI`, `BETTER_AUTH_SECRET`, `BETTER_AUTH_URL`, `NEXT_PUBLIC_BACKEND_URL`, `NEXT_PUBLIC_BETTER_AUTH_URL`, `GOOGLE_CLIENT_ID`, `GOOGLE_CLIENT_SECRET`. The README's `.env.local` / `NEXT_PUBLIC_API_URL` instructions are stale.
- Only `NEXT_PUBLIC_*` vars reach browser bundles; `src/lib/auth-client.ts` reads `NEXT_PUBLIC_BETTER_AUTH_URL`.

## Cross-repo contract

- Categories are defined once in `src/lib/constants.ts` (`EVENT_TYPES`) and must match `allowedCategories` in `../impactpulse-server/index.js`: Cleanup, Plantation, Donation, Education, Health, Food, Community, Other. The event form defaults to `Cleanup`.
- Both repos use the same MongoDB database (`impactpulse`). The API returns both `_id` and `eventId`; links and filters use `event.eventId || event._id`.
- List endpoints return `{ success, total, page, totalPages, events }` (see `src/types/event.ts`).
