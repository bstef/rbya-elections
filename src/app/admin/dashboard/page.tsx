import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { getCurrentElection } from "@/lib/election/current-election";
import { Banner, Card } from "@/components/ui/Card";

export default async function AdminDashboardPage() {
  const election = await getCurrentElection();

  if (!election) {
    return (
      <Banner tone="warning">
        No election is marked current.{" "}
        <Link href="/admin/elections" className="underline">
          Create or activate one.
        </Link>
      </Banner>
    );
  }

  const supabase = await createClient();

  const [{ data: candidates }, { data: delegates }] = await Promise.all([
    supabase
      .from("candidates")
      .select("id, accepted, confirmed_at, ignored")
      .eq("election_id", election.id),
    supabase.from("delegates").select("verified").eq("election_id", election.id),
  ]);

  const candidateIds = (candidates ?? []).map((c) => c.id);
  const { data: comments } =
    candidateIds.length > 0
      ? await supabase.from("comments").select("type").in("candidate_id", candidateIds)
      : { data: [] as { type: string }[] };

  const accepted = (candidates ?? []).filter((c) => c.accepted && !c.ignored).length;
  const pending = (candidates ?? []).filter((c) => !c.confirmed_at).length;
  const verifiedDelegates = (delegates ?? []).filter((d) => d.verified).length;
  const unverifiedDelegates = (delegates ?? []).filter((d) => !d.verified).length;
  const objections = (comments ?? []).filter((c) => c.type === "negative").length;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-ink font-display">{election.year} Dashboard</h1>
        <p className="mt-1 text-ink-muted">Status: {election.status.replace(/_/g, " ")}</p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard label="Accepted candidates" value={accepted} href="/admin/candidates" />
        <StatCard label="Pending confirmation" value={pending} href="/admin/candidates" />
        <StatCard
          label="Verified delegates"
          value={verifiedDelegates}
          href="/admin/delegates"
        />
        <StatCard
          label="Unverified delegates"
          value={unverifiedDelegates}
          href="/admin/delegates"
        />
        <StatCard label="Objections to review" value={objections} href="/admin/comments" />
      </div>
    </div>
  );
}

function StatCard({ label, value, href }: { label: string; value: number; href: string }) {
  return (
    <Link href={href}>
      <Card className="transition-shadow hover:shadow-md">
        <p className="text-sm text-ink-faint">{label}</p>
        <p className="mt-1 text-3xl font-bold text-ink">{value}</p>
      </Card>
    </Link>
  );
}
