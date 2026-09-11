import { getCurrentElection } from "@/lib/election/current-election";
import { getCandidateRoster, getResultsRoster } from "@/lib/export/roster";
import { Banner, Card } from "@/components/ui/Card";

const LINK_CLASSES =
  "inline-flex items-center justify-center rounded-md border border-hairline bg-surface px-4 py-2 text-sm font-medium text-ink transition-colors hover:bg-page";

function DownloadLink({ href, children }: { href: string; children: React.ReactNode }) {
  return (
    <a href={href} className={LINK_CLASSES}>
      {children}
    </a>
  );
}

function ExportSection({
  title,
  description,
  type,
  count,
}: {
  title: string;
  description: string;
  type: "candidates" | "results";
  count: number;
}) {
  return (
    <Card>
      <h2 className="text-lg font-semibold text-ink">{title}</h2>
      <p className="mt-1 text-sm text-ink-muted">{description}</p>

      {count === 0 ? (
        <p className="mt-4 text-sm text-ink-faint">Nothing to export yet.</p>
      ) : (
        <div className="mt-4 space-y-4">
          <div>
            <p className="mb-2 text-xs font-semibold tracking-wide text-ink-faint uppercase">
              Spreadsheet &amp; document
            </p>
            <div className="flex flex-wrap gap-2">
              <DownloadLink href={`/admin/export/csv?type=${type}`}>Download CSV</DownloadLink>
              <DownloadLink href={`/admin/export/pdf?type=${type}`}>Download PDF</DownloadLink>
            </div>
          </div>
          <div>
            <p className="mb-2 text-xs font-semibold tracking-wide text-ink-faint uppercase">
              Social media graphic (full roster)
            </p>
            <div className="flex flex-wrap gap-2">
              <DownloadLink href={`/admin/export/png?type=${type}&size=ig-post`}>
                Instagram post (1080&times;1080)
              </DownloadLink>
              <DownloadLink href={`/admin/export/png?type=${type}&size=ig-story`}>
                Instagram story (1080&times;1920)
              </DownloadLink>
              <DownloadLink href={`/admin/export/png?type=${type}&size=fb-post`}>
                Facebook post (1200&times;630)
              </DownloadLink>
            </div>
          </div>
        </div>
      )}
    </Card>
  );
}

export default async function AdminExportPage() {
  const election = await getCurrentElection();

  if (!election) {
    return <Banner tone="warning">No election is marked current.</Banner>;
  }

  const [candidateRoster, resultsRoster] = await Promise.all([
    getCandidateRoster(election.id),
    getResultsRoster(election.id),
  ]);

  const candidateCount = candidateRoster.reduce((sum, r) => sum + r.names.length, 0);
  const winnerCount = resultsRoster.reduce((sum, r) => sum + r.names.length, 0);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-ink font-sans">Export</h1>
        <p className="mt-1 text-ink-muted">
          Download the {election.year} candidate roster or election results as
          a spreadsheet, a formatted PDF, or a ready-to-post social media
          graphic.
        </p>
      </div>

      <ExportSection
        title="Candidates"
        description="Every accepted nominee, grouped by position -- good for a &ldquo;meet the candidates&rdquo; export before voting."
        type="candidates"
        count={candidateCount}
      />

      {!election.results_published && (
        <Banner tone="info">
          These results reflect current vote tallies, visible to you as an
          admin. The public results page won&apos;t show anything until you
          publish under Results.
        </Banner>
      )}

      <ExportSection
        title="Results"
        description="The winner(s) per position -- good for a &ldquo;congratulations to our new committee&rdquo; export or social post."
        type="results"
        count={winnerCount}
      />
    </div>
  );
}
