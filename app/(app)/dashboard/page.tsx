"use client";

import { useAuth } from "@/hooks/auth/use-auth";
import Link from "next/link";
import { FiPlus } from "react-icons/fi";
import { ROUTES } from "@/lib/constants/routes";

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
        <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-12">
          <div className="text-center max-w-md mx-auto">
            <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <FiPlus className="w-8 h-8 text-slate-400" />
            </div>
            <h2 className="text-xl font-bold text-slate-800 mb-2">
              No passages yet
            </h2>
            <p className="text-slate-500 mb-6">
              Get started by creating your first reading passage. You'll be able to generate AI-powered questions from it.
            </p>
            <Link
              href={ROUTES.PASSAGE_NEW}
              className="inline-flex items-center gap-2 px-6 py-3 bg-slate-900 text-white rounded-lg font-medium hover:bg-slate-800 transition-colors"
            >
              <FiPlus className="w-5 h-5" />
              Create First Passage
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
