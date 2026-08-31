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

export type RequestVettingState = ActionState & { link?: string };

export async function requestPastorVetting(
  candidateId: string,
): Promise<RequestVettingState> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .rpc("request_pastor_vetting", { p_candidate_id: candidateId })
    .single();

  if (error) {
    return { status: "error", message: messageForRpcError(error) };
  }

  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";
  const link = `${siteUrl}/vet/${(data as { pastor_approval_token: string }).pastor_approval_token}`;

  revalidatePath("/admin/candidates");
  return {
    status: "success",
    message: "Vetting request recorded. Send this link to the pastor/youth leader:",
    link,
  };
}
