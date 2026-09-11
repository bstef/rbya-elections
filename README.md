# RBYA Elections

Live at **[rbya.cloud](https://rbya.cloud)**.

Nomination, delegate registration, and voting for RBYA (Romanian Baptist
Youth Association) committee elections. A rebuild of the org's old ASP.NET
Core election app, with real authentication for both voters and the
election committee, and a ballot that's correct by construction rather than
cleaned up after the fact.

Stack: Next.js (TypeScript, App Router) + Supabase (Postgres, Auth, RLS),
deployed on Cloudflare Workers via [vinext](https://vinext.dev/) (Cloudflare's
recommended Next.js-on-Workers path, still in beta as of this writing).
Originally deployed on Vercel; moved to Cloudflare Workers' free tier since
this app only sees real traffic once a year around Convention and Vercel's
paid plan wasn't worth it for that usage pattern.

## How it works

- **Anyone** can nominate a candidate (`/nominate`), leave a comment of
  support or an objection on a candidate (`/candidates/[id]`), or register
  their church's delegates (`/delegates/register`) — no login required.
  Objections are never shown publicly; only the election committee sees
  them, to prep what's read aloud at Convention before voting.
- **Delegates** log in passwordlessly (`/login`, email magic link) once
  their church's registration has been verified by the committee, then vote
  once per position on the ballot (`/ballot`).
- **The election committee** logs in with a real password (`/admin/login`,
  accounts provisioned out-of-band, not via public sign-up) to manage
  elections/positions, moderate candidates and comments, verify delegates,
  edit a candidate's photo if needed, and publish results.
- **Results** (`/results`) lead with a winners summary — one card per
  executive position (President, both VPs, Treasurer, Controller), plus a
  collapsible General Committee section for the larger, multi-seat
  committee-member race — with the full per-candidate vote tables below
  it. Past elections stay browsable afterward through `/archive`,
  `/candidates/year/[year]`, and `/results/[year]`, so a completed
  election's candidates and results aren't lost once a new one starts.

All public writes and the ballot submission go through Postgres
`SECURITY DEFINER` functions (see `supabase/migrations/0010_rpc_functions.sql`
and `0013_admin_rpc_functions.sql`) so window checks (nomination/voting
open, absentee deadline), token checks, and the ballot seat-limit are
enforced in one place, not trusted to the client. Row Level Security
enforces who can read/write what — see `supabase/migrations/0011_rls_policies.sql`
for the full policy table.

## Local development

```bash
npm install
cp .env.local.example .env.local   # fill in from the Supabase dashboard
npm run dev
```

The `.env.local` values come from your Supabase project's
Project Settings > API page (or the Supabase MCP `get_project_url` /
`get_publishable_keys` tools).

### Database

Migrations live in `supabase/migrations/`, applied in filename order. Apply
them to a project with the Supabase CLI (`supabase db push`) or the
Supabase MCP `apply_migration` tool. `supabase/seed_dev.sql` seeds one
upcoming election, two churches, and four sample candidates for local
development — apply it the same way.

After any migration change, regenerate `src/lib/types/database.types.ts`
(Supabase MCP `generate_typescript_types`, or `supabase gen types
typescript`) — it's checked in but hand-maintained is not the goal.

### Provisioning the election committee

There's no public admin sign-up by design. To add a committee member:

1. Create their login in Supabase Auth (dashboard, or
   `supabase.auth.admin.createUser` with the service-role key).
2. `insert into admins (auth_user_id, name) values ('<their auth uid>', '<name>');`

### Email delivery

Two separate mail paths:

- **Supabase Auth's own emails** (the delegate magic link) still go through
  Supabase's default shared mailer (`noreply@mail.app.supabase.io`), which
  has unreliable deliverability to real inboxes — fine for local testing,
  not for a real election. Before going live, configure custom SMTP under
  Project Settings > Auth > SMTP Settings (Supabase docs:
  [Custom SMTP](https://supabase.com/docs/guides/auth/auth-smtp)).
- **App-triggered transactional emails** — nomination confirmation links,
  pastor vetting requests, delegate registration acknowledgements, delegate
  verification notices, and nomination outcome notices to the submitter —
  go through [Resend](https://resend.com) via `src/lib/email/send.ts`.
  Set `RESEND_API_KEY` (see `.env.local.example`) and verify both
  `rbya.cloud` (this app's own domain, currently used as the "from"
  address) and `rbya.org` (the parent org's domain, kept verified as a
  fallback/alternative) under Resend > Domains — each adds a few DNS
  records (SPF, DKIM) at wherever that domain's DNS is managed. To switch
  the "from" address between them, change `FROM_ADDRESS` in
  `src/lib/email/send.ts`. Each of these emails also has an on-screen
  link/copy-button fallback in the relevant UI in case a message bounces or
  the key isn't configured yet.

Each transactional email is sent as HTML with a plain-text fallback in the
same message (`sendEmail`'s optional `html` field in `src/lib/email/send.ts`).
The HTML is built by `renderEmailHtml()` in `src/lib/email/template.ts` — a
single branded wrapper (logo, red/gold/blue accent stripe, an optional CTA
button, and a footer signed by the election committee linking to rbya.org
and rbya.org/elections) shared by all five call sites, so changing the look
means editing that one file. Notes specific to email HTML:

- Inline styles only — email clients ignore `<style>` blocks and external
  stylesheets, and don't reliably load web fonts (hence the system font
  stack).
- The `<head>` sets `color-scheme`/`supported-color-schemes` to `light` so
  dark-mode-aware clients (Gmail, Outlook, Apple Mail) don't reprocess the
  (intentionally light) design — without this, the transparent-background
  logo washes out against a client-applied dark tint. The logo also sits in
  its own explicitly white `<table>`/`bgcolor` cell as a second layer of
  protection for clients that ignore those meta tags.
- The logo image is loaded from `${NEXT_PUBLIC_SITE_URL}/rbyaelectionstransparent.png`,
  i.e. the deployed site, not a local file — email clients can't load
  `localhost` images, so logo previews only render correctly when tested
  against the deployed site (or with `NEXT_PUBLIC_SITE_URL` pointed at it).

## Deployment

Deployed on Cloudflare Workers. Alongside the plain Next.js scripts
(`dev`/`build`/`start`, unchanged and still useful for quick local checks),
`vinext init` added Cloudflare-specific ones:

```bash
npm run dev:vinext     # dev server on the Vite/vinext toolchain
npm run build:vinext   # production build
npm run start:vinext   # run the built Worker locally under wrangler (real Workers runtime)
npm run deploy:vinext  # deploy to Cloudflare Workers
```

First-time setup:

```bash
npx wrangler login
npm run deploy:vinext
```

The Worker is bound to the custom domain `rbya.cloud` via `wrangler.jsonc`'s
`routes` block (`custom_domain: true`) — Cloudflare handles the DNS/TLS once
that domain is added to the same Cloudflare account. Public (`NEXT_PUBLIC_*`)
env vars live directly in `wrangler.jsonc`'s `vars` block, committed to the
repo — safe, since they're bundled into client JS regardless.
`NEXT_PUBLIC_SITE_URL` is already set to `https://rbya.cloud`; update it
there (and in Supabase Auth's redirect allow list — Project Settings > Auth
> URL Configuration — so magic links keep resolving correctly) if the
domain ever changes. Anything actually sensitive (e.g.
`SUPABASE_SERVICE_ROLE_KEY`, if a future feature ends up needing it) should
go in via `npx wrangler secret put SUPABASE_SERVICE_ROLE_KEY` instead,
never committed.

### Why vinext over the older OpenNext adapter

Cloudflare now recommends vinext (a Vite plugin that reimplements the
Next.js API surface) over the previously-standard `@opennextjs/cloudflare`
adapter for new migrations. `npx vinext check` reported 90% compatibility
for this app with no real blockers, and everything (dynamic routes, the
`proxy.ts` middleware/auth guard, Server Actions, the theme toggle client
component) was verified working under the actual Workers runtime
(`start:vinext`) before deploying. If a future Next.js feature turns out
to be unsupported, OpenNext remains a documented fallback path.
