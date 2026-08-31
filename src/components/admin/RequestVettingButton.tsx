"use client";

import { useState, useTransition } from "react";
import { requestPastorVetting, type RequestVettingState } from "@/app/admin/candidates/actions";
import { Button } from "@/components/ui/Button";

export function RequestVettingButton({ candidateId }: { candidateId: string }) {
  const [isPending, startTransition] = useTransition();
  const [result, setResult] = useState<RequestVettingState | null>(null);

  return (
    <div>
      <Button
        variant="secondary"
        disabled={isPending}
        onClick={() =>
          startTransition(async () => {
            setResult(await requestPastorVetting(candidateId));
          })
        }
      >
        {isPending ? "Sending..." : "Request pastor vetting"}
      </Button>
      {result?.status === "error" && (
        <p className="mt-1 max-w-xs text-xs text-red-600">{result.message}</p>
      )}
      {result?.status === "success" && result.link && (
        <p className="mt-1 max-w-xs text-xs text-ink-faint">
          {result.message}{" "}
          <a href={result.link} className="break-all underline hover:text-ink-muted">
            {result.link}
          </a>
        </p>
      )}
    </div>
  );
}
