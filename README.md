# RBYA Elections

Nomination, delegate registration, and voting for RBYA (Romanian Baptist
Youth Association) committee elections. A rebuild of the org's old ASP.NET
Core election app, with real authentication for both voters and the
election committee, and a ballot that's correct by construction rather than
cleaned up after the fact.

Stack: Next.js (TypeScript, App Router) + Supabase (Postgres, Auth, RLS),
deployed on Vercel.

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
  and publish results.

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

### Known limitation: email delivery

Supabase's default shared mailer (`noreply@mail.app.supabase.io`) has
unreliable deliverability to real inboxes — fine for local testing, not for
a real election. Before going live, configure custom SMTP under
Project Settings > Auth > SMTP Settings (Supabase docs:
[Custom SMTP](https://supabase.com/docs/guides/auth/auth-smtp)), which
covers both the delegate magic-link email and any future auth emails.
Nomination-confirmation and delegate-registration notification emails
(distinct from Supabase Auth's own emails) aren't wired up yet — see
`src/lib/email/send.ts`, currently a stub.

## Deployment

Deployed on Vercel. Set the same environment variables from `.env.local`
in the Vercel project settings (`NEXT_PUBLIC_SUPABASE_URL`,
`NEXT_PUBLIC_SUPABASE_ANON_KEY`, `NEXT_PUBLIC_SITE_URL` set to the
production URL, and `SUPABASE_SERVICE_ROLE_KEY` only if a future feature
needs it). Also add the production URL to Supabase Auth's redirect allow
list (Project Settings > Auth > URL Configuration) so magic links resolve
correctly.
