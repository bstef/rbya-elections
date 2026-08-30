"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import { messageForRpcError } from "@/lib/constants";

export type ActionState = {
  status: "idle" | "error" | "success";
  message?: string;
};

export async function createChurch(
  _prevState: ActionState,
  formData: FormData,
): Promise<ActionState> {
  const name = String(formData.get("name") ?? "").trim();
  const cityState = String(formData.get("cityState") ?? "").trim();
  const pastorName = String(formData.get("pastorName") ?? "").trim();
  const youthLeaderName = String(formData.get("youthLeaderName") ?? "").trim();

  if (!name) {
    return { status: "error", message: "Church name is required." };
  }

  const supabase = await createClient();
  const { error } = await supabase.from("churches").insert({
    name,
    city_state: cityState || null,
    pastor_name: pastorName || null,
    youth_leader_name: youthLeaderName || null,
  });

  if (error) {
    return { status: "error", message: messageForRpcError(error) };
  }

  revalidatePath("/admin/churches");
  return { status: "success", message: `Added ${name}.` };
}

export async function setYouthCount(
  electionId: string,
  churchId: string,
  youthCount: number,
): Promise<ActionState> {
  const supabase = await createClient();
  const { error } = await supabase
    .from("church_youth_counts")
    .upsert(
      { election_id: electionId, church_id: churchId, youth_count: youthCount },
      { onConflict: "election_id,church_id" },
    );

  if (error) {
    return { status: "error", message: messageForRpcError(error) };
  }

  revalidatePath("/admin/churches");
  return { status: "success" };
}
