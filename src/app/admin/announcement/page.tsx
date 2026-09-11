import { getCurrentElection } from "@/lib/election/current-election";
import { AnnouncementForm } from "@/components/admin/AnnouncementForm";
import { Banner } from "@/components/ui/Card";

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

  return (
    <div className="space-y-6">
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
    </div>
  );
}
