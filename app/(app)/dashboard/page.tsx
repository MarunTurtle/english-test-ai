"use client";

import { useAuth } from "@/hooks/auth/use-auth";
import Link from "next/link";
import { FiPlus } from "react-icons/fi";
import { ROUTES } from "@/lib/constants/routes";
import { PassageList } from "@/components/passages/passage-list";

export default function DashboardPage() {
  const { user } = useAuth();

  return (
    <div className="flex-1 flex flex-col bg-slate-50 h-screen overflow-y-auto">
      {/* Header */}
      <div className="p-8 border-b border-slate-200 bg-white">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-slate-800">Dashboard</h1>
            <p className="text-slate-500 mt-1">
              Welcome back, {user?.email || 'Teacher'}!
            </p>
          </div>
          <Link
            href={ROUTES.PASSAGE_NEW}
            className="px-6 py-3 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-colors flex items-center gap-2 shadow-md"
          >
            <FiPlus className="w-5 h-5" />
            Create New Passage
          </Link>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 p-8">
        <PassageList />
      </div>
    </div>
  );
}
