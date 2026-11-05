<!-- BEGIN:nextjs-agent-rules -->

## This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->

# ImpactPulse client

Next.js 16 App Router frontend for a volunteer-event platform. The API is a separate repo one level up: `../impactpulse-server` (Express + MongoDB, port 5000). There are no tests and no CI.

## Commands

- `npm run dev` — Next on http://localhost:3000.
- `cd ../impactpulse-server && node index.js` — API on http://localhost:5000 (no dev script; it needs its own `.env` with `MONGODB_URI`). Event pages need it; auth runs inside Next but needs MongoDB.
- `npm run lint` — ESLint 9 flat config; no args needed.
- `npx tsc --noEmit` — the only typecheck command; `npm run build` also typechecks.
- Baseline is not green: `npx tsc --noEmit`/`npm run build` fail with 40 `TS2322` errors, all from `asChild` on `Button`; ESLint reports 12 pre-existing errors (`react-hooks/set-state-in-effect`, `no-explicit-any`). Don't attribute these to your change.
- `next.config.ts` is non-default: `cacheComponents`, `partialPrefetching`, `reactCompiler`, and `experimental.agentFeedback` are enabled. Read `node_modules/next/dist/docs/` before adding server components, caching, or `use cache`.

## UI: shadcn on Base UI, not Radix

- `components.json` style is `base-nova`; `src/components/ui/*` is generated from Base UI (`@base-ui/react`). Add more with `npx shadcn@latest add <component>`.
- `Button` does **not** accept `asChild`. Compose with Base UI's `render` prop:
  `<Button render={<Link href="/events" />}>Events</Button>`.
  Every existing `asChild` usage is a type error — do not copy the pattern.
- `cn` is the `cn` npm package (`src/lib/utils.ts` re-exports it); generated components import it directly from `"cn"`.
- Tailwind is v4 CSS-first: there is no `tailwind.config.*`; theme tokens live in `src/app/globals.css`, and CSS is loaded via `turbopack.rules` in `next.config.ts`.

## Data and auth wiring

- Pages are client components. Event data goes through `apiRequest()` in `src/lib/api.ts`: `BACKEND_URL` (default `http://localhost:5000`), `credentials: "include"`, `cache: "no-store"`. Follow the existing `useEffect` + `useCallback` loading pattern.
- Better Auth is served by this app at `src/app/api/auth/[...all]/route.ts` (email/password + Google) and stores users/sessions in MongoDB database `impactpulse` (hardcoded in `src/lib/auth.ts`).
- The Express server has no auth code: `authenticateUser` forwards the request cookie to `${BETTER_AUTH_URL}/api/auth/get-session` on the Next origin. If that URL does not point at the running Next server, every protected API call returns 401.
- Env (`.env`, untracked): `MONGODB_URI`, `BETTER_AUTH_SECRET`, `BETTER_AUTH_URL`, `BACKEND_URL`, `GOOGLE_CLIENT_ID`, `GOOGLE_CLIENT_SECRET`.
- Only `NEXT_PUBLIC_*` vars reach browser bundles. `api.ts` reads `BACKEND_URL` and `auth-client.ts` reads `BETTER_AUTH_URL` from client components, so in the browser they silently fall back to localhost. `NEXT_PUBLIC_BACKEND_URL` exists but is unused — switch to it if you fix browser-side API URLs.

## Cross-repo contract

- Events live in the same `impactpulse` database. The API returns both `_id` and `eventId`; links use `event.eventId || event._id`.
- Categories are hardcoded in `src/app/page.tsx`, `src/app/events/page.tsx`, `src/app/dashboard/create-event/page.tsx`, and `src/app/dashboard/edit-event/[id]/page.tsx`, and already disagree with the API allow-list (`Education, Environment, Food, Health, Clothing, Community, Other`). The UI's `Community Service` and `Food Distribution` are rejected on create and match nothing on filter. Update every copy plus `../impactpulse-server/index.js` together.

## Routing and layout

- `(auth)` is a route group: the URLs are `/login` and `/register`, not `/auth/*`.
- `src/app/layout.tsx` wraps everything in `SiteShell`, which hides Navbar/Footer under `/dashboard`. There is no `dashboard/layout.tsx` or sidebar (the comment in `site-shell.tsx` is stale); dashboard pages render their own content.
