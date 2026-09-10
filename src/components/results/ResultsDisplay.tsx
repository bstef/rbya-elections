import { getElectionPositions } from "@/lib/election/current-election";
import { getPositionResults } from "@/lib/election/results";
import { positionLabel } from "@/lib/constants";
import { createClient } from "@/lib/supabase/server";
import { WinnersHero } from "@/components/results/WinnersHero";
import type { Election } from "@/lib/types/models";

// Shared by /results (current election) and /results/[year] (archive) --
// both just resolve an Election row differently and hand it here.
export async function ResultsDisplay({ election }: { election: Election }) {
  const positions = await getElectionPositions(election.id);
  const resultsByPosition = await Promise.all(
    positions.map(async (p) => ({
      position: p.position,
      results: await getPositionResults(election.id, p.position),
    })),
  );

  const supabase = await createClient();
  const { data: candidates } = await supabase
    .from("candidates")
    .select("id, image_url")
    .eq("election_id", election.id);
  const candidatePhotos = Object.fromEntries(
    (candidates ?? []).map((c) => [c.id, c.image_url]),
  );

  return (
    <div className="space-y-8">
      <WinnersHero
        resultsByPosition={resultsByPosition}
        candidatePhotos={candidatePhotos}
        year={election.year}
      />

      {resultsByPosition.map(({ position, results }) => (
        <section key={position}>
          <h2 className="mb-3 text-lg font-semibold text-ink">{positionLabel(position)}</h2>
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
                    <th className="px-4 py-2">Result</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-hairline">
                  {results.map((r) => (
                    <tr key={r.candidate_id}>
                      <td className="px-4 py-2 font-medium text-ink">{r.candidate_name}</td>
                      <td className="px-4 py-2 text-ink-muted">{r.vote_count}</td>
                      <td className="px-4 py-2 text-ink-muted">
                        {(r.vote_share * 100).toFixed(1)}%
                      </td>
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
