import { getCurrentElection, getElectionPositions } from "@/lib/election/current-election";
import { getPositionResults } from "@/lib/election/results";
import { positionLabel } from "@/lib/constants";
import { PublishResultsButton } from "@/components/admin/PublishResultsButton";
import { Banner } from "@/components/ui/Card";

export default async function AdminResultsPage() {
  const election = await getCurrentElection();

  if (!election) {
    return <Banner tone="warning">No election is marked current.</Banner>;
  }

  const positions = await getElectionPositions(election.id);
  const resultsByPosition = await Promise.all(
    positions.map(async (p) => ({
      position: p.position,
      results: await getPositionResults(election.id, p.position),
    })),
  );

  return (
    <div className="space-y-8">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold text-ink font-display">{election.year} Results</h1>
          <p className="mt-1 text-ink-muted">
            A candidate is elected with &gt;50% of ballots cast for their
            position, ranked within the seat count -- unfilled majorities
            leave a seat vacant rather than backfilling with a plurality.
          </p>
        </div>
        <PublishResultsButton electionId={election.id} published={election.results_published} />
      </div>

      {!election.results_published && (
        <Banner tone="info">
          Results are only visible to admins right now. The public /results
          page won&apos;t show numbers until you publish.
        </Banner>
      )}

      {resultsByPosition.map(({ position, results }) => (
        <section key={position}>
          <h2 className="mb-3 text-lg font-semibold text-ink">
            {positionLabel(position)}
          </h2>
          {!results || results.length === 0 ? (
            <p className="text-sm text-ink-faint">No ballots were cast for this position.</p>
          ) : (
            <div className="overflow-x-auto rounded-lg border border-hairline bg-surface">
              <table className="min-w-full divide-y divide-hairline text-sm">
                <thead className="bg-page text-left text-ink-faint">
                  <tr>
                    <th className="px-4 py-2">Candidate</th>
                    <th className="px-4 py-2">Votes</th>
                    <th className="px-4 py-2">Share</th>
                    <th className="px-4 py-2">Rank</th>
                    <th className="px-4 py-2">Result</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-hairline">
                  {results.map((r) => (
                    <tr key={r.candidate_id}>
                      <td className="px-4 py-2 font-medium text-ink">
                        {r.candidate_name}
                      </td>
                      <td className="px-4 py-2 text-ink-muted">{r.vote_count}</td>
                      <td className="px-4 py-2 text-ink-muted">
                        {(r.vote_share * 100).toFixed(1)}%
                      </td>
                      <td className="px-4 py-2 text-ink-muted">{r.rank_by_votes}</td>
                      <td className="px-4 py-2">
                        {r.elected ? (
                          <span className="rounded-full bg-emerald-100 dark:bg-emerald-900 px-2 py-0.5 text-xs font-medium text-emerald-800 dark:text-emerald-200">
                            Elected
                          </span>
                        ) : (
                          <span className="rounded-full bg-surface-muted px-2 py-0.5 text-xs font-medium text-ink-muted">
                            Not elected
                          </span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </section>
      ))}
    </div>
  );
}
