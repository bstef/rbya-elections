"use client";

import { useState } from "react";
import { Button } from "@/components/ui/Button";

// Supabase's default mailer is unreliable (see README), so the committee
// needs a manual fallback to hand a nominee their confirmation link.
export function CopyConfirmLinkButton({ link }: { link: string }) {
  const [copied, setCopied] = useState(false);

  return (
    <Button
      variant="secondary"
      onClick={async () => {
        await navigator.clipboard.writeText(link);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
      }}
    >
      {copied ? "Copied!" : "Copy confirmation link"}
    </Button>
  );
}
