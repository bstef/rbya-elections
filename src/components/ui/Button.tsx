import { type ButtonHTMLAttributes, forwardRef } from "react";

type Variant = "primary" | "secondary" | "danger" | "ghost";

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
