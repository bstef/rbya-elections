import Link from "next/link";

const RBYA_LINKS = [
  { href: "https://www.rbya.org/", label: "RBYA.org" },
  { href: "https://www.rbya.org/aboutus", label: "About Us" },
  { href: "https://www.rbya.org/events", label: "Events" },
  { href: "https://www.rbya.org/devotionals", label: "Devotionals" },
  { href: "https://www.rbya.org/contact", label: "Contact" },
  { href: "https://www.rbya.org/donate", label: "Donate" },
];

const SOCIAL_LINKS = [
  { href: "https://www.instagram.com/r_b_y_a/", label: "Instagram" },
  { href: "https://www.facebook.com/RomanianBaptistYouthAssociation/", label: "Facebook" },
  { href: "https://www.youtube.com/channel/UCN-xdseQXYV3xxufEXK4UxA", label: "YouTube" },
  { href: "https://www.rbya.org/podcast", label: "Podcast" },
];

export function SiteFooter() {
  return (
    <footer className="mt-auto border-t border-hairline bg-surface">
      <div className="mx-auto max-w-5xl px-4 py-8">
        <div className="flex flex-wrap justify-between gap-8">
          <div>
            <p className="font-display text-base font-semibold text-ink">RBYA Elections</p>
            <p className="mt-1 max-w-xs text-sm text-ink-faint">
              Romanian Baptist Youth Association committee elections.
            </p>
          </div>

          <div>
            <p className="text-sm font-semibold text-ink">RBYA.org</p>
            <ul className="mt-2 space-y-1.5 text-sm text-ink-faint">
              {RBYA_LINKS.map((link) => (
                <li key={link.href}>
                  <a
                    href={link.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="hover:text-ink-muted"
                  >
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <p className="text-sm font-semibold text-ink">Follow Us</p>
            <ul className="mt-2 space-y-1.5 text-sm text-ink-faint">
              {SOCIAL_LINKS.map((link) => (
                <li key={link.href}>
                  <a
                    href={link.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="hover:text-ink-muted"
                  >
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <p className="text-sm font-semibold text-ink">Elections</p>
            <ul className="mt-2 space-y-1.5 text-sm text-ink-faint">
              <li>
                <Link href="/about" className="hover:text-ink-muted">
                  How it works
                </Link>
              </li>
              <li>
                <Link href="/admin/login" className="hover:text-ink-muted">
                  Election Committee Login
                </Link>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </footer>
  );
}
