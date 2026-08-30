import { createClient } from "@/lib/supabase/server";
import type { Election, ElectionPosition } from "@/lib/types/models";

// Backed by the DB-enforced single-current-row invariant
// (elections.one_current_election), so this can never be ambiguous the way
// the old app's year-guessing ElectionDecider was.
export async function getCurrentElection(): Promise<Election | null> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("elections")
    .select("*")
    .eq("is_current", true)
    .maybeSingle();

  if (error) throw error;
  return data as Election | null;
}

export async function getElectionPositions(
  electionId: string,
): Promise<ElectionPosition[]> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("election_positions")
    .select("*")
    .eq("election_id", electionId);

  if (error) throw error;
  return (data ?? []) as ElectionPosition[];
}

export async function getSeatsForPosition(
  electionId: string,
  position: string,
): Promise<number> {
  const positions = await getElectionPositions(electionId);
  return positions.find((p) => p.position === position)?.seats ?? 1;
}
