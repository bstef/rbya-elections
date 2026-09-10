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

  const backLink = (
    <p className="text-sm">
      <Link href="/archive" className="text-ink-muted underline hover:text-ink">
        &larr; All elections
      </Link>
    </p>
  );

  if (!election.results_published) {
    return (
      <div className="space-y-4">
        {backLink}
        <h1 className="text-2xl font-bold text-ink font-display">{election.year} Results</h1>
        <Banner tone="info">
          Results for the {election.year} election have not been published.
        </Banner>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {backLink}
      <p className="text-sm text-ink-muted">
        A candidate is elected with more than 50% of ballots cast for their
        position. If fewer candidates than there are seats clear a majority,
        those seats remain open.
      </p>
      <ResultsDisplay election={election} />
    </div>
  );
}
