import * as React from "react";
import { cn } from "@superapp/utils";

export interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  variant?:
    | "default"
    | "brand"
    | "secondary"
    | "neutral"
    | "success"
    | "warning"
    | "destructive"
    | "outline";
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
    default: "bg-primary/10 text-primary border-primary/20",
    brand: "bg-primary text-primary-foreground border-transparent",
    secondary: "bg-subtle text-muted border-border",
    neutral: "bg-subtle text-muted border-border",
    success: "bg-emerald-500/15 text-emerald-700 dark:text-emerald-400 border-emerald-500/30",
    warning: "bg-amber-500/15 text-amber-700 dark:text-amber-400 border-amber-500/30",
    destructive: "bg-red-500/15 text-red-700 dark:text-red-400 border-red-500/30",
    outline: "text-main border-border",
  };

  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold transition-colors border",
        variantClasses[variant],
        className
      )}
      {...props}
    />
  );
}
