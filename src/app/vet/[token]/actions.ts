"use server";

import { createClient } from "@/lib/supabase/server";
import { messageForRpcError } from "@/lib/constants";

export type VettingFormState = {
  status: "idle" | "error" | "success";
  message?: string;
};

export async function respondToPastorVetting(
  token: string,
  approved: boolean,
): Promise<VettingFormState> {
  const supabase = await createClient();
  const { error } = await supabase.rpc("respond_pastor_vetting", {
    p_token: token,
    p_approved: approved,
  });

  if (error) {
    return { status: "error", message: messageForRpcError(error) };
  }

  return {
    status: "success",
    message: approved
      ? "Thank you for confirming. Your vouch has been recorded and shared with the election committee."
      : "Thank you for responding. The election committee has been notified.",
  };
}
