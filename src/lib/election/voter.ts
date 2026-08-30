import { createClient } from "@/lib/supabase/server";
import type { Delegate } from "@/lib/types/models";

// Resolves "the current delegate" the same way the submit_ballot RPC does:
// auth_user_id = auth.uid() AND election_id = current election. A delegate
// from a past election won't resolve here until re-registered/re-verified.
export async function getCurrentDelegate(electionId: string): Promise<Delegate | null> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) return null;

  const { data, error } = await supabase
    .from("delegates")
    .select("*")
    .eq("auth_user_id", user.id)
    .eq("election_id", electionId)
    .maybeSingle();

  if (error) throw error;
  return data as Delegate | null;
}
