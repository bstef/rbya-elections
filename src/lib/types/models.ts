// Hand-written row types mirroring supabase/migrations/*.sql.
// TODO: replace with generated types (Supabase MCP `generate_typescript_types`)
// once the project exists; keep shapes in sync with the migrations until then.

import type { PositionValue } from "@/lib/constants";

export type ElectionStatus =
  | "draft"
  | "nominations_open"
  | "nominations_closed"
  | "voting_open"
  | "voting_closed"
  | "completed";

export type DelegateType = "present" | "absentee";
export type CommentType = "positive" | "negative";

export interface Election {
  id: string;
  year: number;
  election_day: string;
  nomination_opens_at: string;
  nomination_cutoff_at: string;
  confirmation_cutoff_at: string;
  absentee_ballot_deadline: string;
  voting_opens_at: string;
  voting_closes_at: string;
  status: ElectionStatus;
  is_current: boolean;
  results_published: boolean;
  created_at: string;
}

export interface ElectionPosition {
  election_id: string;
  position: PositionValue;
  seats: number;
}

export interface Candidate {
  id: string;
  election_id: string;
  position: PositionValue;
  name: string;
  church: string;
  location: string;
  email: string;
  background: string;
  reasons: string;
  submitter_name: string;
  submitter_email: string;
  image_url: string | null;
  pastor_contact: string | null;
  confirm_token: string;
  confirmed_at: string | null;
  accepted: boolean | null;
  ready: boolean;
  ignored: boolean;
  created_at: string;
}

export type CandidateState =
  | "nominated"
  | "accepted"
  | "declined"
  | "seconded"
  | "removed";

export interface Comment {
  id: string;
  candidate_id: string;
  type: CommentType;
  content: string;
  submitter_name: string;
  submitter_email: string;
  created_at: string;
}

export interface Church {
  id: string;
  name: string;
  city_state: string | null;
  pastor_name: string | null;
  youth_leader_name: string | null;
  created_at: string;
}

export interface Delegate {
  id: string;
  election_id: string;
  church_id: string;
  name: string;
  email: string;
  delegate_type: DelegateType;
  verified: boolean;
  auth_user_id: string | null;
  registered_by_name: string | null;
  registered_by_email: string | null;
  created_at: string;
}

export interface Ballot {
  id: string;
  election_id: string;
  delegate_id: string;
  position: PositionValue;
  submitted_at: string;
}

export interface PositionResult {
  candidate_id: string;
  candidate_name: string;
  vote_count: number;
  total_ballots: number;
  vote_share: number;
  seats: number;
  rank_by_votes: number;
  elected: boolean;
}
