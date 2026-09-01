import Link from "next/link";

const EXTERNAL_LINKS = [
  { href: "https://www.rbya.org/", label: "RBYA.org" },
  { href: "https://www.rbya.org/aboutus", label: "About Us" },
  { href: "https://www.rbya.org/events", label: "Events" },
  { href: "https://www.rbya.org/donate", label: "Donate" },
  { href: "https://www.instagram.com/r_b_y_a/", label: "Instagram" },
  { href: "https://www.facebook.com/RomanianBaptistYouthAssociation/", label: "Facebook" },
];

export function SiteFooter() {
  return (
    <footer className="mt-auto border-t border-hairline bg-surface">
      <div className="mx-auto flex max-w-5xl flex-wrap items-center justify-between gap-x-6 gap-y-2 px-4 py-4 text-xs text-ink-faint">
        <p className="font-display text-sm font-semibold text-ink">RBYA Elections</p>

        <nav className="flex flex-wrap items-center gap-x-4 gap-y-1">
          {EXTERNAL_LINKS.map((link) => (
            <a
              key={link.href}
              href={link.href}
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-ink-muted"
            >
              {link.label}
            </a>
          ))}
          <Link href="/about" className="hover:text-ink-muted">
            How it works
          </Link>
          <Link href="/admin/login" className="hover:text-ink-muted">
            Committee Login
          </Link>
        </nav>
      </div>
    </footer>
  );
}
