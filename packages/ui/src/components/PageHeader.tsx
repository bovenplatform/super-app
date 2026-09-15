import * as React from "react";
import { cn } from "@superapp/utils";

export interface PageHeaderProps {
  title: string;
  description?: string;
  backHref?: string;
  backLabel?: string;
  action?: React.ReactNode;
  badge?: React.ReactNode;
  className?: string;
}

export function PageHeader({
  title,
  description,
  backHref,
  backLabel = "Kembali",
  action,
  badge,
  className,
}: PageHeaderProps) {
  return (
    <div
      className={cn(
        "flex flex-col md:flex-row md:items-center md:justify-between gap-4 pb-6 border-b border-border",
        className
      )}
    >
      <div className="space-y-1">
        {backHref && (
          <a
            href={backHref}
            className="inline-flex items-center text-xs font-semibold text-primary hover:underline mb-1 gap-1"
          >
            ← {backLabel}
          </a>
        )}
        <div className="flex items-center gap-3 flex-wrap">
          <h1 className="text-2xl sm:text-3xl font-extrabold text-main tracking-tight">
            {title}
          </h1>
          {badge}
        </div>
        {description && (
          <p className="text-sm text-muted leading-relaxed max-w-3xl">
            {description}
          </p>
        )}
      </div>

      {action && (
        <div className="flex items-center gap-3 flex-wrap sm:flex-nowrap shrink-0">
          {action}
        </div>
      )}
    </div>
  );
}
