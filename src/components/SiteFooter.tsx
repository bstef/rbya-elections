import Link from "next/link";

export function SiteFooter() {
  return (
    <footer className="mt-auto border-t border-slate-200 bg-white">
      <div className="mx-auto flex max-w-5xl flex-wrap items-center justify-between gap-2 px-4 py-6 text-sm text-slate-500">
        <p>Romanian Baptist Youth Association</p>
        <Link href="/admin/login" className="hover:text-slate-700">
          Election Committee Login
        </Link>
      </div>
    </footer>
  );
}
