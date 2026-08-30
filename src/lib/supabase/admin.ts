import "server-only";
import { createClient as createSupabaseClient } from "@supabase/supabase-js";
import type { Database } from "@/lib/types/database.types";

// Service-role client. NEVER import this from a Client Component or
// anything that could end up in a browser bundle -- the `server-only`
// import above makes that a build error, not just a convention.
//
// Use sparingly: almost everything should go through the anon-key
// server/browser clients + RLS + the SECURITY DEFINER RPCs. This exists for
// genuinely admin-only, out-of-band operations (e.g. provisioning the
// committee's login accounts) that RLS can't express.
export function createAdminClient() {
  return createSupabaseClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
    { auth: { autoRefreshToken: false, persistSession: false } },
  );
}
