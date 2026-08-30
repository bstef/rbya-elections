import type { Election } from "@/lib/types/models";

// Pure, timezone-agnostic (all comparisons are against real timestamptz
// instants) window checks. These mirror the checks enforced server-side in
// the submit_nomination / confirm_candidate / submit_ballot RPCs -- this
// module exists purely to drive UI copy/disabled-state; it is NOT the
// security boundary (the RPCs are).

export function nominationsAreOpen(election: Election, now = new Date()): boolean {
  return (
    now >= new Date(election.nomination_opens_at) &&
    now <= new Date(election.nomination_cutoff_at)
  );
}

export function confirmationIsOpen(election: Election, now = new Date()): boolean {
  return now <= new Date(election.confirmation_cutoff_at);
}

export function votingIsOpen(election: Election, now = new Date()): boolean {
  return (
    now >= new Date(election.voting_opens_at) &&
    now <= new Date(election.voting_closes_at)
  );
}

export function absenteeDeadlineHasPassed(
  election: Election,
  now = new Date(),
): boolean {
  return now > new Date(election.absentee_ballot_deadline);
}

export function delegateQuota(youthCount: number): number {
  return Math.ceil(youthCount / 10);
}
