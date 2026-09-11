import "server-only";
import { Resend } from "resend";

// Transactional emails distinct from Supabase Auth's own emails (magic
// links, which Supabase sends itself): nomination confirmation links,
// pastor vetting requests, delegate registration/verification notices.
// See README's "Email delivery" section for the Supabase-Auth side of this
// (custom SMTP), which is separate.
//
// Sends from rbya.cloud (this app's own domain) rather than rbya.org (the
// parent org's site) since this app owns rbya.cloud's DNS directly. Both
// domains are verified in Resend -- see README for switching back.

const FROM_ADDRESS = "RBYA Elections <elections@rbya.cloud>";

export interface EmailMessage {
  to: string;
  subject: string;
  text: string;
  html?: string;
}

let client: Resend | null = null;

function getClient(): Resend {
  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) {
    throw new Error("RESEND_API_KEY is not set -- see .env.local.example");
  }
  client ??= new Resend(apiKey);
  return client;
}

// Failures are logged, not thrown: a bounced/misconfigured email shouldn't
// fail the underlying action (the nomination, registration, etc. already
// succeeded in the database) and every call site also shows the link
// on-screen as a fallback the admin/submitter can copy and send by hand.
export async function sendEmail(message: EmailMessage): Promise<void> {
  try {
    const { error } = await getClient().emails.send({
      from: FROM_ADDRESS,
      to: message.to,
      subject: message.subject,
      text: message.text,
      ...(message.html ? { html: message.html } : {}),
    });
    if (error) {
      console.error("sendEmail failed:", error);
    }
  } catch (err) {
    console.error("sendEmail failed:", err);
  }
}
