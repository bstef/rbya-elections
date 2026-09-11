"use server";

import { createClient } from "@/lib/supabase/server";
import { messageForRpcError } from "@/lib/constants";
import { sendEmail } from "@/lib/email/send";
import type { Candidate } from "@/lib/types/models";

export type ConfirmFormState = {
  status: "idle" | "error" | "success";
  message?: string;
};

export async function confirmCandidate(
  token: string,
  accept: boolean,
  pastorContact: string | null,
): Promise<ConfirmFormState> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .rpc("confirm_candidate", {
      p_token: token,
      p_accept: accept,
      p_pastor_contact: pastorContact || undefined,
    })
    .single();

  if (error) {
    return { status: "error", message: messageForRpcError(error) };
  }

  const candidate = data as Candidate;
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";
  await sendEmail({
    to: candidate.submitter_email,
    subject: accept
      ? `${candidate.name} accepted their nomination`
      : `${candidate.name} declined their nomination`,
    text: accept
      ? `${candidate.name} confirmed they'll run and now appears on the public candidates page:
${siteUrl}/candidates/${candidate.id}`
      : `${candidate.name} declined the nomination you submitted, so they won't appear on the ballot.`,
  });

  return {
    status: "success",
    message: accept
      ? "Thank you for accepting your nomination! You are now eligible to be seconded by the community and will appear on the public candidates page."
      : "Thank you for responding. You will be removed from the candidates list.",
  };
}
