import Link from "next/link";
import type { Candidate } from "@/lib/types/models";
import { candidateState, CANDIDATE_STATE_LABELS } from "@/lib/election/candidate-state";

const STATE_BADGE_CLASSES: Record<string, string> = {
  seconded: "bg-emerald-100 text-emerald-800",
  accepted: "bg-blue-100 text-blue-800",
  nominated: "bg-slate-100 text-slate-700",
  declined: "bg-red-100 text-red-800",
  removed: "bg-red-100 text-red-800",
};

export function CandidateCard({ candidate }: { candidate: Candidate }) {
  const state = candidateState(candidate);

  return (
    <Link
      href={`/candidates/${candidate.id}`}
      className="block rounded-lg border border-slate-200 bg-white p-4 shadow-sm transition-shadow hover:shadow-md"
    >
      <div className="flex items-start justify-between gap-2">
        <h3 className="font-semibold text-slate-900">{candidate.name}</h3>
        <span
          className={`shrink-0 rounded-full px-2 py-0.5 text-xs font-medium ${STATE_BADGE_CLASSES[state]}`}
        >
          {CANDIDATE_STATE_LABELS[state]}
        </span>
      </div>
      <p className="mt-1 text-sm text-slate-600">
        {candidate.church} &middot; {candidate.location}
      </p>
    </Link>
  );
}
