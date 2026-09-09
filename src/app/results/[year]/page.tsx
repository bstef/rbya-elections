import { notFound } from "next/navigation";
import Link from "next/link";
import { getElectionByYear } from "@/lib/election/current-election";
import { ResultsDisplay } from "@/components/results/ResultsDisplay";
import { Banner } from "@/components/ui/Card";

export default async function ArchivedResultsPage({
  params,
}: {
  params: Promise<{ year: string }>;
}) {
  const { year } = await params;
  const yearNum = Number(year);
  if (!Number.isInteger(yearNum)) notFound();

  const election = await getElectionByYear(yearNum);
  if (!election) notFound();

  return (
    <div className="space-y-8">
      <div>
        <p className="text-sm">
          <Link href="/archive" className="text-ink-muted underline hover:text-ink">
            &larr; All elections
          </Link>
        </p>
        <h1 className="mt-1 text-2xl font-bold text-ink font-display">{election.year} Results</h1>
        <p className="mt-1 text-ink-muted">
          A candidate is elected with more than 50% of ballots cast for their
          position. If fewer candidates than there are seats clear a
          majority, those seats remain open.
        </p>
      </div>

      {!election.results_published ? (
        <Banner tone="info">
          Results for the {election.year} election have not been published.
        </Banner>
      ) : (
        <ResultsDisplay election={election} />
      )}
    </div>
  );
}
