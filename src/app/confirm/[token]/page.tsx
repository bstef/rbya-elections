import { notFound } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { positionLabel } from "@/lib/constants";
import { Banner } from "@/components/ui/Card";
import { ConfirmForm } from "@/components/forms/ConfirmForm";

interface CandidateLookup {
  name: string;
  position: string;
  church: string;
  location: string;
  submitter_name: string;
  confirmed_at: string | null;
  accepted: boolean | null;
}

export default async function ConfirmPage({
  params,
}: {
  params: Promise<{ token: string }>;
}) {
  const { token } = await params;
  const supabase = await createClient();

  const { data } = await supabase.rpc("get_candidate_by_token", { p_token: token });
  const candidate = (data as CandidateLookup[] | null)?.[0];

  if (!candidate) notFound();

  return (
    <div className="mx-auto max-w-xl space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-ink font-display">Confirm Your Nomination</h1>
        <p className="mt-1 text-ink-muted">
          {candidate.submitter_name} nominated you for{" "}
          <strong>{positionLabel(candidate.position)}</strong>.
        </p>
      </div>

      <div className="rounded-lg border border-hairline bg-surface p-4">
        <p className="font-semibold text-ink">{candidate.name}</p>
        <p className="text-sm text-ink-muted">
          {candidate.church} &middot; {candidate.location}
        </p>
      </div>

      {candidate.confirmed_at ? (
        <Banner tone="info">
          You already responded to this nomination
          {candidate.accepted ? " and accepted it." : "."}
        </Banner>
      ) : (
        <ConfirmForm token={token} />
      )}
    </div>
  );
}
