"use client";

import { useAuth } from "@/hooks/auth/use-auth";

interface AuthGuardProps {
  children: React.ReactNode;
}

export function AuthGuard({ children }: AuthGuardProps) {
  const { user, loading } = useAuth();

  // Show loading state while checking authentication
  // Middleware will handle redirects, so we just need to show loading
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-sm text-slate-500">Loading...</p>
        </div>
      </div>
    );
  }

  // If not authenticated, show nothing (middleware will redirect)
  if (!user) {
    return null;
  }

  // Render children if authenticated
  return <>{children}</>;
}
