import Link from "next/link";
import { getCurrentElection } from "@/lib/election/current-election";
import { ResultsDisplay } from "@/components/results/ResultsDisplay";
import { Banner } from "@/components/ui/Card";

export default async function ResultsPage() {
  const election = await getCurrentElection();

  if (!election) {
    return <Banner tone="warning">There is no active election right now.</Banner>;
  }

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold text-ink font-display">{election.year} Results</h1>
        <p className="mt-1 text-ink-muted">
          A candidate is elected with more than 50% of ballots cast for their
          position. If fewer candidates than there are seats clear a
          majority, those seats remain open.
        </p>
        <p className="mt-2 text-sm">
          <Link href="/archive" className="text-ink-muted underline hover:text-ink">
            Browse past elections
          </Link>
        </p>
      </div>

      {!election.results_published ? (
        <Banner tone="info">
          Results for the {election.year} election have not been published yet.
        </Banner>
      ) : (
        <ResultsDisplay election={election} />
      )}
    </div>
  );
}
