import { getCurrentElection } from "@/lib/election/current-election";
import { createClient } from "@/lib/supabase/server";
import { AnnouncementForm } from "@/components/admin/AnnouncementForm";
import { Banner } from "@/components/ui/Card";
import type { AnnouncementLog } from "@/lib/types/models";

function formatDateTime(value: string): string {
  return new Date(value).toLocaleString(undefined, {
    year: "numeric",
    month: "short",
    day: "numeric",
    hour: "numeric",
    minute: "2-digit",
  });
}

export default async function AdminAnnouncementPage() {
  const election = await getCurrentElection();

  if (!election) {
    return (
      <Banner tone="warning">
        No election is marked current -- mark one current under Elections
        before setting an announcement.
      </Banner>
    );
  }

  const supabase = await createClient();
  const { data: history } = await supabase
    .from("announcement_log")
    .select("*")
    .eq("election_id", election.id)
    .order("created_at", { ascending: false })
    .limit(50);

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-ink font-sans">
          Homepage Announcement
        </h1>
        <p className="mt-1 text-ink-muted">
          Shown on the homepage banner alongside the automatic
          nomination/voting/results notices -- use it for anything that
          doesn&apos;t fit those, like a postponement or a venue change. Leave
          it blank when there&apos;s nothing extra to say.
        </p>
      </div>
      <AnnouncementForm election={election} />

      <div>
        <h2 className="mb-3 text-lg font-semibold text-ink">History</h2>
        {(history ?? []).length === 0 ? (
          <p className="text-sm text-ink-faint">
            No changes yet -- every set or clear will show up here.
          </p>
        ) : (
          <div className="overflow-x-auto rounded-lg border border-hairline bg-surface">
            <table className="min-w-full divide-y divide-hairline text-sm">
              <thead className="bg-page text-left text-ink-faint">
                <tr>
                  <th className="px-4 py-2">Date &amp; time</th>
                  <th className="px-4 py-2">Action</th>
                  <th className="px-4 py-2">Message</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-hairline">
                {((history ?? []) as AnnouncementLog[]).map((entry) => (
                  <tr key={entry.id}>
                    <td className="px-4 py-2 whitespace-nowrap text-ink-muted">
                      {formatDateTime(entry.created_at)}
                    </td>
                    <td className="px-4 py-2">
                      {entry.message ? (
                        <span className="rounded-full bg-blue-100 dark:bg-blue-900 px-2 py-0.5 text-xs font-medium text-blue-800 dark:text-blue-200">
                          Set
                        </span>
                      ) : (
                        <span className="rounded-full bg-surface-muted px-2 py-0.5 text-xs font-medium text-ink-muted">
                          Cleared
                        </span>
                      )}
                    </td>
                    <td className="px-4 py-2 text-ink">{entry.message ?? "--"}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
