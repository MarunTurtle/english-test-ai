"use client";

import { useParams } from "next/navigation";
import { usePassage } from "@/hooks/passages/use-passage";
import { FiLoader, FiAlertCircle } from "react-icons/fi";

export default function PassageDetailPage() {
  const params = useParams();
  const passageId = params?.id as string;
  const { passage, loading, error } = usePassage(passageId);

  if (loading) {
    return (
      <div className="flex-1 flex items-center justify-center bg-slate-50">
        <div className="text-center">
          <FiLoader className="w-8 h-8 text-blue-600 animate-spin mx-auto mb-4" />
          <p className="text-slate-600">Loading passage...</p>
        </div>
      </div>
    );
  }

  if (error || !passage) {
    return (
      <div className="flex-1 flex items-center justify-center bg-slate-50">
        <div className="text-center max-w-md">
          <FiAlertCircle className="w-12 h-12 text-red-600 mx-auto mb-4" />
          <h2 className="text-xl font-bold text-slate-800 mb-2">Error Loading Passage</h2>
          <p className="text-slate-600">{error || "Passage not found"}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex-1 flex flex-col bg-slate-50 h-screen overflow-y-auto">
      {/* Header */}
      <div className="p-8 border-b border-slate-200 bg-white">
        <div>
          <h1 className="text-3xl font-bold text-slate-800">{passage.title}</h1>
          <p className="text-slate-500 mt-1">Grade Level: {passage.grade_level}</p>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 p-8">
        <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-8">
          <h2 className="text-xl font-bold text-slate-800 mb-4">Passage Content</h2>
          <div className="prose prose-slate max-w-none">
            <p className="text-slate-700 leading-relaxed whitespace-pre-wrap">{passage.content}</p>
          </div>
          
          <div className="mt-8 p-4 bg-blue-50 border border-blue-200 rounded-lg">
            <p className="text-sm text-blue-800">
              <strong>Next Step:</strong> Question generation workbench will be implemented in Phase 3.
              This page will include Input → Generate → Review workflow.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
