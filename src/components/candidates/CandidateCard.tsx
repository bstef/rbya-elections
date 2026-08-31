import Link from "next/link";
import type { Candidate } from "@/lib/types/models";
import { candidateState, CANDIDATE_STATE_LABELS } from "@/lib/election/candidate-state";
import { Avatar } from "@/components/ui/Avatar";

const STATE_BADGE_CLASSES: Record<string, string> = {
  seconded: "bg-emerald-100 dark:bg-emerald-900 text-emerald-800 dark:text-emerald-200",
  accepted: "bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200",
  nominated: "bg-surface-muted text-ink-muted",
  declined: "bg-red-100 dark:bg-red-900 text-red-800 dark:text-red-200",
  removed: "bg-red-100 dark:bg-red-900 text-red-800 dark:text-red-200",
};

export function CandidateCard({ candidate }: { candidate: Candidate }) {
  const state = candidateState(candidate);

  return (
    <Link
      href={`/candidates/${candidate.id}`}
      className="block rounded-lg border border-hairline bg-surface p-4 shadow-sm transition-shadow hover:shadow-md"
    >
      <div className="flex items-start gap-3">
        <Avatar imageUrl={candidate.image_url} name={candidate.name} size={40} />
        <div className="min-w-0 flex-1">
          <div className="flex items-start justify-between gap-2">
            <h3 className="font-semibold text-ink">{candidate.name}</h3>
            <span
              className={`shrink-0 rounded-full px-2 py-0.5 text-xs font-medium ${STATE_BADGE_CLASSES[state]}`}
            >
              {CANDIDATE_STATE_LABELS[state]}
            </span>
          </div>
          <p className="mt-1 text-sm text-ink-muted">
            {candidate.church} &middot; {candidate.location}
          </p>
        </div>
      </div>
      {candidate.pastor_approved === true && (
        <span className="mt-2 inline-flex items-center gap-1 rounded-full bg-emerald-100 px-2 py-0.5 text-xs font-medium text-emerald-800 dark:bg-emerald-900 dark:text-emerald-200">
          ✓ Pastor Vetted
        </span>
      )}
    </Link>
  );
}
