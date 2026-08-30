export const POSITIONS = [
  { value: "president", label: "President" },
  { value: "vice_president_east", label: "Vice President – East Coast" },
  { value: "vice_president_west", label: "Vice President – West Coast" },
  { value: "treasurer", label: "Treasurer" },
  { value: "controller", label: "Controller" },
  { value: "committee", label: "Committee Member" },
] as const;

export type PositionValue = (typeof POSITIONS)[number]["value"];

export function positionLabel(value: string): string {
  return POSITIONS.find((p) => p.value === value)?.label ?? value;
}

export const DELEGATE_TYPES = [
  { value: "present", label: "Present at Convention" },
  { value: "absentee", label: "Absentee ballot" },
] as const;

// RPC error codes raised by the Postgres functions in
// supabase/migrations/0010_rpc_functions.sql, mapped to copy shown to users.
export const RPC_ERROR_MESSAGES: Record<string, string> = {
  no_current_election:
    "There is no active election right now. Please check back later.",
  nominations_closed: "The nomination window for this election is closed.",
  invalid_token:
    "We couldn't find a nomination matching that link. If you think this is a mistake, please contact the election committee.",
  confirmation_window_closed:
    "The confirmation window for this nomination has passed.",
  already_confirmed: "This nomination has already been confirmed.",
  candidate_not_found: "We couldn't find that candidate.",
  no_delegates_provided: "Please add at least one delegate.",
  not_a_registered_delegate:
    "We don't have you registered as a verified delegate for this election yet. Please check with your church.",
  voting_closed: "Voting is not currently open.",
  absentee_deadline_passed: "The absentee ballot deadline has passed.",
  unknown_position: "That position isn't configured for this election.",
  too_many_selections: "You selected more candidates than this position allows.",
  invalid_candidate_selection:
    "One or more selected candidates are not eligible for this position.",
  already_voted: "You've already submitted a ballot for this position.",
  results_not_published: "Results have not been published yet.",
  not_authorized: "You're not authorized to perform this action.",
  election_not_found: "We couldn't find that election.",
};

export function messageForRpcError(error: { message?: string } | null | undefined): string {
  if (!error?.message) return "Something went wrong. Please try again.";
  const code = Object.keys(RPC_ERROR_MESSAGES).find((key) =>
    error.message!.includes(key),
  );
  return code ? RPC_ERROR_MESSAGES[code] : error.message;
}
