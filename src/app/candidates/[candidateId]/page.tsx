import { notFound } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { positionLabel } from "@/lib/constants";
import { candidateState, CANDIDATE_STATE_LABELS } from "@/lib/election/candidate-state";
import { CommentForm } from "@/components/forms/CommentForm";
import { Avatar } from "@/components/ui/Avatar";
import type { Candidate, Comment } from "@/lib/types/models";

export default async function CandidateDetailPage({
  params,
}: {
  params: Promise<{ candidateId: string }>;
}) {
  const { candidateId } = await params;
  const supabase = await createClient();

  const { data: candidate } = await supabase
    .from("candidates")
    .select("*")
    .eq("id", candidateId)
    .maybeSingle();

  if (!candidate) notFound();

  const { data: comments } = await supabase
    .from("comments")
    .select("*")
    .eq("candidate_id", candidateId)
    .order("created_at", { ascending: false });

  const typedCandidate = candidate as Candidate;
  const typedComments = (comments ?? []) as Comment[];

  return (
    <div className="mx-auto max-w-2xl space-y-8">
      <div className="flex items-start gap-4">
        <Avatar imageUrl={typedCandidate.image_url} name={typedCandidate.name} size={72} />
        <div>
          <p className="text-sm font-medium text-ink-faint">
            {positionLabel(typedCandidate.position)}
          </p>
          <h1 className="text-2xl font-bold text-ink font-display">{typedCandidate.name}</h1>
          <p className="mt-1 text-ink-muted">
            {typedCandidate.church} &middot; {typedCandidate.location}
          </p>
          <div className="mt-2 flex flex-wrap gap-2">
            <span className="inline-block rounded-full bg-surface-muted px-2 py-0.5 text-xs font-medium text-ink-muted">
              {CANDIDATE_STATE_LABELS[candidateState(typedCandidate)]}
            </span>
            {typedCandidate.pastor_approved === true && (
              <span className="inline-flex items-center gap-1 rounded-full bg-emerald-100 px-2 py-0.5 text-xs font-medium text-emerald-800 dark:bg-emerald-900 dark:text-emerald-200">
                ✓ Pastor Vetted
              </span>
            )}
          </div>
        </div>
      </div>

      <section>
        <h2 className="mb-2 font-semibold text-ink">Background</h2>
        <p className="whitespace-pre-wrap text-ink-muted">{typedCandidate.background}</p>
      </section>

      <section>
        <h2 className="mb-2 font-semibold text-ink">Reasons for nomination</h2>
        <p className="whitespace-pre-wrap text-ink-muted">{typedCandidate.reasons}</p>
      </section>

      <section>
        <h2 className="mb-3 font-semibold text-ink">
          Notes of support ({typedComments.length})
        </h2>
        {typedComments.length === 0 ? (
          <p className="text-sm text-ink-faint">No public comments yet.</p>
        ) : (
          <ul className="space-y-3">
            {typedComments.map((comment) => (
              <li key={comment.id} className="rounded-md border border-hairline p-3">
                <p className="text-sm text-ink-muted">{comment.content}</p>
                <p className="mt-1 text-xs text-ink-faint">- {comment.submitter_name}</p>
              </li>
            ))}
          </ul>
        )}
      </section>

      <section>
        <h2 className="mb-3 font-semibold text-ink">Leave a comment</h2>
        <p className="mb-3 text-sm text-ink-muted">
          Notes of support are shown publicly and may mark this candidate as
          seconded. Objections are never shown online -- they are reviewed by
          the election committee and may be read aloud at Convention before
          voting.
        </p>
        <CommentForm candidateId={typedCandidate.id} />
      </section>
    </div>
  );
}
