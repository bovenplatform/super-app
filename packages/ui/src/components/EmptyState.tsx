import * as React from "react";
import { cn } from "@superapp/utils";

export interface EmptyStateProps {
  icon?: React.ReactNode;
  title: string;
  description?: string;
  action?: React.ReactNode;
  className?: string;
}

export function EmptyState({
  icon,
  title,
  description,
  action,
  className,
}: EmptyStateProps) {
  return (
    <div
      className={cn(
        "flex flex-col items-center justify-center text-center p-8 sm:p-12 rounded-xl border border-dashed border-border bg-surface/50",
        className
      )}
    >
      {icon && (
        <div className="flex h-14 w-14 items-center justify-center rounded-full bg-subtle text-muted mb-4">
          {icon}
        </div>
      )}
      <h3 className="text-base sm:text-lg font-bold text-main mb-1.5">{title}</h3>
      {description && (
        <p className="text-xs sm:text-sm text-muted max-w-sm mb-6 leading-relaxed">
          {description}
        </p>
      )}
      {action && <div>{action}</div>}
    </div>
  );
}
