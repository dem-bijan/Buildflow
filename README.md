# Buildflow

Buildflow is a construction-ERP web app for Moroccan BTP companies: purchasing, stock,
site tracking, treasury, subcontracting, payroll, accounting, and a supplier/employee
directory, all gated by role.

This README explains how the **frontend** (this repo) actually works — not just how to
run it. The backend is a separate Spring Boot service; see `BACKEND_URL` below.

## Tech stack

- **Next.js 16** (App Router), React, TypeScript
- **Tailwind CSS 4** for styling, `next-themes` for dark/light mode
- **Axios** for HTTP, **Zod** for validation
- **Chart.js** (via a thin wrapper) for the dashboard charts, **Recharts** for the landing-page trend chart
- **Framer Motion** for page/modal transitions

## The big picture

```
Browser
  │  fetch("/api/...")            ← same-origin, cookie sent automatically
  ▼
Next.js server (this app)
  │  API routes (app/api/**)      ← the only code allowed to hold the session token
  │  fetch(`${BACKEND_URL}/api/v1/...`, { Authorization: Bearer <token> })
  ▼
Spring Boot backend                ← separate repo/service, source of truth
```

The browser **never** talks to the backend directly and never sees the JWT. Every
request goes through this Next.js app first. This is the one rule the rest of the
architecture is built around.

## Authentication

- `POST /api/auth/register` and `POST /api/auth/login` (`app/api/auth/*/route.ts`)
  validate input with Zod, forward it to the backend, and on success store the JWT the
  backend returns in an **httpOnly, secure, `sameSite=lax` cookie** (`lib/session.ts`).
  JavaScript in the browser can never read this cookie — that's what stops XSS from
  stealing it.
- Every subsequent request either goes through the generic proxy
  (`app/api/[...path]/route.ts` → `lib/api/proxy.ts`), which reads the cookie and
  attaches `Authorization: Bearer <token>` before forwarding to the backend, or through
  a dedicated route (`/api/auth/me`, `/api/auth/me/email`, `/api/auth/me/password`)
  that does the same thing explicitly.
- `lib/authContext.tsx` (`AuthProvider`) calls `GET /api/auth/me` once on mount and
  exposes `{ user, loading, refetch }` via `useAuth()`. This is how every component
  knows who's logged in and what role they have.
- Some roles (`ADMIN`, `DIRECTEUR`, `RH`, `PM`) require approval before they can log
  in — registering as one of these creates a `PENDING` account that an approver has to
  accept on `/dashboard/approbations` first.
- Rate limiting (`lib/rateLimit.ts`) is applied per-IP on login, register, and the
  account-management endpoints. It's in-memory (per server process — fine at this
  app's scale, would need a shared store like Redis if you ever run multiple
  instances).

## Authorization (who can see what)

`lib/auth/permissions.ts` is a single map from route prefix → allowed roles
(`ROUTE_PERMISSIONS`). It's the one source of truth, used in four places:

1. **Middleware** (`middleware.ts`) — the actual frontend enforcement point. Runs on
   every `/dashboard/*` request at the edge: no valid session cookie → redirected to
   the sign-in modal with a `next` param; valid session but a role the page doesn't
   allow → redirected back to `/dashboard`. (It decodes the JWT without verifying the
   signature — that's fine, because the backend independently verifies and authorizes
   every data request; the middleware only decides what to *show*.)
2. **Sidebar** (`components/dashboard/SIdebar.tsx`) — filters nav items so a role never
   even sees a link it can't use.
3. **Dashboard overview** (`app/dashboard/DashboardClient.tsx`) — filters both which
   domain summary cards render *and* which API calls get made, so a role that can't
   see e.g. Salaires never fires that request in the first place.
4. **Route guard** (`components/RequireRole.tsx`) — a client-side second layer,
   currently mounted on the Approbations page.

The backend enforces the same rules independently (`@PreAuthorize` on every
controller) — the frontend checks exist for UX, not as the actual security boundary.

## Who does what: roles and page access

| Role | Pages it can open |
|---|---|
| `ADMIN` | everything |
| `DIRECTEUR` | Suivi Chantiers, Trésorerie, Sous-traitance, Salaires, Annuaire, Comptabilité, Approbations |
| `PM` | Achats, Suivi Chantiers, Stocks, Sous-traitants, Approbations |
| `ACHAT` | Achats, Fournisseurs, Catalogue, Sous-traitants |
| `MAGASINIER` | Stocks |
| `CHEF_CHANTIER` | Stocks, Suivi Chantiers, Trésorerie, Sous-traitance |
| `FINANCE` | Trésorerie, Sous-traitance, Salaires, Paiements, Comptabilité |
| `RH` | Salaires, Annuaire, Approbations |
| `VIEWER` | dashboard home only |

