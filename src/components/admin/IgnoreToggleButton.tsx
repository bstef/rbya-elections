"use client";

import { useTransition } from "react";
import { setCandidateIgnored } from "@/app/admin/candidates/actions";
import { Button } from "@/components/ui/Button";

export function IgnoreToggleButton({
  candidateId,
  ignored,
}: {
  candidateId: string;
  ignored: boolean;
}) {
  const [isPending, startTransition] = useTransition();

  return (
    <Button
      variant={ignored ? "secondary" : "danger"}
      disabled={isPending}
      onClick={() =>
        startTransition(async () => {
          await setCandidateIgnored(candidateId, !ignored);
        })
      }
    >
      {isPending ? "Saving..." : ignored ? "Unignore" : "Ignore"}
    </Button>
  );
}
