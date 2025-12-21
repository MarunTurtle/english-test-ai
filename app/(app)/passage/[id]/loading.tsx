// Loading UI for passage detail page

import { FiLoader } from "react-icons/fi";

export default function Loading() {
  return (
    <div className="flex-1 flex items-center justify-center bg-slate-50 h-screen">
      <div className="text-center">
        <FiLoader className="w-8 h-8 text-blue-600 animate-spin mx-auto mb-4" />
        <p className="text-slate-600">Loading passage...</p>
      </div>
    </div>
  );
}
