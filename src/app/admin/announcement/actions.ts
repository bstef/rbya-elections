"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import { messageForRpcError } from "@/lib/constants";

export type ActionState = {
  status: "idle" | "error" | "success";
  message?: string;
};

// Every set/clear also lands a row in announcement_log, so the committee
// has a real record of what was announced and when -- not just whatever
// happens to be showing right now.
export async function updateAnnouncement(
  electionId: string,
  message: string | null,
): Promise<ActionState> {
  const supabase = await createClient();

  const { error } = await supabase
    .from("elections")
    .update({ custom_announcement: message })
    .eq("id", electionId);

  if (error) {
    return { status: "error", message: messageForRpcError(error) };
  }

  await supabase.from("announcement_log").insert({ election_id: electionId, message });

  revalidatePath("/admin/announcement");
  revalidatePath("/");

  return {
    status: "success",
    message: message ? "Election announcement updated." : "Election announcement cleared.",
  };
}
