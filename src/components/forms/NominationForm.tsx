"use client";

import { useActionState } from "react";
import { submitNomination, type NominationFormState } from "@/app/nominate/actions";
import { POSITIONS } from "@/lib/constants";
import { Input, Textarea, Label, FieldError } from "@/components/ui/Field";
import { Button } from "@/components/ui/Button";
import { Banner } from "@/components/ui/Card";

const initialState: NominationFormState = { status: "idle" };

export function NominationForm() {
  const [state, formAction, isPending] = useActionState(submitNomination, initialState);

  if (state.status === "success") {
    return <Banner tone="success">{state.message}</Banner>;
  }

  return (
    <form action={formAction} className="space-y-5">
      {state.status === "error" && state.message && (
        <Banner tone="error">{state.message}</Banner>
      )}

      <div>
        <Label htmlFor="position">Position</Label>
        <select
          id="position"
          name="position"
          defaultValue="committee"
          className="block w-full rounded-md border border-hairline bg-surface text-ink px-3 py-2 text-sm"
        >
          {POSITIONS.map((p) => (
            <option key={p.value} value={p.value}>
              {p.label}
            </option>
          ))}
        </select>
      </div>

      <div>
        <Label htmlFor="name">Nominee name</Label>
        <Input id="name" name="name" required />
        <FieldError message={state.fieldErrors?.name} />
      </div>

      <div>
        <Label htmlFor="church">Nominee&apos;s home church</Label>
        <Input id="church" name="church" required />
        <FieldError message={state.fieldErrors?.church} />
      </div>

      <div>
        <Label htmlFor="location">City, State</Label>
        <Input id="location" name="location" required />
        <FieldError message={state.fieldErrors?.location} />
      </div>

      <div>
        <Label htmlFor="email">Nominee&apos;s email</Label>
        <Input id="email" name="email" type="email" required />
        <FieldError message={state.fieldErrors?.email} />
      </div>

      <div>
        <Label htmlFor="background" hint="(at least 10 characters)">
          Nominee background
        </Label>
        <Textarea id="background" name="background" rows={4} required />
        <FieldError message={state.fieldErrors?.background} />
      </div>

      <div>
        <Label htmlFor="reasons" hint="(at least 10 characters)">
          Reasons for nomination
        </Label>
        <Textarea id="reasons" name="reasons" rows={4} required />
        <FieldError message={state.fieldErrors?.reasons} />
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

      <div>
        <Label htmlFor="pastorContact" hint="(optional)">
          Nominee&apos;s pastor or youth leader&apos;s email
        </Label>
        <Input id="pastorContact" name="pastorContact" type="email" />
        <FieldError message={state.fieldErrors?.pastorContact} />
      </div>

      <Button type="submit" disabled={isPending}>
        {isPending ? "Submitting..." : "Submit nomination"}
      </Button>
    </form>
  );
}
