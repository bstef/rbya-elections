import { Avatar } from "@/components/ui/Avatar";
import { positionLabel } from "@/lib/constants";
import type { PositionResult } from "@/lib/types/models";
import type { PositionValue } from "@/lib/constants";

const ACCENT_CLASSES = [
  "bg-blue-500",
  "bg-violet-500",
  "bg-amber-500",
  "bg-emerald-500",
  "bg-rose-500",
  "bg-cyan-500",
];

export function WinnersHero({
  resultsByPosition,
  candidatePhotos,
  year,
}: {
  resultsByPosition: { position: PositionValue; results: PositionResult[] | null }[];
  candidatePhotos: Record<string, string | null>;
  year: number;
}) {
  const anyWinners = resultsByPosition.some(({ results }) =>
    results?.some((r) => r.elected),
  );

  return (
    <section className="relative overflow-hidden rounded-2xl border border-hairline bg-surface px-6 py-10 sm:px-10 sm:py-12">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 bg-gradient-to-br from-blue-50 via-transparent to-amber-50 dark:from-blue-950/50 dark:via-transparent dark:to-transparent"
      />
      <div className="relative">
        <p className="text-sm font-medium tracking-wide text-ink-faint uppercase">
          {year} Election
        </p>
        <h1 className="mt-1 text-3xl font-bold tracking-tight text-ink font-display sm:text-4xl">
          Committee Results
        </h1>

        {!anyWinners ? (
          <p className="mt-6 max-w-xl text-ink-muted">
            No candidate reached the majority required to be elected this
            year -- every seat below remains open.
          </p>
        ) : (
          <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {resultsByPosition.map(({ position, results }, i) => {
              const winners = results?.filter((r) => r.elected) ?? [];
              return (
                <div
                  key={position}
                  className="overflow-hidden rounded-lg border border-hairline bg-surface shadow-sm"
                >
                  <div className={`h-1.5 w-full ${ACCENT_CLASSES[i % ACCENT_CLASSES.length]}`} />
                  <div className="p-4">
                    <p className="text-xs font-semibold tracking-wide text-ink-faint uppercase">
                      {positionLabel(position)}
                    </p>

                    {winners.length === 0 ? (
                      <p className="mt-3 text-sm text-ink-faint">Seat open -- no majority</p>
                    ) : (
                      <ul className="mt-3 space-y-3">
                        {winners.map((winner) => (
                          <li key={winner.candidate_id} className="flex items-center gap-3">
                            <Avatar
                              imageUrl={candidatePhotos[winner.candidate_id]}
                              name={winner.candidate_name}
                              size={40}
                            />
                            <div className="min-w-0">
                              <p className="truncate font-medium text-ink">
                                {winner.candidate_name}
                              </p>
                              <p className="text-xs text-ink-muted">
                                {(winner.vote_share * 100).toFixed(1)}% of the vote
                              </p>
                            </div>
                          </li>
                        ))}
                      </ul>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </section>
  );
}
