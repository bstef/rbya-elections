"use client";

import { useActionState } from "react";
import { createChurch, type ActionState } from "@/app/admin/churches/actions";
import { Input, Label } from "@/components/ui/Field";
import { Button } from "@/components/ui/Button";
import { Banner } from "@/components/ui/Card";

const initialState: ActionState = { status: "idle" };

export function CreateChurchForm() {
  const [state, formAction, isPending] = useActionState(createChurch, initialState);

  return (
    <form action={formAction} className="space-y-4">
      {state.status !== "idle" && (
        <Banner tone={state.status === "error" ? "error" : "success"}>
          {state.message}
        </Banner>
      )}
      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <Label htmlFor="name">Church name</Label>
          <Input id="name" name="name" required />
        </div>
        <div>
          <Label htmlFor="cityState">City, State</Label>
          <Input id="cityState" name="cityState" />
        </div>
        <div>
          <Label htmlFor="pastorName">Pastor&apos;s name</Label>
          <Input id="pastorName" name="pastorName" />
        </div>
        <div>
          <Label htmlFor="youthLeaderName">Youth leader&apos;s name</Label>
          <Input id="youthLeaderName" name="youthLeaderName" />
        </div>
      </div>
      <Button type="submit" disabled={isPending}>
        {isPending ? "Adding..." : "Add church"}
      </Button>
    </form>
  );
}
