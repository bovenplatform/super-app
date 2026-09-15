import * as React from "react";
import { cn } from "@superapp/utils";

export interface CheckboxProps
  extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: React.ReactNode;
  description?: string;
}

export const Checkbox = React.forwardRef<HTMLInputElement, CheckboxProps>(
  ({ className, label, description, id, ...props }, ref) => {
    const generatedId = React.useId();
    const inputId = id || generatedId;

    return (
      <div className="flex items-start gap-3 select-none">
        <input
          id={inputId}
          type="checkbox"
          ref={ref}
          className={cn(
            "h-4 w-4 mt-0.5 rounded border border-border bg-surface text-primary accent-primary focus:ring-2 focus:ring-primary focus:ring-offset-1 transition cursor-pointer disabled:cursor-not-allowed disabled:opacity-50",
            className
          )}
          {...props}
        />
        {label && (
          <div className="text-sm">
            <label
              htmlFor={inputId}
              className="font-medium text-main cursor-pointer"
            >
              {label}
            </label>
            {description && (
              <p className="text-xs text-muted mt-0.5 leading-normal">
                {description}
              </p>
            )}
          </div>
        )}
      </div>
    );
  }
);
Checkbox.displayName = "Checkbox";
