"use server";

import { createClient } from "@/lib/supabase/server";

export type LoginFormState = {
  status: "idle" | "not_found" | "sent" | "error";
  message?: string;
};

export async function requestVoterLogin(
  _prevState: LoginFormState,
  formData: FormData,
): Promise<LoginFormState> {
  const email = String(formData.get("email") ?? "").trim();
  if (!email) {
    return { status: "error", message: "Enter your email address." };
  }

  const supabase = await createClient();

  // Check via a SECURITY DEFINER RPC, not a direct table select -- anon has
  // no select policy on `delegates` at all (see 0011_rls_policies.sql), so
  // a direct select would always come back empty regardless of a match.
  const { data: isVerified, error: checkError } = await supabase.rpc(
    "is_verified_delegate",
    { p_email: email },
  );

  if (checkError) {
    return { status: "error", message: checkError.message };
  }

  if (!isVerified) {
    return {
      status: "not_found",
      message:
        "We don't have you registered as a verified delegate for this election yet. Please check with your church.",
    };
  }

  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";

  const { error } = await supabase.auth.signInWithOtp({
    email,
    options: {
      shouldCreateUser: true,
      emailRedirectTo: `${siteUrl}/auth/callback`,
    },
  });

  if (error) {
    return { status: "error", message: error.message };
  }

  return {
    status: "sent",
    message: "Check your email for a secure sign-in link to cast your ballot.",
  };
}
