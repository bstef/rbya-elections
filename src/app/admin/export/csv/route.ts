import { getCurrentElection } from "@/lib/election/current-election";
import { getCandidateRoster, getResultsRoster } from "@/lib/export/roster";

function csvField(value: string | number): string {
  const s = String(value);
  return /[",\n]/.test(s) ? `"${s.replace(/"/g, '""')}"` : s;
}

function toCsv(rows: string[][]): string {
  return rows.map((row) => row.map(csvField).join(",")).join("\r\n");
}

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

  const header =
    type === "candidates"
      ? ["Position", "Name", "Church"]
      : ["Position", "Name", "Votes", "Vote Share", "Elected"];

  const rows: string[][] = [header];
  for (const { positionLabel, names } of roster) {
    if (names.length === 0) {
      rows.push(type === "candidates" ? [positionLabel, "", ""] : [positionLabel, "Vacant", "", "", ""]);
      continue;
    }
    for (const n of names) {
      rows.push(
        type === "candidates"
          ? [positionLabel, n.name, n.church ?? ""]
          : [
              positionLabel,
              n.name,
              String(n.votes ?? ""),
              n.voteShare != null ? `${(n.voteShare * 100).toFixed(1)}%` : "",
              n.elected ? "Yes" : "No",
            ],
      );
    }
  }

  const csv = toCsv(rows);
  return new Response(csv, {
    headers: {
      "Content-Type": "text/csv; charset=utf-8",
      "Content-Disposition": `attachment; filename="rbya-${election.year}-${type}.csv"`,
    },
  });
}
