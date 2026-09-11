import { getCurrentElection } from "@/lib/election/current-election";
import { getCandidateRoster, getResultsRoster } from "@/lib/export/roster";
import { buildRosterSocialImage, type SocialSize } from "@/lib/export/social-image";

export async function GET(request: Request) {
  const params = new URL(request.url).searchParams;
  const type = params.get("type");
  const size = params.get("size");

  if (type !== "candidates" && type !== "results") {
    return new Response("Invalid or missing ?type= (expected candidates or results)", { status: 400 });
  }
  if (size !== "ig-post" && size !== "ig-story" && size !== "fb-post") {
    return new Response("Invalid or missing ?size= (expected ig-post, ig-story, or fb-post)", { status: 400 });
  }

  const election = await getCurrentElection();
  if (!election) {
    return new Response("No election is marked current.", { status: 404 });
  }

  const roster =
    type === "candidates"
      ? await getCandidateRoster(election.id)
      : await getResultsRoster(election.id);

  const pngBytes = await buildRosterSocialImage({
    origin: new URL(request.url).origin,
    size: size as SocialSize,
    year: election.year,
    mode: type,
    roster,
  });

  const body: ArrayBuffer = new Uint8Array(pngBytes).buffer;
  return new Response(body, {
    headers: {
      "Content-Type": "image/png",
      "Content-Disposition": `attachment; filename="rbya-${election.year}-${type}-${size}.png"`,
    },
  });
}
