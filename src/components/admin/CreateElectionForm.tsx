"use client";

import { useActionState } from "react";
import { createElection, type ActionState } from "@/app/admin/elections/actions";
import { Input, Label } from "@/components/ui/Field";
import { Button } from "@/components/ui/Button";
import { Banner } from "@/components/ui/Card";

const initialState: ActionState = { status: "idle" };

export function CreateElectionForm() {
  const [state, formAction, isPending] = useActionState(createElection, initialState);

  return (
    <form action={formAction} className="space-y-4">
      {state.status !== "idle" && (
        <Banner tone={state.status === "error" ? "error" : "success"}>
          {state.message}
        </Banner>
      )}

      <div>
        <Label htmlFor="year">Year</Label>
        <Input id="year" name="year" type="number" required />
      </div>
      <div>
        <Label htmlFor="electionDay">Election day</Label>
        <Input id="electionDay" name="electionDay" type="date" required />
      </div>
      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <Label htmlFor="nominationOpensAt" hint="(UTC)">
            Nominations open
          </Label>
          <Input id="nominationOpensAt" name="nominationOpensAt" type="datetime-local" required />
        </div>
        <div>
          <Label htmlFor="nominationCutoffAt" hint="(UTC)">
            Nominations close
          </Label>
          <Input id="nominationCutoffAt" name="nominationCutoffAt" type="datetime-local" required />
        </div>
        <div>
          <Label htmlFor="confirmationCutoffAt" hint="(UTC)">
            Confirmation cutoff
          </Label>
          <Input
            id="confirmationCutoffAt"
            name="confirmationCutoffAt"
            type="datetime-local"
            required
          />
        </div>
        <div>
          <Label htmlFor="absenteeBallotDeadline" hint="(UTC)">
            Absentee ballot deadline
          </Label>
          <Input
            id="absenteeBallotDeadline"
            name="absenteeBallotDeadline"
            type="datetime-local"
            required
          />
        </div>
        <div>
          <Label htmlFor="votingOpensAt" hint="(UTC)">
            Voting opens
          </Label>
          <Input id="votingOpensAt" name="votingOpensAt" type="datetime-local" required />
        </div>
        <div>
          <Label htmlFor="votingClosesAt" hint="(UTC)">
            Voting closes
          </Label>
          <Input id="votingClosesAt" name="votingClosesAt" type="datetime-local" required />
        </div>
      </div>

      <Button type="submit" disabled={isPending}>
        {isPending ? "Creating..." : "Create election"}
      </Button>
    </form>
  );
}
