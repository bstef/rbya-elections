import { createClient } from "@/lib/supabase/server";
import { getCurrentElection } from "@/lib/election/current-election";
import { delegateQuota } from "@/lib/election/eligibility";
import { VerifyDelegateButton } from "@/components/admin/VerifyDelegateButton";
import { DelegateCsvImportForm } from "@/components/admin/DelegateCsvImportForm";
import { Banner } from "@/components/ui/Card";
import type { Church, Delegate } from "@/lib/types/models";

export default async function AdminDelegatesPage() {
  const election = await getCurrentElection();

  if (!election) {
    return <Banner tone="warning">No election is marked current.</Banner>;
  }

  const supabase = await createClient();
  const [{ data: delegates }, { data: churches }, { data: youthCounts }] = await Promise.all([
    supabase
      .from("delegates")
      .select("*")
      .eq("election_id", election.id)
      .order("verified")
      .order("name"),
    supabase.from("churches").select("*").order("name"),
    supabase.from("church_youth_counts").select("*").eq("election_id", election.id),
  ]);

  const churchById = new Map(((churches ?? []) as Church[]).map((c) => [c.id, c]));
  const quotaByChurch = new Map(
    (youthCounts ?? []).map((row) => [row.church_id, delegateQuota(row.youth_count)]),
  );
  const registeredCountByChurch = new Map<string, number>();
  for (const d of (delegates ?? []) as Delegate[]) {
    registeredCountByChurch.set(
      d.church_id,
      (registeredCountByChurch.get(d.church_id) ?? 0) + 1,
    );
  }

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold text-ink font-display">{election.year} Delegates</h1>
        <p className="mt-1 text-ink-muted">
          Only verified delegates can log in and vote. Verify a church&apos;s
          submission after confirming it with them.
        </p>
      </div>

      <div className="overflow-x-auto rounded-lg border border-hairline bg-surface">
        <table className="min-w-full divide-y divide-hairline text-sm">
          <thead className="bg-page text-left text-ink-faint">
            <tr>
              <th className="px-4 py-2">Name</th>
              <th className="px-4 py-2">Email</th>
              <th className="px-4 py-2">Church</th>
              <th className="px-4 py-2">Type</th>
              <th className="px-4 py-2">Quota</th>
              <th className="px-4 py-2" />
            </tr>
          </thead>
          <tbody className="divide-y divide-hairline">
            {((delegates ?? []) as Delegate[]).map((delegate) => {
              const church = churchById.get(delegate.church_id);
              const quota = quotaByChurch.get(delegate.church_id);
              const registered = registeredCountByChurch.get(delegate.church_id) ?? 0;
              return (
                <tr key={delegate.id}>
                  <td className="px-4 py-2 font-medium text-ink">{delegate.name}</td>
                  <td className="px-4 py-2 text-ink-muted">{delegate.email}</td>
                  <td className="px-4 py-2 text-ink-muted">{church?.name ?? "Unknown"}</td>
                  <td className="px-4 py-2 text-ink-muted">{delegate.delegate_type}</td>
                  <td className="px-4 py-2 text-ink-muted">
                    {quota !== undefined ? `${registered} / ${quota}` : `${registered} / ?`}
                  </td>
                  <td className="px-4 py-2">
                    <VerifyDelegateButton delegateId={delegate.id} verified={delegate.verified} />
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      <div>
        <h2 className="mb-3 text-lg font-semibold text-ink">
          Import delegates (committee-entered, auto-verified)
        </h2>
        <DelegateCsvImportForm electionId={election.id} churches={(churches ?? []) as Church[]} />
      </div>
    </div>
  );
}
