import { notFound } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { positionLabel } from "@/lib/constants";
import { candidateState, CANDIDATE_STATE_LABELS } from "@/lib/election/candidate-state";
import { CommentForm } from "@/components/forms/CommentForm";
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
      <div>
        <p className="text-sm font-medium text-slate-500">
          {positionLabel(typedCandidate.position)}
        </p>
        <h1 className="text-2xl font-bold text-slate-900">{typedCandidate.name}</h1>
        <p className="mt-1 text-slate-600">
          {typedCandidate.church} &middot; {typedCandidate.location}
        </p>
        <span className="mt-2 inline-block rounded-full bg-slate-100 px-2 py-0.5 text-xs font-medium text-slate-700">
          {CANDIDATE_STATE_LABELS[candidateState(typedCandidate)]}
        </span>
      </div>

      <section>
        <h2 className="mb-2 font-semibold text-slate-900">Background</h2>
        <p className="whitespace-pre-wrap text-slate-700">{typedCandidate.background}</p>
      </section>

      <section>
        <h2 className="mb-2 font-semibold text-slate-900">Reasons for nomination</h2>
        <p className="whitespace-pre-wrap text-slate-700">{typedCandidate.reasons}</p>
      </section>

      <section>
        <h2 className="mb-3 font-semibold text-slate-900">
          Notes of support ({typedComments.length})
        </h2>
        {typedComments.length === 0 ? (
          <p className="text-sm text-slate-500">No public comments yet.</p>
        ) : (
          <ul className="space-y-3">
            {typedComments.map((comment) => (
              <li key={comment.id} className="rounded-md border border-slate-200 p-3">
                <p className="text-sm text-slate-700">{comment.content}</p>
                <p className="mt-1 text-xs text-slate-500">- {comment.submitter_name}</p>
              </li>
            ))}
          </ul>
        )}
      </section>

      <section>
        <h2 className="mb-3 font-semibold text-slate-900">Leave a comment</h2>
        <p className="mb-3 text-sm text-slate-600">
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
