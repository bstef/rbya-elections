import { getCurrentElection } from "@/lib/election/current-election";
import { nominationsAreOpen } from "@/lib/election/eligibility";
import { Banner } from "@/components/ui/Card";
import { NominationForm } from "@/components/forms/NominationForm";

export default async function NominatePage() {
  const election = await getCurrentElection();
  const open = election ? nominationsAreOpen(election) : false;

  return (
    <div className="mx-auto max-w-2xl space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-ink font-display">Nominate a Candidate</h1>
        <p className="mt-1 text-ink-muted">
          Anyone can nominate an RBYA member for a committee position. The
          nominee will receive an email to confirm before appearing publicly.
        </p>
      </div>

      {!open ? (
        <Banner tone="warning">
          {election
            ? `Nominations are closed for the ${election.year} election.`
            : "There is no active election accepting nominations right now."}
        </Banner>
      ) : (
        <NominationForm />
      )}
    </div>
  );
}
