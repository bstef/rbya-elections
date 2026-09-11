import Link from "next/link";
import { getCurrentElection } from "@/lib/election/current-election";
import { ResultsDisplay } from "@/components/results/ResultsDisplay";
import { Banner } from "@/components/ui/Card";

export default async function ResultsPage() {
  const election = await getCurrentElection();

  if (!election) {
    return <Banner tone="warning">There is no active election right now.</Banner>;
  }

  if (!election.results_published) {
    return (
      <div className="space-y-4">
        <h1 className="text-2xl font-bold tracking-tight text-ink font-sans">{election.year} Results</h1>
        <Banner tone="info">
          Results for the {election.year} election have not been published yet.
        </Banner>
        <p className="text-sm">
          <Link href="/archive" className="text-ink-muted underline hover:text-ink">
            Browse past elections
          </Link>
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <ResultsDisplay election={election} />

      <div className="rounded-lg border border-hairline bg-surface-muted p-4">
        <p className="text-xs font-semibold tracking-wide text-ink-faint uppercase">Note</p>
        <p className="mt-1 text-sm text-ink-muted">
          A candidate is elected with more than 50% of ballots cast for their
          position. If fewer candidates than there are seats clear a
          majority, those seats remain open.{" "}
          <Link href="/archive" className="underline hover:text-ink">
            Browse past elections
          </Link>
          .
        </p>
      </div>
    </div>
  );
}
