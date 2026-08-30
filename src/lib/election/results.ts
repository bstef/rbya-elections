import { createClient } from "@/lib/supabase/server";
import type { PositionResult } from "@/lib/types/models";
import type { PositionValue } from "@/lib/constants";

// Thin wrapper around the compute_position_results() SQL function
// (supabase/migrations/0012_results_views.sql). That function itself
// refuses to return real numbers to non-admins unless
// elections.results_published is true -- this wrapper doesn't duplicate
// that check, it just surfaces the RPC error as `null` for callers that
// want a friendly "not published yet" state instead of a thrown error.
export async function getPositionResults(
  electionId: string,
  position: PositionValue,
): Promise<PositionResult[] | null> {
  const supabase = await createClient();
  const { data, error } = await supabase.rpc("compute_position_results", {
    p_election_id: electionId,
    p_position: position,
  });

  if (error) {
    if (error.message.includes("results_not_published")) return null;
    throw error;
  }

  return data as PositionResult[];
}
