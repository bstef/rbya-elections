"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import { messageForRpcError, positionLabel } from "@/lib/constants";
import { sendEmail } from "@/lib/email/send";
import type { Candidate } from "@/lib/types/models";

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

  const candidate = data as Candidate;
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";
  const link = `${siteUrl}/vet/${candidate.pastor_approval_token}`;

  if (candidate.pastor_contact) {
    await sendEmail({
      to: candidate.pastor_contact,
      subject: `Vouch for ${candidate.name} -- RBYA committee nomination`,
      text: `${candidate.name} (${candidate.church}) has been nominated for ${positionLabel(candidate.position)} on the RBYA committee, and named you as their pastor or youth leader.

The election committee is asking you to confirm you can vouch for their character and standing in the church:
${link}`,
    });
  }

  revalidatePath("/admin/candidates");
  return {
    status: "success",
    message: "Vetting request emailed to the pastor/youth leader. Link (in case you need to resend it):",
    link,
  };
}
