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
  const phone = String(formData.get("phone") ?? "").trim();
  const website = String(formData.get("website") ?? "").trim();

  if (!name) {
    return { status: "error", message: "Church name is required." };
  }

  const supabase = await createClient();
  const { error } = await supabase.from("churches").insert({
    name,
    city_state: cityState || null,
    pastor_name: pastorName || null,
    youth_leader_name: youthLeaderName || null,
    phone: phone || null,
    website: website || null,
  });

  if (error) {
    return { status: "error", message: messageForRpcError(error) };
  }

  revalidatePath("/admin/churches");
  return { status: "success", message: `Added ${name}.` };
}

export async function updateChurch(
  churchId: string,
  fields: {
    name: string;
    cityState: string;
    pastorName: string;
    youthLeaderName: string;
    phone: string;
    website: string;
  },
): Promise<ActionState> {
  if (!fields.name.trim()) {
    return { status: "error", message: "Church name is required." };
  }

  const supabase = await createClient();
  const { error } = await supabase
    .from("churches")
    .update({
      name: fields.name.trim(),
      city_state: fields.cityState.trim() || null,
      pastor_name: fields.pastorName.trim() || null,
      youth_leader_name: fields.youthLeaderName.trim() || null,
      phone: fields.phone.trim() || null,
      website: fields.website.trim() || null,
    })
    .eq("id", churchId);

  if (error) {
    return { status: "error", message: messageForRpcError(error) };
  }

  revalidatePath("/admin/churches");
  return { status: "success", message: "Saved." };
}

// Bulk import for onboarding a whole church directory at once: one church
// per line, pipe-delimited ("name|city, ST|pastor name|phone|website").
// Upserted on (name, city_state) -- name alone isn't unique in practice
// ("First Romanian Baptist Church" is a real congregation in a dozen
// different cities) -- so re-running the same list updates matching rows
// instead of erroring or duplicating.
export async function importChurchesCsv(csvText: string): Promise<ActionState> {
  const rows = csvText
    .split("\n")
    .map((line) => line.trim())
    .filter(Boolean)
    .map((line) => {
      const [name, cityState, pastorName, phone, website] = line
        .split("|")
        .map((part) => part?.trim());
      return {
        name,
        city_state: cityState || null,
        pastor_name: pastorName || null,
        phone: phone || null,
        website: website || null,
      };
    })
    .filter((row) => row.name);

  if (rows.length === 0) {
    return {
      status: "error",
      message:
        "No valid rows found. Use one church per line: name|city, ST|pastor name|phone|website",
    };
  }

  const supabase = await createClient();
  const { error } = await supabase
    .from("churches")
    .upsert(rows, { onConflict: "name,city_state" });

  if (error) {
    return { status: "error", message: messageForRpcError(error) };
  }

  revalidatePath("/admin/churches");
  return { status: "success", message: `Imported ${rows.length} churches.` };
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
