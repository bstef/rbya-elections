import Link from "next/link";

const EXTERNAL_LINKS = [
  { href: "https://www.rbya.org/", label: "RBYA.org", emoji: "🌐" },
  { href: "https://www.rbya.org/aboutus", label: "About Us", emoji: "ℹ️" },
  { href: "https://www.rbya.org/events", label: "Events", emoji: "📅" },
  { href: "https://www.rbya.org/donate", label: "Donate", emoji: "💝" },
  { href: "https://www.instagram.com/r_b_y_a/", label: "Instagram", emoji: "📸" },
  {
    href: "https://www.facebook.com/RomanianBaptistYouthAssociation/",
    label: "Facebook",
    emoji: "📘",
  },
];

export function SiteFooter() {
  return (
    <footer className="mt-auto border-t border-hairline bg-surface">
      <div className="mx-auto flex max-w-5xl flex-wrap items-center justify-between gap-x-6 gap-y-2 px-4 py-4 text-xs text-ink-faint">
        <Link href="/" className="shrink-0 font-display text-base font-bold text-ink">
          RBYA Committee Elections
        </Link>

        <nav className="flex flex-wrap items-center gap-x-4 gap-y-1">
          {EXTERNAL_LINKS.map((link) => (
            <a
              key={link.href}
              href={link.href}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1 hover:text-ink-muted"
            >
              <span aria-hidden="true">{link.emoji}</span>
              {link.label}
            </a>
          ))}
          <Link href="/about" className="inline-flex items-center gap-1 hover:text-ink-muted">
            <span aria-hidden="true">🗳️</span>
            How it works
          </Link>
          <Link href="/admin/login" className="inline-flex items-center gap-1 hover:text-ink-muted">
            <span aria-hidden="true">🔐</span>
            Committee Login
          </Link>
        </nav>
      </div>
    </footer>
  );
}
