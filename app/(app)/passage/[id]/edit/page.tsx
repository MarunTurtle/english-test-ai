"use client";

import { useParams } from "next/navigation";
import { usePassage } from "@/hooks/passages/use-passage";
import { PassageForm } from "@/components/passages/passage-form";
import { FiLoader, FiAlertCircle } from "react-icons/fi";

export default function PassageEditPage() {
  const params = useParams();
  const passageId = params?.id as string;
  const { passage, loading, error } = usePassage(passageId);

  // Loading state
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

  // Error state
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

  return <PassageForm mode="edit" initialPassage={passage} />;
}

