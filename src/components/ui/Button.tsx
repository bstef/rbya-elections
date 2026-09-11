import { type ButtonHTMLAttributes, forwardRef } from "react";

type Variant = "primary" | "secondary" | "danger" | "ghost" | "accent" | "warning";

const variantClasses: Record<Variant, string> = {
  // Navy, matching the header/logo brand color. Inverts to a light pill in
  // dark mode -- without this, a dark navy button would sit almost flush
  // against the dark-mode surface color and disappear.
  primary:
    "bg-blue-950 text-white hover:bg-blue-800 disabled:bg-blue-300 dark:bg-blue-100 dark:text-blue-950 dark:hover:bg-blue-200 dark:disabled:bg-blue-900",
  secondary:
    "bg-surface text-ink border border-hairline hover:bg-page disabled:text-ink-faint",
  danger:
    "bg-red-600 text-white hover:bg-red-500 disabled:bg-red-200 dark:disabled:bg-red-900",
  ghost: "bg-transparent text-ink-muted hover:bg-surface-muted disabled:text-ink-faint",
  // Gold, matching the Romanian flag's yellow stripe (also the header's
  // accent gradient) -- bright enough to stay visible in both themes
  // without a dark: override, unlike the navy primary variant.
  accent:
    "bg-amber-400 text-blue-950 hover:bg-amber-300 disabled:bg-amber-200 disabled:text-blue-950/50",
  // Orange, not red -- for a destructive-ish action (Ignore) that needs to
  // read as "caution" without being mistaken for the red used elsewhere to
  // mean "declined by the nominee".
  warning:
    "bg-orange-600 text-white hover:bg-orange-500 disabled:bg-orange-200 dark:disabled:bg-orange-900",
};

export const Button = forwardRef<
  HTMLButtonElement,
  ButtonHTMLAttributes<HTMLButtonElement> & { variant?: Variant }
>(({ className = "", variant = "primary", ...props }, ref) => {
  return (
    <button
      ref={ref}
      className={`inline-flex items-center justify-center rounded-md px-4 py-2 text-sm font-medium transition-colors disabled:cursor-not-allowed ${variantClasses[variant]} ${className}`}
      {...props}
    />
  );
});
Button.displayName = "Button";
