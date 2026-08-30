"use client";

import { useState, useTransition } from "react";
import { setYouthCount } from "@/app/admin/churches/actions";
import { Input } from "@/components/ui/Field";
import { Button } from "@/components/ui/Button";
import { delegateQuota } from "@/lib/election/eligibility";

export function YouthCountInput({
  electionId,
  churchId,
  initialCount,
}: {
  electionId: string;
  churchId: string;
  initialCount: number | null;
}) {
  const [count, setCount] = useState(initialCount ?? 0);
  const [isPending, startTransition] = useTransition();

  return (
    <div className="flex items-center gap-2">
      <Input
        type="number"
        min={0}
        value={count}
        onChange={(e) => setCount(Number(e.target.value))}
        className="w-20"
      />
      <span className="whitespace-nowrap text-xs text-slate-500">
        {delegateQuota(count)} delegate{delegateQuota(count) === 1 ? "" : "s"}
      </span>
      <Button
        variant="secondary"
        disabled={isPending}
        onClick={() =>
          startTransition(async () => {
            await setYouthCount(electionId, churchId, count);
          })
        }
      >
        Save
      </Button>
    </div>
  );
}
