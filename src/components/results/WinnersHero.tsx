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
];

type PositionResults = { position: PositionValue; results: PositionResult[] | null };

function WinnerCard({
  winner,
  candidatePhotos,
  size = 64,
}: {
  winner: PositionResult;
  candidatePhotos: Record<string, string | null>;
  size?: number;
}) {
  return (
    <div className="flex flex-col items-center gap-2 text-center">
      <Avatar imageUrl={candidatePhotos[winner.candidate_id]} name={winner.candidate_name} size={size} />
      <div className="min-w-0">
        <p className="truncate font-medium text-ink">{winner.candidate_name}</p>
        <p className="text-xs text-ink-muted">{(winner.vote_share * 100).toFixed(1)}% of the vote</p>
      </div>
    </div>
  );
}

function PositionBox({ position, results, candidatePhotos, accent }: {
  position: PositionValue;
  results: PositionResult[] | null;
  candidatePhotos: Record<string, string | null>;
  accent: string;
}) {
  const winners = results?.filter((r) => r.elected) ?? [];

  return (
    <div className="overflow-hidden rounded-lg border border-hairline bg-surface shadow-sm">
      <div className={`h-1.5 w-full ${accent}`} />
      <div className="flex flex-col items-center gap-3 p-4">
        <p className="text-xs font-semibold tracking-wide text-ink-faint uppercase">
          {positionLabel(position)}
        </p>

        {winners.length === 0 ? (
          <p className="py-3 text-sm text-ink-faint">Seat open -- no majority</p>
        ) : (
          <div className="flex flex-wrap justify-center gap-4">
            {winners.map((winner) => (
              <WinnerCard key={winner.candidate_id} winner={winner} candidatePhotos={candidatePhotos} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export function WinnersHero({
  resultsByPosition,
  candidatePhotos,
  year,
}: {
  resultsByPosition: PositionResults[];
  candidatePhotos: Record<string, string | null>;
  year: number;
}) {
  const executive = resultsByPosition.filter((p) => p.position !== "committee");
  const general = resultsByPosition.find((p) => p.position === "committee");
  const generalWinners = general?.results?.filter((r) => r.elected) ?? [];

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

        {executive.length > 0 && (
          <div className="mt-8">
            <h2 className="text-sm font-semibold tracking-wide text-ink-faint uppercase">
              Executive Committee
            </h2>
            <div className="mt-3 grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5">
              {executive.map(({ position, results }, i) => (
                <PositionBox
                  key={position}
                  position={position}
                  results={results}
                  candidatePhotos={candidatePhotos}
                  accent={ACCENT_CLASSES[i % ACCENT_CLASSES.length]}
                />
              ))}
            </div>
          </div>
        )}

        {general && (
          <details open className="group mt-8">
            <summary className="flex cursor-pointer list-none items-center gap-2 text-sm font-semibold tracking-wide text-ink-faint uppercase select-none">
              <svg
                viewBox="0 0 20 20"
                fill="currentColor"
                aria-hidden="true"
                className="h-4 w-4 transition-transform group-open:rotate-90"
              >
                <path
                  fillRule="evenodd"
                  d="M7.21 14.77a.75.75 0 01.02-1.06L11.168 10 7.23 6.29a.75.75 0 111.04-1.08l4.5 4.25a.75.75 0 010 1.08l-4.5 4.25a.75.75 0 01-1.06-.02z"
                  clipRule="evenodd"
                />
              </svg>
              General Committee
              {generalWinners.length > 0 && (
                <span className="font-normal normal-case text-ink-faint">
                  ({generalWinners.length} elected)
                </span>
              )}
            </summary>

            <div className="mt-3">
              {generalWinners.length === 0 ? (
                <div className="overflow-hidden rounded-lg border border-hairline bg-surface shadow-sm">
                  <div className={`h-1.5 w-full ${ACCENT_CLASSES[executive.length % ACCENT_CLASSES.length]}`} />
                  <p className="p-4 text-sm text-ink-faint">
                    No general committee candidate reached a majority.
                  </p>
                </div>
              ) : (
                <div className="grid grid-cols-2 gap-3 rounded-lg border border-hairline bg-surface p-4 shadow-sm sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6">
                  {generalWinners.map((winner) => (
                    <WinnerCard
                      key={winner.candidate_id}
                      winner={winner}
                      candidatePhotos={candidatePhotos}
                      size={56}
                    />
                  ))}
                </div>
              )}
            </div>
          </details>
        )}
      </div>
    </section>
  );
}
