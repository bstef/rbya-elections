import { notFound } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { positionLabel } from "@/lib/constants";
import { Banner } from "@/components/ui/Card";
import { PastorVettingForm } from "@/components/forms/PastorVettingForm";

interface PastorVettingLookup {
  name: string;
  position: string;
  church: string;
  location: string;
  submitter_name: string;
  pastor_approved: boolean | null;
  pastor_responded_at: string | null;
}

export default async function PastorVettingPage({
  params,
}: {
  params: Promise<{ token: string }>;
}) {
  const { token } = await params;
  const supabase = await createClient();

  const { data } = await supabase.rpc("get_pastor_vetting_candidate", { p_token: token });
  const candidate = (data as PastorVettingLookup[] | null)?.[0];

  if (!candidate) notFound();

  return (
    <div className="mx-auto max-w-xl space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-ink font-display">Pastor Vetting Request</h1>
        <p className="mt-1 text-ink-muted">
          {candidate.submitter_name} nominated{" "}
          <strong>{candidate.name}</strong> for{" "}
          <strong>{positionLabel(candidate.position)}</strong> on the RBYA committee.
          As their pastor or youth leader, the election committee is asking you to
          confirm you can vouch for this candidate&apos;s character and standing in
          the church.
        </p>
      </div>

      <div className="rounded-lg border border-hairline bg-surface p-4">
        <p className="font-semibold text-ink">{candidate.name}</p>
        <p className="text-sm text-ink-muted">
          {candidate.church} &middot; {candidate.location}
        </p>
      </div>

      {candidate.pastor_responded_at ? (
        <Banner tone="info">
          A response has already been recorded for this request
          {candidate.pastor_approved ? " (vouched for)." : "."}
        </Banner>
      ) : (
        <PastorVettingForm token={token} />
      )}
    </div>
  );
}
