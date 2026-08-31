import "server-only";

// Stub for transactional emails distinct from Supabase Auth's own emails
// (magic links, which Supabase sends itself): nomination confirmation
// links, delegate-registration acknowledgements, etc. Not wired up yet --
// the RPCs that would trigger these (submit_nomination, register_delegates)
// currently rely on the caller/UI to communicate next steps instead.
//
// To implement: pick a provider (Resend, Postmark, SES, ...), add its
// API key as a server-only env var, and call it here. Keep the call sites
// in src/app/**/actions.ts unaware of the provider -- they should only
// import this module's functions.

export interface EmailMessage {
  to: string;
  subject: string;
  text: string;
}

export async function sendEmail(_message: EmailMessage): Promise<void> {
  throw new Error(
    "sendEmail is not implemented yet -- see src/lib/email/send.ts",
  );
}
