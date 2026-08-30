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
        <h1 className="text-3xl font-bold tracking-tight text-slate-900">
          RBYA Committee Elections
        </h1>
        <p className="mt-2 text-slate-600">
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

      <div className="grid gap-4 sm:grid-cols-2">
        <ActionCard
          title="Nominate a candidate"
          description="Submit a nomination for a committee position. Nominees confirm by email before appearing publicly."
          href="/nominate"
          cta="Start a nomination"
        />
        <ActionCard
          title="View candidates"
          description="See who has been nominated and accepted, grouped by position, and leave a note of support."
          href="/candidates"
          cta="View candidates"
        />
        <ActionCard
          title="Register your church's delegates"
          description="Submit your church's delegate list ahead of Convention so they can vote."
          href="/delegates/register"
          cta="Register delegates"
        />
        <ActionCard
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

function ActionCard({
  title,
  description,
  href,
  cta,
}: {
  title: string;
  description: string;
  href: string;
  cta: string;
}) {
  return (
    <div className="flex flex-col justify-between rounded-lg border border-slate-200 bg-white p-6 shadow-sm">
      <div>
        <h2 className="font-semibold text-slate-900">{title}</h2>
        <p className="mt-1 text-sm text-slate-600">{description}</p>
      </div>
      <Link
        href={href}
        className="mt-4 inline-flex w-fit items-center justify-center rounded-md border border-slate-300 bg-white px-4 py-2 text-sm font-medium text-slate-900 hover:bg-slate-50"
      >
        {cta}
      </Link>
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
