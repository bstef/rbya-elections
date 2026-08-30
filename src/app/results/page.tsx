import { getCurrentElection, getElectionPositions } from "@/lib/election/current-election";
import { getPositionResults } from "@/lib/election/results";
import { positionLabel } from "@/lib/constants";
import { Banner } from "@/components/ui/Card";

export default async function ResultsPage() {
  const election = await getCurrentElection();

  if (!election) {
    return <Banner tone="warning">There is no active election right now.</Banner>;
  }

  if (!election.results_published) {
    return (
      <Banner tone="info">
        Results for the {election.year} election have not been published yet.
      </Banner>
    );
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
      <div>
        <h1 className="text-2xl font-bold text-slate-900">{election.year} Results</h1>
        <p className="mt-1 text-slate-600">
          A candidate is elected with more than 50% of ballots cast for their
          position. If fewer candidates than there are seats clear a
          majority, those seats remain open.
        </p>
      </div>

      {resultsByPosition.map(({ position, results }) => (
        <section key={position}>
          <h2 className="mb-3 text-lg font-semibold text-slate-900">
            {positionLabel(position)}
          </h2>
          {!results || results.length === 0 ? (
            <p className="text-sm text-slate-500">No ballots were cast for this position.</p>
          ) : (
            <div className="overflow-x-auto rounded-lg border border-slate-200 bg-white">
              <table className="min-w-full divide-y divide-slate-200 text-sm">
                <thead className="bg-slate-50 text-left text-slate-500">
                  <tr>
                    <th className="px-4 py-2">Candidate</th>
                    <th className="px-4 py-2">Votes</th>
                    <th className="px-4 py-2">Share</th>
                    <th className="px-4 py-2">Result</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {results.map((r) => (
                    <tr key={r.candidate_id}>
                      <td className="px-4 py-2 font-medium text-slate-900">
                        {r.candidate_name}
                      </td>
                      <td className="px-4 py-2 text-slate-700">{r.vote_count}</td>
                      <td className="px-4 py-2 text-slate-700">
                        {(r.vote_share * 100).toFixed(1)}%
                      </td>
                      <td className="px-4 py-2">
                        {r.elected ? (
                          <span className="rounded-full bg-emerald-100 px-2 py-0.5 text-xs font-medium text-emerald-800">
                            Elected
                          </span>
                        ) : (
                          <span className="rounded-full bg-slate-100 px-2 py-0.5 text-xs font-medium text-slate-600">
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
