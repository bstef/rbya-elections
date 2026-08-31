import { createClient } from "@/lib/supabase/server";
import { getCurrentElection } from "@/lib/election/current-election";
import { positionLabel } from "@/lib/constants";
import { candidateState, CANDIDATE_STATE_LABELS } from "@/lib/election/candidate-state";
import { IgnoreToggleButton } from "@/components/admin/IgnoreToggleButton";
import { RequestVettingButton } from "@/components/admin/RequestVettingButton";
import { Banner, Card } from "@/components/ui/Card";
import { Avatar } from "@/components/ui/Avatar";
import type { Candidate } from "@/lib/types/models";

function vettingLabel(candidate: Candidate): string {
  if (!candidate.pastor_contact) return "No pastor contact on file";
  if (!candidate.pastor_requested_at) return "Not requested";
  if (!candidate.pastor_responded_at) return "Requested, awaiting response";
  return candidate.pastor_approved ? "Vouched for" : "Concerns raised";
}

const VETTING_BADGE_CLASSES: Record<string, string> = {
  "Vouched for": "bg-emerald-100 text-emerald-800 dark:bg-emerald-900 dark:text-emerald-200",
  "Concerns raised": "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200",
  "Requested, awaiting response": "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200",
};

export default async function AdminCandidatesPage() {
  const election = await getCurrentElection();

  if (!election) {
    return <Banner tone="warning">No election is marked current.</Banner>;
  }

  const supabase = await createClient();
  const { data: candidates } = await supabase
    .from("candidates")
    .select("*")
    .eq("election_id", election.id)
    .order("position")
    .order("name");

  const typed = (candidates ?? []) as Candidate[];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-ink font-display">{election.year} Candidates</h1>
        <p className="mt-1 text-ink-muted">
          Ignoring a candidate removes them from the public list, the ballot,
          and results -- use it for withdrawals or duplicate/invalid
          submissions. Pastor vetting sends the pastor/youth leader on file a
          link to vouch for the candidate.
        </p>
      </div>

      <div className="space-y-3">
        {typed.map((candidate) => {
          const vetting = vettingLabel(candidate);
          const canRequestVetting =
            !!candidate.pastor_contact && candidate.pastor_approved === null;

          return (
            <Card key={candidate.id}>
              <div className="flex flex-wrap items-start justify-between gap-4">
                <div className="flex items-start gap-3">
                  <Avatar imageUrl={candidate.image_url} name={candidate.name} size={40} />
                  <div>
                    <div className="flex flex-wrap items-center gap-2">
                      <p className="font-semibold text-ink">{candidate.name}</p>
                      <span className="rounded-full bg-surface-muted px-2 py-0.5 text-xs font-medium text-ink-muted">
                        {positionLabel(candidate.position)}
                      </span>
                      <span className="rounded-full bg-surface-muted px-2 py-0.5 text-xs font-medium text-ink-muted">
                        {CANDIDATE_STATE_LABELS[candidateState(candidate)]}
                      </span>
                    </div>
                    <p className="mt-1 text-sm text-ink-muted">{candidate.church}</p>
                    <p className="mt-2 text-sm">
                      <span className="text-ink-faint">Pastor vetting: </span>
                      <span
                        className={
                          VETTING_BADGE_CLASSES[vetting]
                            ? `rounded-full px-2 py-0.5 text-xs font-medium ${VETTING_BADGE_CLASSES[vetting]}`
                            : "text-ink-faint"
                        }
                      >
                        {vetting}
                      </span>
                      {candidate.pastor_contact && (
                        <span className="ml-2 text-ink-faint">({candidate.pastor_contact})</span>
                      )}
                    </p>
                  </div>
                </div>

                <div className="flex flex-col items-end gap-2">
                  <IgnoreToggleButton candidateId={candidate.id} ignored={candidate.ignored} />
                  {canRequestVetting && <RequestVettingButton candidateId={candidate.id} />}
                </div>
              </div>
            </Card>
          );
        })}
      </div>
    </div>
  );
}
