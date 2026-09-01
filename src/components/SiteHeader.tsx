import Link from "next/link";
import Image from "next/image";
import { ThemeToggle } from "@/components/ThemeToggle";

const NAV_LINKS = [
  { href: "/candidates", label: "Candidates" },
  { href: "/nominate", label: "Nominate" },
  { href: "/delegates/register", label: "Register Delegates" },
  { href: "/results", label: "Results" },
  { href: "/about", label: "About" },
];

export function SiteHeader() {
  return (
    <header className="border-b border-hairline bg-surface">
      <div className="mx-auto flex max-w-5xl flex-wrap items-center justify-between gap-4 px-4 py-4">
        <Link href="/" className="shrink-0 rounded-md bg-white p-1.5">
          <Image
            src="/rbyaelections.png"
            alt="RBYA Elections"
            width={1774}
            height={887}
            priority
            className="h-9 w-auto"
          />
        </Link>
        <nav className="flex flex-wrap items-center gap-x-5 gap-y-2 text-sm font-medium text-ink-muted">
          {NAV_LINKS.map((link) => (
            <Link key={link.href} href={link.href} className="hover:text-ink">
              {link.label}
            </Link>
          ))}
          <Link
            href="/login"
            className="rounded-md bg-slate-900 px-3 py-1.5 text-white hover:bg-slate-700 dark:bg-slate-100 dark:text-slate-900 dark:hover:bg-slate-300"
          >
            Delegate Login
          </Link>
          <ThemeToggle />
        </nav>
      </div>
    </header>
  );
}
