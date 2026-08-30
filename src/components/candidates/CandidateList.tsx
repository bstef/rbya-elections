import { POSITIONS } from "@/lib/constants";
import type { Candidate } from "@/lib/types/models";
import { CandidateCard } from "./CandidateCard";

export function CandidateList({ candidates }: { candidates: Candidate[] }) {
  const byPosition = new Map<string, Candidate[]>();
  for (const candidate of candidates) {
    const list = byPosition.get(candidate.position) ?? [];
    list.push(candidate);
    byPosition.set(candidate.position, list);
  }

  const groups = POSITIONS.map((p) => ({
    ...p,
    candidates: (byPosition.get(p.value) ?? []).sort((a, b) =>
      a.name.localeCompare(b.name),
    ),
  })).filter((group) => group.candidates.length > 0);

  if (groups.length === 0) {
    return (
      <p className="text-slate-600">
        No candidates have been confirmed for this election yet.
      </p>
    );
  }

  return (
    <div className="space-y-8">
      {groups.map((group) => (
        <section key={group.value}>
          <h2 className="mb-3 text-lg font-semibold text-slate-900">{group.label}</h2>
          <div className="grid gap-3 sm:grid-cols-2">
            {group.candidates.map((candidate) => (
              <CandidateCard key={candidate.id} candidate={candidate} />
            ))}
          </div>
        </section>
      ))}
    </div>
  );
}
