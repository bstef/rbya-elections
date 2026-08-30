"use server";

import { createClient } from "@/lib/supabase/server";
import { commentSchema } from "@/lib/validation/comment";
import { messageForRpcError } from "@/lib/constants";

export type CommentFormState = {
  status: "idle" | "error" | "success";
  message?: string;
  fieldErrors?: Record<string, string>;
};

export async function submitComment(
  _prevState: CommentFormState,
  formData: FormData,
): Promise<CommentFormState> {
  const raw = {
    candidateId: formData.get("candidateId"),
    type: formData.get("type"),
    content: formData.get("content"),
    submitterName: formData.get("submitterName"),
    submitterEmail: formData.get("submitterEmail"),
  };

  const parsed = commentSchema.safeParse(raw);
  if (!parsed.success) {
    const fieldErrors: Record<string, string> = {};
    for (const issue of parsed.error.issues) {
      fieldErrors[String(issue.path[0])] = issue.message;
    }
    return { status: "error", fieldErrors, message: "Please fix the errors below." };
  }

  const supabase = await createClient();
  const { error } = await supabase.rpc("submit_comment", {
    p_candidate_id: parsed.data.candidateId,
    p_type: parsed.data.type,
    p_content: parsed.data.content,
    p_submitter_name: parsed.data.submitterName,
    p_submitter_email: parsed.data.submitterEmail,
  });

  if (error) {
    return { status: "error", message: messageForRpcError(error) };
  }

  return {
    status: "success",
    message:
      parsed.data.type === "negative"
        ? "Thank you for your submission. Objections are not posted publicly -- the election committee will review it and it may be read at Convention before voting."
        : "Thank you for your submission! It has been recorded and the candidate may now be marked as seconded.",
  };
}
