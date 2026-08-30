import "server-only";
import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";

// Server Component / Server Action / Route Handler client. Reads the
// session from cookies via @supabase/ssr; all reads/writes go through this
// (or the browser client) so RLS is always applied.
//
// TODO: once the Supabase project exists, run the `generate_typescript_types`
// MCP tool, save the output to src/lib/types/database.types.ts, and
// parametrize createServerClient<Database>(...) here and in client.ts.
export async function createClient() {
  const cookieStore = await cookies();

  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return cookieStore.getAll();
        },
        setAll(cookiesToSet) {
          try {
            cookiesToSet.forEach(({ name, value, options }) =>
              cookieStore.set(name, value, options),
            );
          } catch {
            // Called from a Server Component during render; safe to ignore
            // because middleware refreshes the session on every request.
          }
        },
      },
    },
  );
}
