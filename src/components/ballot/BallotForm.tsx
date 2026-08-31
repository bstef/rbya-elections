"use client";

import { useState, useTransition } from "react";
import { castVote, type CastVoteState } from "@/app/ballot/actions";
import { POSITIONS } from "@/lib/constants";
import type { PositionValue } from "@/lib/constants";
import { Button } from "@/components/ui/Button";
import { Banner } from "@/components/ui/Card";
import type { Candidate, ElectionPosition } from "@/lib/types/models";

export function BallotForm({
  candidates,
  positions,
  votedPositions,
}: {
  candidates: Candidate[];
  positions: ElectionPosition[];
  votedPositions: string[];
}) {
  const votedSet = new Set(votedPositions);
  const byPosition = new Map<PositionValue, Candidate[]>();
  for (const c of candidates) {
    if (!c.accepted || c.ignored) continue;
    const list = byPosition.get(c.position) ?? [];
    list.push(c);
    byPosition.set(c.position, list);
  }

  const groups = POSITIONS.map((p) => ({
    ...p,
    seats: positions.find((ep) => ep.position === p.value)?.seats ?? 1,
    candidates: (byPosition.get(p.value) ?? []).sort((a, b) =>
      a.name.localeCompare(b.name),
    ),
  })).filter((g) => g.candidates.length > 0);

  if (groups.length === 0) {
    return (
      <p className="text-ink-muted">
        No accepted candidates are on the ballot for this election yet.
      </p>
    );
  }

  return (
    <div className="space-y-6">
      {groups.map((group) => (
        <PositionBallot
          key={group.value}
          position={group.value}
          label={group.label}
          seats={group.seats}
          candidates={group.candidates}
          alreadyVoted={votedSet.has(group.value)}
        />
      ))}
    </div>
  );
}

function PositionBallot({
  position,
  label,
  seats,
  candidates,
  alreadyVoted,
}: {
  position: PositionValue;
  label: string;
  seats: number;
  candidates: Candidate[];
  alreadyVoted: boolean;
}) {
  const [selected, setSelected] = useState<string[]>([]);
  const [result, setResult] = useState<CastVoteState | null>(null);
  const [isPending, startTransition] = useTransition();
  const isSingleSeat = seats === 1;

  function toggle(id: string) {
    setSelected((prev) => {
      if (prev.includes(id)) return prev.filter((x) => x !== id);
      if (isSingleSeat) return [id];
      if (prev.length >= seats) return prev;
      return [...prev, id];
    });
  }

  function submit() {
    startTransition(async () => {
      const res = await castVote(position, selected);
      setResult(res);
    });
  }

  const voted = alreadyVoted || result?.status === "success";

  return (
    <div className="rounded-lg border border-hairline bg-surface p-4">
      <div className="mb-3 flex items-center justify-between">
        <h2 className="font-semibold text-ink">{label}</h2>
        <span className="text-xs text-ink-faint">
          {seats === 1 ? "Choose 1, or leave blank to abstain" : `Choose up to ${seats}`}
        </span>
      </div>

      {voted ? (
        <Banner tone="success">
          {result?.message ?? "You've already voted for this position."}
        </Banner>
      ) : (
        <>
          {result?.status === "error" && (
            <div className="mb-3">
              <Banner tone="error">{result.message}</Banner>
            </div>
          )}
          <div className="space-y-2">
            {candidates.map((candidate) => (
              <label
                key={candidate.id}
                className="flex items-center gap-2 rounded-md border border-hairline p-2 text-sm"
              >
                <input
                  type={isSingleSeat ? "radio" : "checkbox"}
                  name={`position-${position}`}
                  checked={selected.includes(candidate.id)}
                  onChange={() => toggle(candidate.id)}
                  disabled={
                    !isSingleSeat &&
                    !selected.includes(candidate.id) &&
                    selected.length >= seats
                  }
                />
                <span>
                  {candidate.name}{" "}
                  <span className="text-ink-faint">({candidate.church})</span>
                </span>
              </label>
            ))}
          </div>
          <Button className="mt-3" onClick={submit} disabled={isPending}>
            {isPending ? "Submitting..." : "Submit vote for this position"}
          </Button>
        </>
      )}
    </div>
  );
}
