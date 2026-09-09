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
    <div className="space-y-8">
      <div>
        <h1 className="text-4xl font-bold tracking-tight text-ink font-display sm:text-5xl">
          RBYA Committee Elections
        </h1>
        <p className="mt-3 max-w-2xl text-lg text-ink-muted">
          Nominate a candidate, register your church&apos;s delegates, and cast your
          ballot -- all in one place.
        </p>
      </div>

      {election ? (
        <PhaseBanner election={election} />
      ) : (
        <Banner tone="warning">
          There is no active election configured right now. Please check back
          later, or contact the election committee.
        </Banner>
      )}

      <div className="grid gap-5 sm:grid-cols-2">
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
          <h2 className="font-semibold text-ink">{title}</h2>
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