(Everyone lands on `/dashboard`, which shows only the summary cards for the pages
their own role can open — see **Authorization** above.)

## Data dependencies: what has to exist before what

Every piece of reference data in this app is enterable from *some* page — nothing
requires going around the frontend to seed data directly against the backend. The
rule that governs the order you use these pages in is simple: **a required dropdown
is only as good as the data that already exists to fill it**. Two entities sit
underneath almost everything else and are worth creating first:

- **Chantiers** (construction sites, `/dashboard/suivi-chantiers`) — `chantierId` is a
  required or optional field on Achats, Caisses (Trésorerie), Contrats de
  sous-traitance, Fiches de paie, Employés, and it's what Stocks is filtered by.
- **Sous-traitants** (the subcontractor directory, its own page at
  `/dashboard/sous-traitants`, separate from the Sous-traitance contracts page) — a
  Contrat de sous-traitance needs `sousTraitantId`.

Everything else builds on those two, roughly in this order:

1. **Chantiers** (Suivi Chantiers) and **Sous-traitants** (Sous-traitants) — no
   dependencies, create these first. Note the role split: creating a Chantier needs
   `ADMIN`/`DIRECTEUR`/`PM`/`CHEF_CHANTIER`; creating a Sous-traitant needs
   `ADMIN`/`PM`/`ACHAT` — different enough that no single non-admin role can set up
   both on their own.
2. **Fournisseurs** (Fournisseurs page) — self-contained, no dependencies.
3. **Catégorie d'article** — not a separate step: typing a new category name while
   creating an Article on Catalogue creates it inline.
4. **Articles** (Catalogue) — needs a Catégorie (step 3, auto-created if new) and can
   optionally tag `fournisseursPreferentiels` from step 2.
5. **Achats** (Achats page) — needs a Fournisseur (2), a Chantier (1), and at least one
   Article (4) per line item.
6. **Employés** (Annuaire) — self-contained; `chantierActuelId` is an optional link to
   a Chantier (1).
7. **Fiches de paie** (Salaires) — needs an Employé (6); `chantierId` is optional.
8. **Caisses** (Trésorerie) — needs a Chantier (1).
9. **Transactions de caisse** — created from inside a Caisse's row (8); there's no
   separate "pick a caisse" field, the caisse is the context you're already in.
10. **Contrats de sous-traitance** (Sous-traitance) — needs a Sous-traitant (1) and a
    Chantier (1).
11. **Paiements** — needs a Contrat (10). The Sous-traitance page's own paiement form
    and the standalone Paiements page both write to the same data, just entered from
    two different screens.

**Read-only / fully derived pages — nothing to enter, because there's nothing here
that isn't computed from the data above:**
- **Stocks** — pick a chantier, see its current inventory. There's no backend endpoint
  to create or adjust a stock row at all (quantities come from elsewhere in the
  system), so this page is correctly view-only rather than missing a form.
- **Comptabilité** — auto-generated from Achats, Fiches de paie, and Paiements.
- **Dashboard** (`/dashboard`) — aggregates every module above.

### Walking through it by role

- **ACHAT** — add a Sous-traitant on Sous-traitants and/or a Fournisseur on
  Fournisseurs whenever a new one needs onboarding, then (if needed) a Catégorie +
  Article on Catalogue, then create an Achat picking an existing Chantier + the
  Fournisseur + Article(s) just created. If no chantier exists yet, ask an admin/PM/
  chef de chantier first — Achats can't be created without one.
- **PM** — create a Chantier on Suivi Chantiers before anyone else can reference it,
  and/or add a Sous-traitant on Sous-traitants. Otherwise mostly oversight on Achats
  and Stocks (read-only).
- **RH** — add an Employé on Annuaire (chantier link optional), then create their
  Fiche de paie on Salaires, picking that employee.
- **FINANCE / CHEF_CHANTIER** — create a Caisse against an existing Chantier on
  Trésorerie, then log Transactions against it. Separately, create a Contrat de
  sous-traitance against an existing Chantier + Sous-traitant, then record Paiements
  against that contract (visible both on Sous-traitance and on the Paiements page).
  `CHEF_CHANTIER` can also create Chantiers directly.
- **MAGASINIER** — Stocks is read-only: pick a Chantier from the dropdown and review
  its inventory. There's nothing to fill in.
- **DIRECTEUR** — creates Chantiers, otherwise mostly a read/oversight role across
  Suivi Chantiers, Trésorerie, Sous-traitance, Salaires, Annuaire, and Comptabilité;
  also handles Approbations (accepting/rejecting pending `ADMIN`/`DIRECTEUR`/`RH`/`PM`
  sign-ups).

