"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import { messageForRpcError } from "@/lib/constants";

export type ActionState = {
  status: "idle" | "error" | "success";
  message?: string;
};

export async function setCandidateIgnored(
  candidateId: string,
  ignored: boolean,
): Promise<ActionState> {
  const supabase = await createClient();
  const { error } = await supabase
    .from("candidates")
    .update({ ignored })
    .eq("id", candidateId);

  if (error) {
    return { status: "error", message: messageForRpcError(error) };
  }

  revalidatePath("/admin/candidates");
  revalidatePath("/candidates");
  return { status: "success" };
}
