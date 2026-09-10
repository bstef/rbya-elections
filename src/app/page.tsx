import Link from "next/link";
import { getCurrentElection } from "@/lib/election/current-election";
import {
  nominationsAreOpen,
  votingIsOpen,
  confirmationIsOpen,
} from "@/lib/election/eligibility";
import { Banner } from "@/components/ui/Card";
import type { Election } from "@/lib/types/models";

export default async function HomePage() {
  const election = await getCurrentElection();

  return (
    <div className="space-y-10">
      <section className="relative overflow-hidden rounded-2xl border border-hairline bg-surface px-6 py-12 sm:px-12 sm:py-16">
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 bg-gradient-to-br from-blue-50 via-transparent to-amber-50 dark:from-blue-950/50 dark:via-transparent dark:to-transparent"
        />

        {/* Decorative ballot-box motif, echoing the logo -- a quiet visual
            cue for "elections" rather than a literal photo. */}
        <svg
          viewBox="0 0 200 200"
          aria-hidden="true"
          className="pointer-events-none absolute -bottom-8 -right-8 h-56 w-56 text-blue-900/10 dark:text-blue-100/10 sm:h-72 sm:w-72"
        >
          <rect x="30" y="85" width="140" height="95" rx="10" stroke="currentColor" strokeWidth="6" fill="none" />
          <path d="M30 110h140" stroke="currentColor" strokeWidth="6" />
          <line x1="70" y1="85" x2="130" y2="85" stroke="currentColor" strokeWidth="6" />
          <g transform="rotate(-10 100 50)">
            <rect x="72" y="15" width="56" height="72" rx="5" stroke="currentColor" strokeWidth="6" fill="none" />
            <path
              d="M85 52l11 11 20-26"
              stroke="currentColor"
              strokeWidth="6"
              strokeLinecap="round"
              strokeLinejoin="round"
              fill="none"
            />
          </g>
        </svg>

        <div className="relative">
          <h1 className="text-3xl font-bold tracking-tight text-ink font-display sm:text-nowrap sm:text-5xl md:text-6xl">
            RBYA Committee Elections
          </h1>
          <p className="mt-4 max-w-xl text-lg text-ink-muted sm:text-xl">
            Nominate a candidate, register your church&apos;s delegates, and cast
            your ballot -- all in one place.
          </p>

          <div className="mt-6 flex flex-wrap gap-3">
            <Link
              href="/candidates"
              className="rounded-md bg-blue-950 px-5 py-2.5 text-sm font-medium text-white transition-colors hover:bg-blue-800 dark:bg-blue-100 dark:text-blue-950 dark:hover:bg-blue-200"
            >
              View candidates
            </Link>
            <Link
              href="/nominate"
              className="rounded-md border border-hairline bg-surface px-5 py-2.5 text-sm font-medium text-ink transition-colors hover:bg-page"
            >
              Start a nomination
            </Link>
          </div>

          <div className="mt-8 max-w-xl">
            {election ? (
              <PhaseBanner election={election} />
            ) : (
              <Banner tone="warning">
                There is no active election configured right now. Please
                check back later, or contact the election committee.
              </Banner>
            )}
          </div>
        </div>
      </section>

      <div>
        <h2 className="text-xl font-semibold text-ink">Get started</h2>
        <div className="mt-4 grid gap-5 sm:grid-cols-2">
          <ActionCard
            accent="blue"
            title="Nominate a candidate"
            description="Submit a nomination for a committee position. Nominees confirm by email before appearing publicly."
            href="/nominate"
            cta="Start a nomination"
          />
          <ActionCard
            accent="violet"
            title="View candidates"
            description="See who has been nominated and accepted, grouped by position, and leave a note of support."
            href="/candidates"
            cta="View candidates"
          />
          <ActionCard
            accent="amber"
            title="Register your church's delegates"
            description="Submit your church's delegate list ahead of Convention so they can vote."
            href="/delegates/register"
            cta="Register delegates"
          />
          <ActionCard
            accent="emerald"
            title="Vote"
            description="Registered delegates can log in with their email to cast a ballot."
            href="/login"
            cta="Delegate login"
          />
        </div>
      </div>
    </div>
  );
}

function PhaseBanner({ election }: { election: Election }) {
  const notices: string[] = [];

  if (nominationsAreOpen(election)) {
    notices.push(
      `Nominations are open through ${formatDate(election.nomination_cutoff_at)}.`,
    );
  } else if (confirmationIsOpen(election)) {
    notices.push("Nominations are closed; nominees may still be confirming.");
  }

  if (votingIsOpen(election)) {
    notices.push(`Voting is open through ${formatDate(election.voting_closes_at)}.`);
  }

  if (election.results_published) {
    notices.push("Results have been published.");
  }

  if (notices.length === 0) {
    notices.push(
      `${election.year} election -- nominations and voting are not currently open.`,
    );
  }

  return (
    <Banner tone="info">
      <div className="space-y-1">
        {notices.map((notice) => (
          <p key={notice}>{notice}</p>
        ))}
      </div>
    </Banner>
  );
}

const ACCENT_CLASSES = {
  blue: "bg-blue-500",
  violet: "bg-violet-500",
  amber: "bg-amber-500",
  emerald: "bg-emerald-500",
} as const;

function ActionCard({
  title,
  description,
  href,
  cta,
  accent,
}: {
  title: string;
  description: string;
  href: string;
  cta: string;
  accent: keyof typeof ACCENT_CLASSES;
}) {
  return (
    <div className="group flex flex-col justify-between overflow-hidden rounded-lg border border-hairline bg-surface shadow-sm transition-all hover:-translate-y-0.5 hover:shadow-md">
      <div className={`h-1.5 w-full ${ACCENT_CLASSES[accent]}`} />
      <div className="flex flex-1 flex-col justify-between p-6">
        <div>
          <h3 className="font-semibold text-ink">{title}</h3>
          <p className="mt-1 text-sm text-ink-muted">{description}</p>
        </div>
        <Link
          href={href}
          className="mt-4 inline-flex w-fit items-center justify-center rounded-md border border-hairline bg-surface px-4 py-2 text-sm font-medium text-ink transition-colors hover:bg-page group-hover:border-ink-faint"
        >
          {cta}
        </Link>
      </div>
    </div>
  );
}

function formatDate(value: string): string {
  return new Date(value).toLocaleDateString(undefined, {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}
