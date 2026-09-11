import { getCurrentElection } from "@/lib/election/current-election";
import { getCandidateRoster, getResultsRoster } from "@/lib/export/roster";
import { buildRosterPdf } from "@/lib/export/pdf";

export async function GET(request: Request) {
  const type = new URL(request.url).searchParams.get("type");
  if (type !== "candidates" && type !== "results") {
    return new Response("Invalid or missing ?type= (expected candidates or results)", { status: 400 });
  }

  const election = await getCurrentElection();
  if (!election) {
    return new Response("No election is marked current.", { status: 404 });
  }

  const roster =
    type === "candidates"
      ? await getCandidateRoster(election.id)
      : await getResultsRoster(election.id);

  const pdfBytes = await buildRosterPdf({
    origin: new URL(request.url).origin,
    year: election.year,
    title: type === "candidates" ? "Candidates" : "Election Results",
    mode: type,
    roster,
  });

  const body: ArrayBuffer = new Uint8Array(pdfBytes).buffer;
  return new Response(body, {
    headers: {
      "Content-Type": "application/pdf",
      "Content-Disposition": `attachment; filename="rbya-${election.year}-${type}.pdf"`,
    },
  });
}
