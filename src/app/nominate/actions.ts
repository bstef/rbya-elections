"use server";

import { createClient } from "@/lib/supabase/server";
import { nominationSchema } from "@/lib/validation/nomination";
import { messageForRpcError } from "@/lib/constants";

export type NominationFormState = {
  status: "idle" | "error" | "success";
  message?: string;
  fieldErrors?: Record<string, string>;
};

export async function submitNomination(
  _prevState: NominationFormState,
  formData: FormData,
): Promise<NominationFormState> {
  const raw = {
    position: formData.get("position"),
    name: formData.get("name"),
    church: formData.get("church"),
    location: formData.get("location"),
    email: formData.get("email"),
    background: formData.get("background"),
    reasons: formData.get("reasons"),
    submitterName: formData.get("submitterName"),
    submitterEmail: formData.get("submitterEmail"),
    pastorContact: formData.get("pastorContact") || "",
  };

  const parsed = nominationSchema.safeParse(raw);
  if (!parsed.success) {
    const fieldErrors: Record<string, string> = {};
    for (const issue of parsed.error.issues) {
      fieldErrors[String(issue.path[0])] = issue.message;
    }
    return { status: "error", fieldErrors, message: "Please fix the errors below." };
  }

  const supabase = await createClient();
  const { error } = await supabase.rpc("submit_nomination", {
    p_position: parsed.data.position,
    p_name: parsed.data.name,
    p_church: parsed.data.church,
    p_location: parsed.data.location,
    p_email: parsed.data.email,
    p_background: parsed.data.background,
    p_reasons: parsed.data.reasons,
    p_submitter_name: parsed.data.submitterName,
    p_submitter_email: parsed.data.submitterEmail,
    p_pastor_contact: parsed.data.pastorContact || null,
  });

  if (error) {
    return { status: "error", message: messageForRpcError(error) };
  }

  return {
    status: "success",
    message:
      "Thank you! We've emailed the nominee a link to confirm. Once confirmed, they'll appear on the public candidates page.",
  };
}
