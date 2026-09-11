import "server-only";
import { createClient } from "@/lib/supabase/server";
import { getElectionPositions } from "@/lib/election/current-election";
import { getPositionResults } from "@/lib/election/results";
import { POSITIONS, positionLabel } from "@/lib/constants";
import type { Candidate } from "@/lib/types/models";

export interface RosterName {
  name: string;
  church?: string | null;
  votes?: number;
  voteShare?: number;
  elected?: boolean;
}

export interface RosterPosition {
  position: string;
  positionLabel: string;
  names: RosterName[];
}

// Accepted, non-ignored nominees -- the same eligibility rule the public
// /candidates page and the ballot use (see candidate_state()).
export async function getCandidateRoster(electionId: string): Promise<RosterPosition[]> {
  const supabase = await createClient();
  const { data } = await supabase
    .from("candidates")
    .select("*")
    .eq("election_id", electionId)
    .eq("accepted", true)
    .eq("ignored", false);

  const candidates = (data ?? []) as Candidate[];

  return POSITIONS.map(({ value }) => {
    const names = candidates
      .filter((c) => c.position === value)
      .sort((a, b) => a.name.localeCompare(b.name))
      .map((c) => ({ name: c.name, church: c.church }));
    return { position: value, positionLabel: positionLabel(value), names };
  }).filter((row) => row.names.length > 0);
}

// Winners only, per compute_position_results() -- a position stays "vacant"
// (empty names[]) if nothing cleared the >50% majority bar, matching the
// same rule the public /results page displays.
export async function getResultsRoster(electionId: string): Promise<RosterPosition[]> {
  const electionPositions = await getElectionPositions(electionId);

  const rows = await Promise.all(
    POSITIONS.filter(({ value }) => electionPositions.some((p) => p.position === value)).map(
      async ({ value }) => {
        const results = await getPositionResults(electionId, value);
        const winners = (results ?? [])
          .filter((r) => r.elected)
          .sort((a, b) => b.vote_count - a.vote_count)
          .map((r) => ({
            name: r.candidate_name,
            votes: r.vote_count,
            voteShare: r.vote_share,
            elected: true,
          }));
        return { position: value, positionLabel: positionLabel(value), names: winners };
      },
    ),
  );

  return rows;
}
