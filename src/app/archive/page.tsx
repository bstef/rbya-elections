import Link from "next/link";
import { getAllElections } from "@/lib/election/current-election";
import { Card } from "@/components/ui/Card";

export default async function ArchivePage() {
  const elections = await getAllElections();

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-ink font-display">Past Elections</h1>
        <p className="mt-1 text-ink-muted">
          Every RBYA committee election held through this site, with its
          candidates and results.
        </p>
      </div>

      {elections.length === 0 ? (
        <p className="text-sm text-ink-faint">No elections on record yet.</p>
      ) : (
        <div className="space-y-3">
          {elections.map((election) => (
            <Card key={election.id} className="flex flex-wrap items-center justify-between gap-3">
              <div>
                <p className="font-semibold text-ink">
                  {election.year}{" "}
                  {election.is_current && (
                    <span className="ml-1 rounded-full bg-emerald-100 px-2 py-0.5 text-xs font-medium text-emerald-800 dark:bg-emerald-900 dark:text-emerald-200">
                      Current
                    </span>
                  )}
                </p>
                <p className="text-sm text-ink-faint">
                  {election.results_published ? "Results published" : "Results not yet published"}
                </p>
              </div>
              <div className="flex items-center gap-2 text-sm">
                <Link
                  href={`/candidates/year/${election.year}`}
                  className="rounded-md border border-hairline px-3 py-2 font-medium text-ink hover:bg-page"
                >
                  Candidates
                </Link>
                <Link
                  href={`/results/${election.year}`}
                  className="rounded-md border border-hairline px-3 py-2 font-medium text-ink hover:bg-page"
                >
                  Results
                </Link>
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
