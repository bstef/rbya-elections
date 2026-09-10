import Link from "next/link";

export const metadata = {
  title: "About This Project — RBYA Elections",
  description:
    "What RBYA Elections is, why it was rebuilt, and how it works under the hood.",
};

export default function ProjectPage() {
  return (
    <div className="mx-auto max-w-2xl space-y-8">
      <div>
        <p className="text-sm font-medium tracking-wide text-ink-faint uppercase">
          Behind the scenes
        </p>
        <h1 className="mt-1 text-2xl font-bold text-ink font-display">About This Project</h1>
        <p className="mt-1 text-ink-muted">
          What this site is, why it exists, and how it&apos;s built -- for the
          committee, or anyone curious.
        </p>
      </div>

      <section>
        <h2 className="mb-2 font-semibold text-ink">What it replaced</h2>
        <p className="text-ink-muted">
          RBYA used to run its annual committee election on a 2017-era
          ASP.NET app with no real login for anyone -- voters were identified
          by a hash of their email stored in a session, and there was no
          admin login at all, just an unlisted moderation URL. Ballots were
          stored one row per candidate rather than one row per position,
          which meant nothing technically stopped a delegate from approving
          multiple candidates for a single-seat race. This app is a full
          rebuild: real accounts for both delegates and the election
          committee, and a ballot design where double-voting or
          over-selecting candidates is rejected by the database itself, not
          cleaned up after the fact.
        </p>
      </section>

      <section>
        <h2 className="mb-2 font-semibold text-ink">What it does</h2>
        <p className="text-ink-muted">
          The same nomination &rarr; confirmation &rarr; comment &rarr; vote
          &rarr; results flow the organization already knows, plus a few
          things the old app never had: church-based delegate self-registration
          with committee verification, a{" "}
          <Link href="/archive" className="underline hover:text-ink">
            historical archive
          </Link>{" "}
          so past years&apos; candidates and results stay browsable instead of
          disappearing, and a{" "}
          <Link href="/results" className="underline hover:text-ink">
            results page
          </Link>{" "}
          that leads with who actually won -- executive positions front and
          center, the larger general committee tucked into a collapsible
          section -- before the full vote tables.
        </p>
      </section>

      <section>
        <h2 className="mb-2 font-semibold text-ink">How it&apos;s built</h2>
        <p className="text-ink-muted">
          Next.js (TypeScript, App Router) for the app, Supabase (Postgres,
          Auth, Row Level Security, Storage) for the backend, deployed on
          Cloudflare Workers. Delegates log in passwordlessly by email;
          the election committee gets a real email-and-password login,
          provisioned by hand rather than public sign-up. Every public
          write -- a nomination, a comment, a delegate registration, a
          ballot -- goes through a Postgres function that enforces its own
          rules (is the nomination window open, has this delegate already
          voted for this position, is this within the seat limit) so the
          rules can&apos;t be bypassed by calling the API directly.
        </p>
      </section>

      <section>
        <h2 className="mb-2 font-semibold text-ink">Why Cloudflare</h2>
        <p className="text-ink-muted">
          This site sees almost all of its traffic in one short window
          around Convention each year. It launched on Vercel, then moved to
          Cloudflare Workers&apos; free tier -- there was no reason to pay for a
          plan sized for year-round traffic when the real usage pattern is
          one busy month and then quiet for the rest of the year.
        </p>
      </section>

      <p className="text-sm text-ink-faint">
        Source lives on{" "}
        <a
          href="https://github.com/bstef/rbya-elections"
          target="_blank"
          rel="noopener noreferrer"
          className="underline hover:text-ink"
        >
          GitHub
        </a>
        .
      </p>
    </div>
  );
}
