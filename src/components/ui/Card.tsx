export function Card({
  children,
  className = "",
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div
      className={`rounded-lg border border-slate-200 bg-white p-6 shadow-sm ${className}`}
    >
      {children}
    </div>
  );
}

type BannerTone = "info" | "warning" | "error" | "success";

const toneClasses: Record<BannerTone, string> = {
  info: "bg-blue-50 text-blue-900 border-blue-200",
  warning: "bg-amber-50 text-amber-900 border-amber-200",
  error: "bg-red-50 text-red-900 border-red-200",
  success: "bg-emerald-50 text-emerald-900 border-emerald-200",
};

export function Banner({
  tone = "info",
  children,
}: {
  tone?: BannerTone;
  children: React.ReactNode;
}) {
  return (
    <div className={`rounded-md border px-4 py-3 text-sm ${toneClasses[tone]}`}>
      {children}
    </div>
  );
}
