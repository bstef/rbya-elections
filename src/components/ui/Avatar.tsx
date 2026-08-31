function initialsFor(name?: string | null): string {
  if (!name) return "?";
  return name
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((word) => word[0]?.toUpperCase())
    .join("");
}

export function Avatar({
  imageUrl,
  name,
  size = 48,
}: {
  imageUrl?: string | null;
  name?: string | null;
  size?: number;
}) {
  const dimension = { width: size, height: size };

  if (imageUrl) {
    return (
      // eslint-disable-next-line @next/next/no-img-element -- external, user-uploaded Supabase Storage URLs
      <img
        src={imageUrl}
        alt={name ? `${name}'s photo` : "Candidate photo"}
        style={dimension}
        className="shrink-0 rounded-full border border-hairline object-cover"
      />
    );
  }

  return (
    <div
      style={dimension}
      className="flex shrink-0 items-center justify-center rounded-full border border-hairline bg-surface-muted text-sm font-semibold text-ink-faint"
    >
      {initialsFor(name)}
    </div>
  );
}
