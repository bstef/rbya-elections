"use client";

import { useActionState } from "react";
import { submitComment, type CommentFormState } from "@/app/candidates/[candidateId]/actions";
import { Input, Textarea, Label, FieldError } from "@/components/ui/Field";
import { Button } from "@/components/ui/Button";
import { Banner } from "@/components/ui/Card";

const initialState: CommentFormState = { status: "idle" };

export function CommentForm({ candidateId }: { candidateId: string }) {
  const [state, formAction, isPending] = useActionState(submitComment, initialState);

  if (state.status === "success") {
    return <Banner tone="success">{state.message}</Banner>;
  }

  return (
    <form action={formAction} className="space-y-4">
      <input type="hidden" name="candidateId" value={candidateId} />

      {state.status === "error" && state.message && (
        <Banner tone="error">{state.message}</Banner>
      )}

      <div>
        <Label htmlFor="type">This comment is a</Label>
        <select
          id="type"
          name="type"
          defaultValue="positive"
          className="block w-full rounded-md border border-hairline bg-surface text-ink px-3 py-2 text-sm"
        >
          <option value="positive">Note of support (seconding)</option>
          <option value="negative">Objection (never shown publicly)</option>
        </select>
      </div>

      <div>
        <Label htmlFor="content" hint="(at least 10 characters)">
          Comment
        </Label>
        <Textarea id="content" name="content" rows={3} required />
        <FieldError message={state.fieldErrors?.content} />
      </div>

      <div>
        <Label htmlFor="submitterName">Your name</Label>
        <Input id="submitterName" name="submitterName" required />
        <FieldError message={state.fieldErrors?.submitterName} />
      </div>

      <div>
        <Label htmlFor="submitterEmail">Your email</Label>
        <Input id="submitterEmail" name="submitterEmail" type="email" required />
        <FieldError message={state.fieldErrors?.submitterEmail} />
      </div>

      <Button type="submit" disabled={isPending}>
        {isPending ? "Submitting..." : "Submit comment"}
      </Button>
    </form>
  );
}
