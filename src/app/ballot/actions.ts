"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import { messageForRpcError, type PositionValue } from "@/lib/constants";

export type CastVoteState = {
  status: "idle" | "error" | "success";
  message?: string;
};

export async function castVote(
  position: PositionValue,
  candidateIds: string[],
): Promise<CastVoteState> {
  const supabase = await createClient();
  const { error } = await supabase.rpc("submit_ballot", {
    p_position: position,
    p_candidate_ids: candidateIds,
  });

  if (error) {
    return { status: "error", message: messageForRpcError(error) };
  }

  revalidatePath("/ballot");
  return {
    status: "success",
    message: "Your vote for this position has been recorded.",
  };
}
