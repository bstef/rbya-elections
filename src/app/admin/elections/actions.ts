"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import { messageForRpcError, POSITIONS, type PositionValue } from "@/lib/constants";
import type { TablesUpdate } from "@/lib/types/database.types";

export type ActionState = {
  status: "idle" | "error" | "success";
  message?: string;
};

export async function createElection(
  _prevState: ActionState,
  formData: FormData,
): Promise<ActionState> {
  const year = Number(formData.get("year"));
  const electionDay = String(formData.get("electionDay"));
  const nominationOpensAt = String(formData.get("nominationOpensAt"));
  const nominationCutoffAt = String(formData.get("nominationCutoffAt"));
  const confirmationCutoffAt = String(formData.get("confirmationCutoffAt"));
  const absenteeBallotDeadline = String(formData.get("absenteeBallotDeadline"));
  const votingOpensAt = String(formData.get("votingOpensAt"));
  const votingClosesAt = String(formData.get("votingClosesAt"));

  const supabase = await createClient();
  const { data: election, error } = await supabase
    .from("elections")
    .insert({
      year,
      election_day: electionDay,
      nomination_opens_at: nominationOpensAt,
      nomination_cutoff_at: nominationCutoffAt,
      confirmation_cutoff_at: confirmationCutoffAt,
      absentee_ballot_deadline: absenteeBallotDeadline,
      voting_opens_at: votingOpensAt,
      voting_closes_at: votingClosesAt,
      status: "draft",
    })
    .select()
    .single();

  if (error) {
    return { status: "error", message: messageForRpcError(error) };
  }

  const { error: positionsError } = await supabase.from("election_positions").insert(
    POSITIONS.map((p) => ({
      election_id: election.id,
      position: p.value,
      seats: p.value === "committee" ? 15 : 1,
    })),
  );

  if (positionsError) {
    return { status: "error", message: messageForRpcError(positionsError) };
  }

  revalidatePath("/admin/elections");
  return { status: "success", message: `Created the ${year} election.` };
}

export async function setCurrentElection(electionId: string): Promise<ActionState> {
  const supabase = await createClient();
  const { error } = await supabase.rpc("set_current_election", {
    p_election_id: electionId,
  });

  if (error) {
    return { status: "error", message: messageForRpcError(error) };
  }

  revalidatePath("/admin/elections");
  revalidatePath("/");
  return { status: "success", message: "Updated the current election." };
}

export async function updateElection(
  electionId: string,
  patch: TablesUpdate<"elections">,
): Promise<ActionState> {
  const supabase = await createClient();
  const { error } = await supabase.from("elections").update(patch).eq("id", electionId);

  if (error) {
    return { status: "error", message: messageForRpcError(error) };
  }

  revalidatePath(`/admin/elections/${electionId}/edit`);
  revalidatePath("/admin/results");
  revalidatePath("/results");
  revalidatePath("/");
  return { status: "success", message: "Election updated." };
}

export async function updatePositionSeats(
  electionId: string,
  position: PositionValue,
  seats: number,
): Promise<ActionState> {
  const supabase = await createClient();
  const { error } = await supabase
    .from("election_positions")
    .update({ seats })
    .eq("election_id", electionId)
    .eq("position", position);

  if (error) {
    return { status: "error", message: messageForRpcError(error) };
  }

  revalidatePath(`/admin/elections/${electionId}/edit`);
  return { status: "success", message: "Seats updated." };
}
