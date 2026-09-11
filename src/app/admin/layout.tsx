import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { AdminMobileNav } from "@/components/admin/AdminMobileNav";
import { LogoutButton } from "@/components/admin/LogoutButton";

const ADMIN_LINKS = [
  { href: "/admin/dashboard", label: "Dashboard" },
  { href: "/admin/announcement", label: "Announcement" },
  { href: "/admin/elections", label: "Elections" },
  { href: "/admin/candidates", label: "Candidates" },
  { href: "/admin/comments", label: "Comments" },
  { href: "/admin/churches", label: "Churches" },
  { href: "/admin/delegates", label: "Delegates" },
  { href: "/admin/results", label: "Results" },
  { href: "/admin/export", label: "Export" },
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
      <div className="flex items-center gap-2 sm:hidden">
        <div className="flex-1">
          <AdminMobileNav links={ADMIN_LINKS} />
        </div>
        <LogoutButton className="border border-hairline" />
      </div>
      <nav className="hidden shrink-0 sm:flex sm:w-48 sm:flex-col sm:gap-1">
        {ADMIN_LINKS.map((link) => (
          <Link
            key={link.href}
            href={link.href}
            className="whitespace-nowrap rounded-md px-3 py-2 text-sm font-medium text-ink-muted hover:bg-surface-muted"
          >
            {link.label}
          </Link>
        ))}
        <div className="my-2 border-t border-hairline" />
        <LogoutButton />
      </nav>
      <div className="min-w-0 flex-1">{children}</div>
    </div>
  );
}
