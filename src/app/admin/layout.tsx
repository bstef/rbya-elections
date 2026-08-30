import Link from "next/link";
import { createClient } from "@/lib/supabase/server";

const ADMIN_LINKS = [
  { href: "/admin/dashboard", label: "Dashboard" },
  { href: "/admin/elections", label: "Elections" },
  { href: "/admin/candidates", label: "Candidates" },
  { href: "/admin/comments", label: "Comments" },
  { href: "/admin/churches", label: "Churches" },
  { href: "/admin/delegates", label: "Delegates" },
  { href: "/admin/results", label: "Results" },
];

// Middleware (src/middleware.ts) already blocks unauthenticated/non-admin
// requests to any /admin/** route except this one's login page, and RLS
// enforces the same boundary at the data layer. This layout only decides
// whether to show the admin nav chrome.
export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return <div className="mx-auto max-w-md">{children}</div>;
  }

  return (
    <div className="flex flex-col gap-6 sm:flex-row">
      <nav className="flex shrink-0 flex-row gap-1 overflow-x-auto sm:w-48 sm:flex-col">
        {ADMIN_LINKS.map((link) => (
          <Link
            key={link.href}
            href={link.href}
            className="whitespace-nowrap rounded-md px-3 py-2 text-sm font-medium text-slate-700 hover:bg-slate-100"
          >
            {link.label}
          </Link>
        ))}
      </nav>
      <div className="min-w-0 flex-1">{children}</div>
    </div>
  );
}
