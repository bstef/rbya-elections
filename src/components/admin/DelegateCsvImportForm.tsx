"use client";

import { useState, useTransition, type FormEvent } from "react";
import { importDelegatesCsv, type ActionState } from "@/app/admin/delegates/actions";
import { Textarea, Label } from "@/components/ui/Field";
import { Button } from "@/components/ui/Button";
import { Banner } from "@/components/ui/Card";
import type { Church } from "@/lib/types/models";

export function DelegateCsvImportForm({
  electionId,
  churches,
}: {
  electionId: string;
  churches: Church[];
}) {
  const [churchId, setChurchId] = useState(churches[0]?.id ?? "");
  const [csvText, setCsvText] = useState("");
  const [result, setResult] = useState<ActionState | null>(null);
  const [isPending, startTransition] = useTransition();

  function handleSubmit(event: FormEvent) {
    event.preventDefault();
    startTransition(async () => {
      const res = await importDelegatesCsv(electionId, churchId, csvText);
      setResult(res);
      if (res.status === "success") setCsvText("");
    });
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {result && (
        <Banner tone={result.status === "error" ? "error" : "success"}>
          {result.message}
        </Banner>
      )}

      <div>
        <Label htmlFor="church">Church</Label>
        <select
          id="church"
          value={churchId}
          onChange={(e) => setChurchId(e.target.value)}
          className="block w-full rounded-md border border-slate-300 px-3 py-2 text-sm"
        >
          {churches.map((church) => (
            <option key={church.id} value={church.id}>
              {church.name}
            </option>
          ))}
        </select>
      </div>

      <div>
        <Label htmlFor="csv" hint="one per line: name,email,present|absentee">
          Delegates
        </Label>
        <Textarea
          id="csv"
          rows={6}
          value={csvText}
          onChange={(e) => setCsvText(e.target.value)}
          placeholder={"Ana Pace,ana.pace@example.com,present\nDavid Pace,david.pace@example.com,absentee"}
        />
      </div>

      <Button type="submit" disabled={isPending || !churchId}>
        {isPending ? "Importing..." : "Import delegates"}
      </Button>
    </form>
  );
}
