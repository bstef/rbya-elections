import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { Card } from "@/components/ui/Card";
import { CreateElectionForm } from "@/components/admin/CreateElectionForm";
import { SetCurrentElectionButton } from "@/components/admin/SetCurrentElectionButton";
import type { Election } from "@/lib/types/models";

export default async function AdminElectionsPage() {
  const supabase = await createClient();
  const { data: elections } = await supabase
    .from("elections")
    .select("*")
    .order("year", { ascending: false });

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold text-slate-900">Elections</h1>
        <p className="mt-1 text-slate-600">
          Only one election can be marked current at a time -- that&apos;s the
          one every public page and RPC uses.
        </p>
      </div>

      <div className="space-y-3">
        {((elections ?? []) as Election[]).map((election) => (
          <Card key={election.id} className="flex flex-wrap items-center justify-between gap-3">
            <div>
              <p className="font-semibold text-slate-900">
                {election.year}{" "}
                {election.is_current && (
                  <span className="ml-1 rounded-full bg-emerald-100 px-2 py-0.5 text-xs font-medium text-emerald-800">
                    Current
                  </span>
                )}
              </p>
              <p className="text-sm text-slate-500">
                Status: {election.status.replace(/_/g, " ")}
              </p>
            </div>
            <div className="flex items-center gap-2">
              <Link
                href={`/admin/elections/${election.id}/edit`}
                className="rounded-md border border-slate-300 px-3 py-2 text-sm font-medium text-slate-900 hover:bg-slate-50"
              >
                Edit
              </Link>
              {!election.is_current && <SetCurrentElectionButton electionId={election.id} />}
            </div>
          </Card>
        ))}
      </div>

      <div>
        <h2 className="mb-3 text-lg font-semibold text-slate-900">Create a new election</h2>
        <CreateElectionForm />
      </div>
    </div>
  );
}
