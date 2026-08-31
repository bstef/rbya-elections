import { type ButtonHTMLAttributes, forwardRef } from "react";

type Variant = "primary" | "secondary" | "danger" | "ghost";

const variantClasses: Record<Variant, string> = {
  // Inverts to a light pill in dark mode -- without this, bg-slate-900
  // matches the dark-mode surface color exactly and the button disappears.
  primary:
    "bg-slate-900 text-white hover:bg-slate-700 disabled:bg-slate-300 dark:bg-slate-100 dark:text-slate-900 dark:hover:bg-slate-300 dark:disabled:bg-slate-700",
  secondary:
    "bg-surface text-ink border border-hairline hover:bg-page disabled:text-ink-faint",
  danger:
    "bg-red-600 text-white hover:bg-red-500 disabled:bg-red-200 dark:disabled:bg-red-900",
  ghost: "bg-transparent text-ink-muted hover:bg-surface-muted disabled:text-ink-faint",
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
