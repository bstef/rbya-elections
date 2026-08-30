import { createClient } from "@/lib/supabase/server";
import { getCurrentElection, getElectionPositions } from "@/lib/election/current-election";
import { getCurrentDelegate } from "@/lib/election/voter";
import { votingIsOpen, absenteeDeadlineHasPassed } from "@/lib/election/eligibility";
import { Banner } from "@/components/ui/Card";
import { BallotForm } from "@/components/ballot/BallotForm";
import type { Candidate, Ballot } from "@/lib/types/models";

export default async function BallotPage() {
  const election = await getCurrentElection();

  if (!election) {
    return <Banner tone="warning">There is no active election right now.</Banner>;
  }

  const delegate = await getCurrentDelegate(election.id);

  if (!delegate) {
    return (
      <Banner tone="error">
        We couldn&apos;t find you as a registered delegate for the {election.year}{" "}
        election. If you believe this is a mistake, contact your church or the
        election committee.
      </Banner>
    );
  }

  if (!votingIsOpen(election)) {
    return <Banner tone="warning">Voting is not currently open.</Banner>;
  }

  if (delegate.delegate_type === "absentee" && absenteeDeadlineHasPassed(election)) {
    return (
      <Banner tone="warning">
        The absentee ballot deadline for this election has passed.
      </Banner>
    );
  }

  const supabase = await createClient();

  const [{ data: candidates }, positions, { data: ballots }] = await Promise.all([
    supabase.from("candidates").select("*").eq("election_id", election.id),
    getElectionPositions(election.id),
    supabase.from("ballots").select("*").eq("delegate_id", delegate.id),
  ]);

  const votedPositions = ((ballots ?? []) as Ballot[]).map((b) => b.position);

  return (
    <div className="mx-auto max-w-2xl space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-900">{election.year} Ballot</h1>
        <p className="mt-1 text-slate-600">
          Welcome, {delegate.name}. Vote for each position below; each
          position can only be submitted once, and you may leave a position
          blank to abstain.
        </p>
      </div>

      <BallotForm
        candidates={(candidates ?? []) as Candidate[]}
        positions={positions}
        votedPositions={votedPositions}
      />
    </div>
  );
}
