"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import { messageForRpcError } from "@/lib/constants";

export type SetPhotoState = {
  status: "idle" | "error" | "success";
  message?: string;
};

// Shared by the nomination success screen, the nominee confirmation page,
// and the candidate's personal status page -- all three hold the same
// confirm_token, which is also what the storage upload policy checks
// against (see supabase/migrations/0017_candidate_photos.sql). The actual
// file upload happens client-side straight to Supabase Storage; this just
// repoints candidates.image_url at the resulting public URL.
export async function setCandidatePhoto(
  token: string,
  imageUrl: string,
): Promise<SetPhotoState> {
  const supabase = await createClient();
  const { error } = await supabase.rpc("set_candidate_photo", {
    p_token: token,
    p_image_url: imageUrl,
  });

  if (error) {
    return { status: "error", message: messageForRpcError(error) };
  }

  revalidatePath("/candidates");
  return { status: "success" };
}
