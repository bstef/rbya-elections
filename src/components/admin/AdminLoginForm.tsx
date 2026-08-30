"use client";

import { useActionState } from "react";
import { adminLogin, type AdminLoginState } from "@/app/admin/login/actions";
import { Input, Label } from "@/components/ui/Field";
import { Button } from "@/components/ui/Button";
import { Banner } from "@/components/ui/Card";

const initialState: AdminLoginState = { status: "idle" };

export function AdminLoginForm() {
  const [state, formAction, isPending] = useActionState(adminLogin, initialState);

  return (
    <form action={formAction} className="space-y-4">
      {state.status === "error" && <Banner tone="error">{state.message}</Banner>}

      <div>
        <Label htmlFor="email">Email</Label>
        <Input id="email" name="email" type="email" required autoFocus />
      </div>

      <div>
        <Label htmlFor="password">Password</Label>
        <Input id="password" name="password" type="password" required />
      </div>

      <Button type="submit" disabled={isPending}>
        {isPending ? "Signing in..." : "Sign in"}
      </Button>
    </form>
  );
}
