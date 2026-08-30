"use client";

import { useState, useTransition } from "react";
import { confirmCandidate, type ConfirmFormState } from "@/app/confirm/[token]/actions";
import { Button } from "@/components/ui/Button";
import { Input, Label } from "@/components/ui/Field";
import { Banner } from "@/components/ui/Card";

export function ConfirmForm({ token }: { token: string }) {
  const [pastorContact, setPastorContact] = useState("");
  const [result, setResult] = useState<ConfirmFormState | null>(null);
  const [isPending, startTransition] = useTransition();

  function respond(accept: boolean) {
    startTransition(async () => {
      const res = await confirmCandidate(token, accept, pastorContact || null);
      setResult(res);
    });
  }

  if (result?.status === "success") {
    return <Banner tone="success">{result.message}</Banner>;
  }

  return (
    <div className="space-y-5">
      {result?.status === "error" && <Banner tone="error">{result.message}</Banner>}

      <div>
        <Label htmlFor="pastorContact" hint="(optional, shared with the election committee)">
          Your pastor or youth leader&apos;s email
        </Label>
        <Input
          id="pastorContact"
          type="email"
          value={pastorContact}
          onChange={(event) => setPastorContact(event.target.value)}
        />
      </div>

      <div className="flex gap-3">
        <Button disabled={isPending} onClick={() => respond(true)}>
          Accept nomination
        </Button>
        <Button disabled={isPending} variant="secondary" onClick={() => respond(false)}>
          Decline
        </Button>
      </div>
    </div>
  );
}
