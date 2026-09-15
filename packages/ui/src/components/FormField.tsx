import * as React from "react";
import { cn } from "@superapp/utils";

export interface FormFieldProps {
  label?: string;
  required?: boolean;
  error?: string;
  description?: React.ReactNode;
  htmlFor?: string;
  className?: string;
  children: React.ReactNode;
}

export function FormField({
  label,
  required,
  error,
  description,
  htmlFor,
  className,
  children,
}: FormFieldProps) {
  return (
    <div className={cn("space-y-1.5 w-full", className)}>
      {label && (
        <label
          htmlFor={htmlFor}
          className="block text-sm font-semibold text-main"
        >
          {label}
          {required && <span className="text-destructive ml-1">*</span>}
        </label>
      )}
      {children}
      {description && !error && (
        <div className="text-xs text-muted leading-normal">{description}</div>
      )}
      {error && (
        <p className="text-xs font-medium text-destructive leading-normal">
          {error}
        </p>
      )}
    </div>
  );
}
