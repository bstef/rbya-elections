"use server";

import { createClient } from "@/lib/supabase/server";
import {
  delegateRegistrationSchema,
  type DelegateRegistrationInput,
} from "@/lib/validation/delegate";
import { messageForRpcError } from "@/lib/constants";

export type DelegateRegistrationState = {
  status: "idle" | "error" | "success";
  message?: string;
};

export async function registerDelegates(
  input: DelegateRegistrationInput,
): Promise<DelegateRegistrationState> {
  const parsed = delegateRegistrationSchema.safeParse(input);
  if (!parsed.success) {
    return {
      status: "error",
      message: parsed.error.issues[0]?.message ?? "Please check the form for errors.",
    };
  }

  const supabase = await createClient();
  const { error } = await supabase.rpc("register_delegates", {
    p_church_name: parsed.data.churchName,
    p_city_state: parsed.data.cityState,
    p_pastor_name: parsed.data.pastorName,
    p_youth_leader_name: parsed.data.youthLeaderName,
    p_registered_by_name: parsed.data.registeredByName,
    p_registered_by_email: parsed.data.registeredByEmail,
    p_delegates: parsed.data.delegates.map((d) => ({
      name: d.name,
      email: d.email,
      delegate_type: d.delegateType,
    })),
  });

  if (error) {
    return { status: "error", message: messageForRpcError(error) };
  }

  return {
    status: "success",
    message:
      "Thank you! Your delegates have been submitted for verification. The election committee will confirm your list before Convention -- delegates can't log in to vote until then.",
  };
}
