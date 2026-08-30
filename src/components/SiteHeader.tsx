import Link from "next/link";

const NAV_LINKS = [
  { href: "/candidates", label: "Candidates" },
  { href: "/nominate", label: "Nominate" },
  { href: "/delegates/register", label: "Register Delegates" },
  { href: "/results", label: "Results" },
  { href: "/about", label: "About" },
];

export function SiteHeader() {
  return (
    <header className="border-b border-slate-200 bg-white">
      <div className="mx-auto flex max-w-5xl flex-wrap items-center justify-between gap-4 px-4 py-4">
        <Link href="/" className="text-lg font-semibold text-slate-900">
          RBYA Elections
        </Link>
        <nav className="flex flex-wrap items-center gap-x-5 gap-y-2 text-sm font-medium text-slate-600">
          {NAV_LINKS.map((link) => (
            <Link key={link.href} href={link.href} className="hover:text-slate-900">
              {link.label}
            </Link>
          ))}
          <Link
            href="/login"
            className="rounded-md bg-slate-900 px-3 py-1.5 text-white hover:bg-slate-700"
          >
            Delegate Login
          </Link>
        </nav>
      </div>
    </header>
  );
}
