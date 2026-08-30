import { createClient } from "@/lib/supabase/server";
import { getCurrentElection } from "@/lib/election/current-election";
import { positionLabel } from "@/lib/constants";
import { candidateState, CANDIDATE_STATE_LABELS } from "@/lib/election/candidate-state";
import { IgnoreToggleButton } from "@/components/admin/IgnoreToggleButton";
import { Banner } from "@/components/ui/Card";
import type { Candidate } from "@/lib/types/models";

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
        <h1 className="text-2xl font-bold text-slate-900">{election.year} Candidates</h1>
        <p className="mt-1 text-slate-600">
          Ignoring a candidate removes them from the public list, the ballot,
          and results -- use it for withdrawals or duplicate/invalid
          submissions.
        </p>
      </div>

      <div className="overflow-x-auto rounded-lg border border-slate-200 bg-white">
        <table className="min-w-full divide-y divide-slate-200 text-sm">
          <thead className="bg-slate-50 text-left text-slate-500">
            <tr>
              <th className="px-4 py-2">Name</th>
              <th className="px-4 py-2">Position</th>
              <th className="px-4 py-2">Church</th>
              <th className="px-4 py-2">State</th>
              <th className="px-4 py-2" />
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {typed.map((candidate) => (
              <tr key={candidate.id}>
                <td className="px-4 py-2 font-medium text-slate-900">{candidate.name}</td>
                <td className="px-4 py-2 text-slate-700">
                  {positionLabel(candidate.position)}
                </td>
                <td className="px-4 py-2 text-slate-700">{candidate.church}</td>
                <td className="px-4 py-2 text-slate-700">
                  {CANDIDATE_STATE_LABELS[candidateState(candidate)]}
                </td>
                <td className="px-4 py-2">
                  <IgnoreToggleButton candidateId={candidate.id} ignored={candidate.ignored} />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
