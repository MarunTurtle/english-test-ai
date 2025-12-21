"use client";

import { useAuth } from "@/hooks/auth/use-auth";
import { FiLogOut } from "react-icons/fi";

export function LogoutButton() {
  const { signOut } = useAuth();

  return (
    <button
      onClick={signOut}
      className="w-full flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium text-slate-500 hover:bg-red-50 hover:text-red-600 transition-colors"
    >
      <FiLogOut className="w-4 h-4" />
      Sign Out
    </button>
  );
}
