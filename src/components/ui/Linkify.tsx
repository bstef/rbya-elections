// Turns any http(s):// or www.-prefixed URL inside plain text into a real
// link. Text-only in, so there's no HTML-injection risk from what's
// ultimately committee-entered content (e.g. the homepage announcement).
const URL_PATTERN = /(https?:\/\/[^\s]+|www\.[^\s]+)/g;

export function Linkify({
  text,
  className = "underline underline-offset-2 hover:opacity-80",
}: {
  text: string;
  className?: string;
}) {
  const parts = text.split(URL_PATTERN);

  return (
    <>
      {parts.map((part, i) => {
        if (!/^(https?:\/\/|www\.)/.test(part)) return part;
        const href = part.startsWith("www.") ? `https://${part}` : part;
        return (
          <a
            key={i}
            href={href}
            target="_blank"
            rel="noopener noreferrer"
            className={className}
          >
            {part}
          </a>
        );
      })}
    </>
  );
}
