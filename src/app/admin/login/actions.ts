"use server";

import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";

export type AdminLoginState = {
  status: "idle" | "error";
  message?: string;
};

export async function adminLogin(
  _prevState: AdminLoginState,
  formData: FormData,
): Promise<AdminLoginState> {
  const email = String(formData.get("email") ?? "").trim();
  const password = String(formData.get("password") ?? "");

  const supabase = await createClient();
  const { error: signInError } = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  if (signInError) {
    return { status: "error", message: "Invalid email or password." };
  }

  const {
    data: { user },
  } = await supabase.auth.getUser();

  const { data: adminRow } = await supabase
    .from("admins")
    .select("id")
    .eq("auth_user_id", user!.id)
    .maybeSingle();

  if (!adminRow) {
    await supabase.auth.signOut();
    return {
      status: "error",
      message: "This account is not authorized as an election committee admin.",
    };
  }

  redirect("/admin/dashboard");
}