## How a typical page works

Every module (Achats, Fournisseurs, Trésorerie, …) follows the same shape:

```
app/dashboard/<module>/
  page.tsx        — thin wrapper, sometimes owns a "create new X" form
  <Module>Client.tsx  — "use client": fetches data, renders KPIs/charts/table
```

Inside a `*Client.tsx`:

1. `useState` holds the raw data, `loading`, and `error`.
2. `load()` (wrapped in `useCallback`) fetches from `lib/api/<module>.ts`, which calls
   the shared `apiClient` (`lib/api/client.ts`, an Axios instance pointed at `/api`).
   The response interceptor there automatically unwraps the backend's
   `{ status, data, message }` envelope, so callers just get the payload.
3. `useEffect(() => { load(); }, [load])` runs it on mount.
4. Raw backend DTOs get mapped into the domain shapes defined in
   `components/functions2.tsx`, then passed through `hydrate()` with that module's
   `*HydrationConfig` — a set of small pure functions that turn a flat list of records
   into KPI numbers, chart datasets (`DataPoint[]`, `StatusPoint[]`,
   `MultiSeriesData`), and table rows in one pass.
5. The hydrated data feeds shared chart components from `components/Functions.tsx`
   (`KpiGrid`, `HorizontalBarChart`, `DonutChart`, `PieChart`, `StackedBarChart`,
   `LineChart`) — all thin wrappers around Chart.js, loaded lazily via
   `<ChartJsLoader>` since Chart.js comes from a CDN `<script>` rather than npm.
6. Loading and error states are handled with the same pattern everywhere: a spinner
   while `loading && data.length === 0`, a generic "something went wrong" card on
   error (see **Error handling** below), otherwise the real content.

The dashboard home page (`/dashboard`, `DashboardClient.tsx`) is the exception — it
fetches a slice of *every* module's data in parallel (permission-gated, and each fetch
independently wrapped so one failing domain never blanks the rest of the page) to
build the 4 top KPI cards and one summary card per accessible module, each linking
through to that module's full page.

## Error handling (what users see vs. what gets logged)

Nothing shown to the user ever includes a raw exception message, HTTP status text, or
backend response body — every catch block resolves to a fixed, generic string like
*"Une erreur est survenue. Veuillez réessayer."* This is deliberate: it's the one place
across the whole app that's most likely to accidentally leak internal details.

Real diagnostics still exist, just server-side only: `lib/logger.ts` writes structured
JSON (`{ context, status, message }` — never tokens, passwords, or response bodies) to
the Next.js server's own stdout, which only shows up in server/container logs, never
in the browser console. Every API route and the proxy log this way on backend
failures.

## Settings (`/dashboard/settings`)

Change email, change password, and delete account all go through dedicated API routes
that require the current password, rate-limit attempts, and — for email changes —
transparently rotate the session cookie, since the backend's JWT subject is the email
address and the old token stops being valid the moment it changes.

## Theming

`app/layout.tsx` wraps the entire app (every route, from the very first server-rendered
byte) in `next-themes`' `ThemeProvider`. It has to live in the *root* layout, not a
nested one — mounting it deeper would mean its FOUC-prevention script only ships with
the initial page load of whichever route happens to be entered first, and gets skipped
entirely on client-side navigation into other routes.

## Project layout

```
app/
  (page)/            landing page (sign in / sign up modals)
  dashboard/
    <module>/         one folder per ERP module (see "How a typical page works")
    layout.tsx         sidebar + header shell, wraps every /dashboard/* route
    DashboardClient.tsx overview page — all modules, one screen
  api/
    auth/              login/register/me/logout/change-email/change-password
    users/              pending/approve/reject (account approval workflow)
    [...path]/          generic authenticated proxy to the backend
components/
  Functions.tsx        chart components + layout primitives (Card, Section, KpiGrid…)
  functions2.tsx        domain types + hydration configs, one section per module
  dashboard/            sidebar, header, profile dropdown
lib/
  api/                  apiClient (axios) + one thin fetch module per backend resource
  auth/permissions.ts    the ROUTE_PERMISSIONS map described above
  authContext.tsx         useAuth()
  session.ts              the only file allowed to touch the session cookie
  logger.ts                server-only structured error logging
  validation/auth.ts       zod schemas shared by client-side and route-handler validation
```

## Getting started

1. `npm install`
2. Create `.env.local` with `BACKEND_URL=http://localhost:8080` (or wherever the
   backend is running)
3. `npm run dev` → http://localhost:3000

Useful commands: `npm run build`, `npm run lint`, `npx tsc --noEmit`.
