import type { Candidate, CandidateState } from "@/lib/types/models";

// Mirrors the candidate_state() SQL function in
// supabase/migrations/0004_candidates.sql -- used client/server-side purely
// for display (badges), never for access control.
export function candidateState(
  c: Pick<Candidate, "ignored" | "confirmed_at" | "accepted" | "ready">,
): CandidateState {
  if (c.ignored) return "removed";
  if (c.confirmed_at && c.accepted === false) return "declined";
  if (c.accepted === true && c.ready) return "seconded";
  if (c.accepted === true && !c.ready) return "accepted";
  return "nominated";
}

export const CANDIDATE_STATE_LABELS: Record<CandidateState, string> = {
  nominated: "Awaiting confirmation",
  accepted: "Accepted",
  declined: "Declined",
  seconded: "Seconded",
  removed: "Removed",
};
