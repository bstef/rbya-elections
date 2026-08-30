"use client";

import { useState, useTransition, type FormEvent } from "react";
import { updateElection, updatePositionSeats } from "@/app/admin/elections/actions";
import { Input, Label } from "@/components/ui/Field";
import { Button } from "@/components/ui/Button";
import { Banner } from "@/components/ui/Card";
import { positionLabel } from "@/lib/constants";
import type { Election, ElectionPosition, ElectionStatus } from "@/lib/types/models";

const STATUSES: ElectionStatus[] = [
  "draft",
  "nominations_open",
  "nominations_closed",
  "voting_open",
  "voting_closed",
  "completed",
];

function toDatetimeLocal(iso: string): string {
  return new Date(iso).toISOString().slice(0, 16);
}

export function EditElectionForm({
  election,
  positions,
}: {
  election: Election;
  positions: ElectionPosition[];
}) {
  const [status, setStatus] = useState(election.status);
  const [resultsPublished, setResultsPublished] = useState(election.results_published);
  const [message, setMessage] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);

    startTransition(async () => {
      const res = await updateElection(election.id, {
        election_day: String(formData.get("electionDay")),
        nomination_opens_at: new Date(String(formData.get("nominationOpensAt"))).toISOString(),
        nomination_cutoff_at: new Date(
          String(formData.get("nominationCutoffAt")),
        ).toISOString(),
        confirmation_cutoff_at: new Date(
          String(formData.get("confirmationCutoffAt")),
        ).toISOString(),
        absentee_ballot_deadline: new Date(
          String(formData.get("absenteeBallotDeadline")),
        ).toISOString(),
        voting_opens_at: new Date(String(formData.get("votingOpensAt"))).toISOString(),
        voting_closes_at: new Date(String(formData.get("votingClosesAt"))).toISOString(),
        status,
        results_published: resultsPublished,
      });
      setMessage(res.message ?? null);
    });
  }

  return (
    <div className="space-y-8">
      <form onSubmit={handleSubmit} className="space-y-4">
        {message && <Banner tone="info">{message}</Banner>}

        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <Label htmlFor="electionDay">Election day</Label>
            <Input
              id="electionDay"
              name="electionDay"
              type="date"
              defaultValue={election.election_day}
              required
            />
          </div>
          <div>
            <Label htmlFor="status">Status</Label>
            <select
              id="status"
              value={status}
              onChange={(e) => setStatus(e.target.value as ElectionStatus)}
              className="block w-full rounded-md border border-slate-300 px-3 py-2 text-sm"
            >
              {STATUSES.map((s) => (
                <option key={s} value={s}>
                  {s.replace(/_/g, " ")}
                </option>
              ))}
            </select>
          </div>
          <div>
            <Label htmlFor="nominationOpensAt" hint="(UTC)">
              Nominations open
            </Label>
            <Input
              id="nominationOpensAt"
              name="nominationOpensAt"
              type="datetime-local"
              defaultValue={toDatetimeLocal(election.nomination_opens_at)}
              required
            />
          </div>
          <div>
            <Label htmlFor="nominationCutoffAt" hint="(UTC)">
              Nominations close
            </Label>
            <Input
              id="nominationCutoffAt"
              name="nominationCutoffAt"
              type="datetime-local"
              defaultValue={toDatetimeLocal(election.nomination_cutoff_at)}
              required
            />
          </div>
          <div>
            <Label htmlFor="confirmationCutoffAt" hint="(UTC)">
              Confirmation cutoff
            </Label>
            <Input
              id="confirmationCutoffAt"
              name="confirmationCutoffAt"
              type="datetime-local"
              defaultValue={toDatetimeLocal(election.confirmation_cutoff_at)}
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
              defaultValue={toDatetimeLocal(election.absentee_ballot_deadline)}
              required
            />
          </div>
          <div>
            <Label htmlFor="votingOpensAt" hint="(UTC)">
              Voting opens
            </Label>
            <Input
              id="votingOpensAt"
              name="votingOpensAt"
              type="datetime-local"
              defaultValue={toDatetimeLocal(election.voting_opens_at)}
              required
            />
          </div>
          <div>
            <Label htmlFor="votingClosesAt" hint="(UTC)">
              Voting closes
            </Label>
            <Input
              id="votingClosesAt"
              name="votingClosesAt"
              type="datetime-local"
              defaultValue={toDatetimeLocal(election.voting_closes_at)}
              required
            />
          </div>
        </div>

        <label className="flex items-center gap-2 text-sm text-slate-700">
          <input
            type="checkbox"
            checked={resultsPublished}
            onChange={(e) => setResultsPublished(e.target.checked)}
          />
          Publish results publicly
        </label>

        <Button type="submit" disabled={isPending}>
          {isPending ? "Saving..." : "Save changes"}
        </Button>
      </form>

      <div>
        <h2 className="mb-3 text-lg font-semibold text-slate-900">Seats per position</h2>
        <div className="space-y-2">
          {positions.map((position) => (
            <SeatsRow key={position.position} electionId={election.id} position={position} />
          ))}
        </div>
      </div>
    </div>
  );
}

function SeatsRow({
  electionId,
  position,
}: {
  electionId: string;
  position: ElectionPosition;
}) {
  const [seats, setSeats] = useState(position.seats);
  const [isPending, startTransition] = useTransition();

  return (
    <div className="flex items-center justify-between gap-3 rounded-md border border-slate-200 p-3">
      <span className="text-sm font-medium text-slate-800">
        {positionLabel(position.position)}
      </span>
      <div className="flex items-center gap-2">
        <Input
          type="number"
          min={1}
          value={seats}
          onChange={(e) => setSeats(Number(e.target.value))}
          className="w-20"
        />
        <Button
          variant="secondary"
          disabled={isPending}
          onClick={() =>
            startTransition(async () => {
              await updatePositionSeats(electionId, position.position, seats);
            })
          }
        >
          Save
        </Button>
      </div>
    </div>
  );
}
