"use client";

import { useActionState } from "react";
import { requestVoterLogin, type LoginFormState } from "@/app/login/actions";
import { Input, Label } from "@/components/ui/Field";
import { Button } from "@/components/ui/Button";
import { Banner } from "@/components/ui/Card";

const initialState: LoginFormState = { status: "idle" };

export function LoginForm() {
  const [state, formAction, isPending] = useActionState(requestVoterLogin, initialState);

  if (state.status === "sent") {
    return <Banner tone="success">{state.message}</Banner>;
  }

  return (
    <form action={formAction} className="space-y-4">
      {(state.status === "error" || state.status === "not_found") && (
        <Banner tone={state.status === "not_found" ? "warning" : "error"}>
          {state.message}
        </Banner>
      )}

      <div>
        <Label htmlFor="email">Your email</Label>
        <Input id="email" name="email" type="email" required autoFocus />
      </div>

      <Button type="submit" disabled={isPending}>
        {isPending ? "Sending..." : "Send me a sign-in link"}
      </Button>
    </form>
  );
}
