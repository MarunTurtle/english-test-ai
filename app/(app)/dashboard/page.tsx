"use client";

import { useAuth } from "@/components/auth/auth-provider";

export default function DashboardPage() {
  const { user, signOut } = useAuth();

  return (
    <div className="min-h-screen flex flex-col items-center justify-center gap-4">
      <h1 className="text-4xl font-bold text-green-600">Login Succeeded!</h1>
      {user && (
        <div className="text-center">
          <p className="text-lg text-gray-600 mb-4">
            Welcome, {user.email}!
          </p>
          <button
            onClick={signOut}
            className="px-6 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors"
          >
            Sign Out
          </button>
        </div>
      )}
    </div>
  );
}
