import { createClient } from "@/lib/supabase/server";
import { getCurrentElection } from "@/lib/election/current-election";
import { CandidateList } from "@/components/candidates/CandidateList";
import { Banner } from "@/components/ui/Card";
import type { Candidate } from "@/lib/types/models";

export default async function CandidatesPage() {
  const election = await getCurrentElection();

  if (!election) {
    return (
      <Banner tone="warning">
        There is no active election right now, so there are no candidates to
        show.
      </Banner>
    );
  }

  const supabase = await createClient();
  const { data, error } = await supabase
    .from("candidates")
    .select("*")
    .eq("election_id", election.id);

  if (error) throw error;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-ink font-display">
          {election.year} Candidates
        </h1>
        <p className="mt-1 text-ink-muted">
          Candidates who have accepted their nomination, grouped by position.
        </p>
      </div>
      <CandidateList candidates={(data ?? []) as Candidate[]} />
    </div>
  );
}
