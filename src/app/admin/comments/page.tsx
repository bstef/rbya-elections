import { createClient } from "@/lib/supabase/server";
import { getCurrentElection } from "@/lib/election/current-election";
import { positionLabel } from "@/lib/constants";
import { DeleteCommentButton } from "@/components/admin/DeleteCommentButton";
import { Banner } from "@/components/ui/Card";
import type { Candidate, Comment } from "@/lib/types/models";

export default async function AdminCommentsPage() {
  const election = await getCurrentElection();

  if (!election) {
    return <Banner tone="warning">No election is marked current.</Banner>;
  }

  const supabase = await createClient();
  const { data: candidates } = await supabase
    .from("candidates")
    .select("*")
    .eq("election_id", election.id);

  const candidateById = new Map(
    ((candidates ?? []) as Candidate[]).map((c) => [c.id, c]),
  );
  const candidateIds = Array.from(candidateById.keys());

  const { data: comments } =
    candidateIds.length > 0
      ? await supabase
          .from("comments")
          .select("*")
          .in("candidate_id", candidateIds)
          .order("type", { ascending: true })
          .order("created_at", { ascending: false })
      : { data: [] as Comment[] };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-ink font-display">Comment Moderation</h1>
        <p className="mt-1 text-ink-muted">
          Objections are never shown on the public site -- review them here
          and prepare what should be read aloud at Convention before voting.
        </p>
      </div>

      {(comments ?? []).length === 0 ? (
        <p className="text-ink-muted">No comments yet.</p>
      ) : (
        <div className="space-y-3">
          {((comments ?? []) as Comment[]).map((comment) => {
            const candidate = candidateById.get(comment.candidate_id);
            return (
              <div
                key={comment.id}
                className="rounded-lg border border-hairline bg-surface p-4"
              >
                <div className="flex flex-wrap items-start justify-between gap-2">
                  <div>
                    <span
                      className={`mr-2 rounded-full px-2 py-0.5 text-xs font-medium ${
                        comment.type === "negative"
                          ? "bg-red-100 dark:bg-red-900 text-red-800 dark:text-red-200"
                          : "bg-emerald-100 dark:bg-emerald-900 text-emerald-800 dark:text-emerald-200"
                      }`}
                    >
                      {comment.type === "negative" ? "Objection" : "Support"}
                    </span>
                    <span className="font-medium text-ink">
                      {candidate?.name ?? "Unknown candidate"}
                    </span>
                    {candidate && (
                      <span className="ml-1 text-sm text-ink-faint">
                        ({positionLabel(candidate.position)})
                      </span>
                    )}
                  </div>
                  <DeleteCommentButton commentId={comment.id} />
                </div>
                <p className="mt-2 text-sm text-ink-muted">{comment.content}</p>
                <p className="mt-1 text-xs text-ink-faint">
                  {comment.submitter_name} &middot; {comment.submitter_email}
                </p>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
