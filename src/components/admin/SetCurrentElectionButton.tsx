"use client";

import { useState, useTransition } from "react";
import { setCurrentElection } from "@/app/admin/elections/actions";
import { Button } from "@/components/ui/Button";

export function SetCurrentElectionButton({ electionId }: { electionId: string }) {
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);

  return (
    <div>
      <Button
        variant="secondary"
        disabled={isPending}
        onClick={() =>
          startTransition(async () => {
            const res = await setCurrentElection(electionId);
            setError(res.status === "error" ? (res.message ?? "Error") : null);
          })
        }
      >
        {isPending ? "Updating..." : "Make current"}
      </Button>
      {error && <p className="mt-1 text-xs text-red-600">{error}</p>}
    </div>
  );
}
