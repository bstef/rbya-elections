"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import { messageForRpcError } from "@/lib/constants";

export type ActionState = {
  status: "idle" | "error" | "success";
  message?: string;
};

export async function deleteComment(commentId: string): Promise<ActionState> {
  const supabase = await createClient();
  const { error } = await supabase.from("comments").delete().eq("id", commentId);

  if (error) {
    return { status: "error", message: messageForRpcError(error) };
  }

  revalidatePath("/admin/comments");
  revalidatePath("/candidates");
  return { status: "success" };
}
