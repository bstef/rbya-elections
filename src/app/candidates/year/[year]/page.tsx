import { notFound } from "next/navigation";
import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { getElectionByYear } from "@/lib/election/current-election";
import { CandidateList } from "@/components/candidates/CandidateList";
import type { Candidate } from "@/lib/types/models";

export default async function ArchivedCandidatesPage({
  params,
}: {
  params: Promise<{ year: string }>;
}) {
  const { year } = await params;
  const yearNum = Number(year);
  if (!Number.isInteger(yearNum)) notFound();

  const election = await getElectionByYear(yearNum);
  if (!election) notFound();

  const supabase = await createClient();
  const { data, error } = await supabase
    .from("candidates")
    .select("*")
    .eq("election_id", election.id);

  if (error) throw error;

  return (
    <div className="space-y-6">
      <div>
        <p className="text-sm">
          <Link href="/archive" className="text-ink-muted underline hover:text-ink">
            &larr; All elections
          </Link>
        </p>
        <h1 className="mt-1 text-2xl font-bold text-ink font-display">
          {election.year} Candidates
        </h1>
        <p className="mt-1 text-ink-muted">
          Candidates who accepted their nomination, grouped by position.
        </p>
      </div>
      <CandidateList candidates={(data ?? []) as Candidate[]} />
    </div>
  );
}
