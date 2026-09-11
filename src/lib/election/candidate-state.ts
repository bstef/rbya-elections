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

// Green for community-endorsed, red for declined, neutral gray for a
// withdrawn/ignored candidate so it doesn't read as the same "rejected by
// the nominee" signal that red carries for "Declined".
export const CANDIDATE_STATE_BADGE_CLASSES: Record<CandidateState, string> = {
  nominated: "bg-surface-muted text-ink-muted",
  accepted: "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200",
  seconded: "bg-emerald-100 text-emerald-800 dark:bg-emerald-900 dark:text-emerald-200",
  declined: "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200",
  removed: "bg-zinc-200 text-zinc-700 dark:bg-zinc-800 dark:text-zinc-300",
};
