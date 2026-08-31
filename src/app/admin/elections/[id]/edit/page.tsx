import { notFound } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { EditElectionForm } from "@/components/admin/EditElectionForm";
import type { Election, ElectionPosition } from "@/lib/types/models";

export default async function EditElectionPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const supabase = await createClient();

  const [{ data: election }, { data: positions }] = await Promise.all([
    supabase.from("elections").select("*").eq("id", id).maybeSingle(),
    supabase.from("election_positions").select("*").eq("election_id", id),
  ]);

  if (!election) notFound();

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-ink font-display">Edit {election.year} Election</h1>
      <EditElectionForm
        election={election as Election}
        positions={(positions ?? []) as ElectionPosition[]}
      />
    </div>
  );
}
