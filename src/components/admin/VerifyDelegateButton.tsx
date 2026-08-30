"use client";

import { useTransition } from "react";
import { setDelegateVerified } from "@/app/admin/delegates/actions";
import { Button } from "@/components/ui/Button";

export function VerifyDelegateButton({
  delegateId,
  verified,
}: {
  delegateId: string;
  verified: boolean;
}) {
  const [isPending, startTransition] = useTransition();

  return (
    <Button
      variant={verified ? "secondary" : "primary"}
      disabled={isPending}
      onClick={() =>
        startTransition(async () => {
          await setDelegateVerified(delegateId, !verified);
        })
      }
    >
      {isPending ? "Saving..." : verified ? "Unverify" : "Verify"}
    </Button>
  );
}
