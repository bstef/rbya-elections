import { notFound } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { positionLabel } from "@/lib/constants";
import { Banner } from "@/components/ui/Card";

interface CandidateStatusLookup {
  name: string;
  position: string;
  church: string;
  location: string;
  confirmed_at: string | null;
  accepted: boolean | null;
  ready: boolean;
  ignored: boolean;
  pastor_requested_at: string | null;
  pastor_approved: boolean | null;
  pastor_responded_at: string | null;
  positive_comment_count: number;
}

export default async function CandidateStatusPage({
  params,
}: {
  params: Promise<{ token: string }>;
}) {
  const { token } = await params;
  const supabase = await createClient();

  const { data } = await supabase.rpc("get_candidate_status", { p_token: token });
  const status = (data as CandidateStatusLookup[] | null)?.[0];

  if (!status) notFound();

  return (
    <div className="mx-auto max-w-xl space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-ink font-display">Your Candidacy Status</h1>
        <p className="mt-1 text-ink-muted">
          {status.name} &middot; {positionLabel(status.position)}
        </p>
        <p className="text-sm text-ink-faint">
          {status.church} &middot; {status.location}
        </p>
      </div>

      {status.ignored && (
        <Banner tone="warning">
          This nomination has been removed by the election committee. Contact
          them if you believe this is a mistake.
        </Banner>
      )}

      <div className="space-y-3">
        <StatusRow
          label="Nomination confirmed"
          done={!!status.confirmed_at}
          detail={
            status.confirmed_at === null
              ? "Waiting on your response to the confirmation email."
              : status.accepted
                ? "You accepted this nomination."
                : "You declined this nomination."
          }
        />
        {status.accepted && (
          <>
            <StatusRow
              label="Listed publicly"
              done={status.accepted === true && !status.ignored}
              detail={
                status.ignored
                  ? "Currently hidden by the election committee."
                  : "Visible on the public candidates page."
              }
            />
            <StatusRow
              label="Seconded"
              done={status.ready}
              detail={
                status.ready
                  ? `Marked as seconded (${status.positive_comment_count} note${status.positive_comment_count === 1 ? "" : "s"} of support so far).`
                  : `Not yet seconded (${status.positive_comment_count} note${status.positive_comment_count === 1 ? "" : "s"} of support so far).`
              }
            />
            <StatusRow
              label="Pastor vetting"
              done={status.pastor_approved === true}
              detail={
                !status.pastor_requested_at
                  ? "Not yet requested by the election committee."
                  : !status.pastor_responded_at
                    ? "Requested -- awaiting your pastor or youth leader's response."
                    : status.pastor_approved
                      ? "Your pastor/youth leader has vouched for you."
                      : "Your pastor/youth leader raised concerns -- the election committee will follow up with you."
              }
            />
          </>
        )}
      </div>
    </div>
  );
}

function StatusRow({
  label,
  done,
  detail,
}: {
  label: string;
  done: boolean;
  detail: string;
}) {
  return (
    <div className="flex items-start gap-3 rounded-lg border border-hairline bg-surface p-4">
      <span
        className={`mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full text-xs font-bold ${
          done
            ? "bg-emerald-100 text-emerald-800 dark:bg-emerald-900 dark:text-emerald-200"
            : "bg-surface-muted text-ink-faint"
        }`}
      >
        {done ? "✓" : "–"}
      </span>
      <div>
        <p className="font-medium text-ink">{label}</p>
        <p className="text-sm text-ink-muted">{detail}</p>
      </div>
    </div>
  );
}
