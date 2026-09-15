import * as React from "react";

export interface CanProps {
  permissions?: string[];
  role?: string | null;
  do?: string;
  isSuperAdmin?: boolean;
  children: React.ReactNode;
  fallback?: React.ReactNode;
}

/**
 * RBAC UI Conditional Gate
 * Merender children jika user memiliki permission atau merupakan Superadmin.
 */
export function Can({
  permissions = [],
  role,
  do: requiredAction,
  isSuperAdmin = false,
  children,
  fallback = null,
}: CanProps) {
  if (isSuperAdmin || role === "superadmin") {
    return <>{children}</>;
  }

  if (requiredAction && !permissions.includes(requiredAction)) {
    return <>{fallback}</>;
  }

  return <>{children}</>;
}
