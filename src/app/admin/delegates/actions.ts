"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import { messageForRpcError } from "@/lib/constants";
import type { DelegateType } from "@/lib/types/models";

export type ActionState = {
  status: "idle" | "error" | "success";
  message?: string;
};

export async function setDelegateVerified(
  delegateId: string,
  verified: boolean,
): Promise<ActionState> {
  const supabase = await createClient();
  const { error } = await supabase
    .from("delegates")
    .update({ verified })
    .eq("id", delegateId);

  if (error) {
    return { status: "error", message: messageForRpcError(error) };
  }

  revalidatePath("/admin/delegates");
  return { status: "success" };
}

// CSV import for historical/trusted data: one delegate per line, formatted
// "name,email,present|absentee". Inserted as already-verified since this is
// the committee entering data directly, unlike the public
// register_delegates RPC used for church self-registration.
export async function importDelegatesCsv(
  electionId: string,
  churchId: string,
  csvText: string,
): Promise<ActionState> {
  const rows = csvText
    .split("\n")
    .map((line) => line.trim())
    .filter(Boolean)
    .map((line) => {
      const [name, email, type] = line.split(",").map((part) => part?.trim());
      return {
        election_id: electionId,
        church_id: churchId,
        name,
        email,
        delegate_type: (type === "absentee" ? "absentee" : "present") as DelegateType,
        verified: true,
      };
    })
    .filter((row) => row.name && row.email);

  if (rows.length === 0) {
    return { status: "error", message: "No valid rows found. Use one delegate per line: name,email,present|absentee" };
  }

  const supabase = await createClient();
  const { error } = await supabase
    .from("delegates")
    .upsert(rows, { onConflict: "election_id,email" });

  if (error) {
    return { status: "error", message: messageForRpcError(error) };
  }

  revalidatePath("/admin/delegates");
  return { status: "success", message: `Imported ${rows.length} delegate(s).` };
}
