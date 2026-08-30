"use server";

import { createClient } from "@/lib/supabase/server";
import { messageForRpcError } from "@/lib/constants";

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
  const { error } = await supabase.rpc("confirm_candidate", {
    p_token: token,
    p_accept: accept,
    p_pastor_contact: pastorContact || undefined,
  });

  if (error) {
    return { status: "error", message: messageForRpcError(error) };
  }

  return {
    status: "success",
    message: accept
      ? "Thank you for accepting your nomination! You are now eligible to be seconded by the community and will appear on the public candidates page."
      : "Thank you for responding. You will be removed from the candidates list.",
  };
}
