import { createClient } from "@/lib/supabase/server";
import { getCurrentElection } from "@/lib/election/current-election";
import { CreateChurchForm } from "@/components/admin/CreateChurchForm";
import { YouthCountInput } from "@/components/admin/YouthCountInput";
import { Banner } from "@/components/ui/Card";
import type { Church } from "@/lib/types/models";

export default async function AdminChurchesPage() {
  const election = await getCurrentElection();
  const supabase = await createClient();

  const [{ data: churches }, youthCountsResult] = await Promise.all([
    supabase.from("churches").select("*").order("name"),
    election
      ? supabase.from("church_youth_counts").select("*").eq("election_id", election.id)
      : Promise.resolve({ data: [] as { church_id: string; youth_count: number }[] }),
  ]);

  const youthCountByChurch = new Map(
    (youthCountsResult.data ?? []).map((row) => [row.church_id, row.youth_count]),
  );

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold text-ink font-display">Churches</h1>
        <p className="mt-1 text-ink-muted">
          Youth counts drive each church&apos;s delegate quota (1 per 10 youth,
          rounded up) for the current election.
        </p>
      </div>

      {!election && (
        <Banner tone="warning">
          No election is marked current -- youth counts can&apos;t be set until
          one is.
        </Banner>
      )}

      <div className="space-y-2">
        {((churches ?? []) as Church[]).map((church) => (
          <div
            key={church.id}
            className="flex flex-wrap items-center justify-between gap-3 rounded-lg border border-hairline bg-surface p-4"
          >
            <div>
              <p className="font-medium text-ink">{church.name}</p>
              <p className="text-sm text-ink-faint">{church.city_state}</p>
            </div>
            {election && (
              <YouthCountInput
                electionId={election.id}
                churchId={church.id}
                initialCount={youthCountByChurch.get(church.id) ?? null}
              />
            )}
          </div>
        ))}
      </div>

      <div>
        <h2 className="mb-3 text-lg font-semibold text-ink">Add a church</h2>
        <CreateChurchForm />
      </div>
    </div>
  );
}
