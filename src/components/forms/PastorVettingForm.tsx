"use client";

import { useState, useTransition } from "react";
import { respondToPastorVetting, type VettingFormState } from "@/app/vet/[token]/actions";
import { Button } from "@/components/ui/Button";
import { Banner } from "@/components/ui/Card";

export function PastorVettingForm({ token }: { token: string }) {
  const [result, setResult] = useState<VettingFormState | null>(null);
  const [isPending, startTransition] = useTransition();

  function respond(approved: boolean) {
    startTransition(async () => {
      const res = await respondToPastorVetting(token, approved);
      setResult(res);
    });
  }

  if (result?.status === "success") {
    return <Banner tone="success">{result.message}</Banner>;
  }

  return (
    <div className="space-y-4">
      {result?.status === "error" && <Banner tone="error">{result.message}</Banner>}

      <div className="flex gap-3">
        <Button disabled={isPending} onClick={() => respond(true)}>
          Yes, I vouch for this candidate
        </Button>
        <Button disabled={isPending} variant="secondary" onClick={() => respond(false)}>
          No, I have concerns
        </Button>
      </div>
    </div>
  );
}
