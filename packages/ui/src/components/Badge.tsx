import * as React from "react";
import { cn } from "@superapp/utils";

export interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  variant?: "default" | "secondary" | "success" | "warning" | "destructive" | "outline";
}

/**
 * Hydration-Safe Badge Component
 * WAJIB merender tag <span> agar tidak memicu Hydration mismatch saat berada di dalam <p> atau flex.
 */
export function Badge({
  className,
  variant = "default",
  ...props
}: BadgeProps) {
  const variantClasses = {
    default: "bg-brand-emerald text-white dark:bg-emerald-600",
    secondary: "bg-slate-100 text-slate-800 dark:bg-slate-800 dark:text-slate-200",
    success: "bg-emerald-100 text-emerald-800 dark:bg-emerald-950/60 dark:text-emerald-300 border-emerald-200 dark:border-emerald-800",
    warning: "bg-amber-100 text-amber-800 dark:bg-amber-950/60 dark:text-amber-300 border-amber-200 dark:border-amber-800",
    destructive: "bg-red-100 text-red-800 dark:bg-red-950/60 dark:text-red-300 border-red-200 dark:border-red-800",
    outline: "text-slate-700 dark:text-slate-300 border border-slate-300 dark:border-slate-700",
  };

  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold transition-colors border border-transparent",
        variantClasses[variant],
        className
      )}
      {...props}
    />
  );
}
