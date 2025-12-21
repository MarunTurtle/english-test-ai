"use client";

import { BankTable } from "@/components/bank/bank-table";
import { FiSearch, FiSettings } from "react-icons/fi";

export default function BankPage() {
  return (
    <div className="flex-1 flex flex-col bg-slate-50 h-screen overflow-hidden">
      {/* Header */}
      <div className="p-8 border-b border-slate-200 bg-white flex-shrink-0">
        <h2 className="text-2xl font-bold text-slate-800">My Question Bank</h2>
        <div className="flex gap-4 mt-4">
          <div className="relative flex-1 max-w-md">
            <FiSearch className="absolute left-3 top-2.5 w-4 h-4 text-slate-400" />
            <input
              type="text"
              placeholder="Search by passage title or keyword..."
              className="w-full pl-10 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              disabled
            />
          </div>
          <button 
            className="px-4 py-2 bg-slate-800 text-white rounded-lg text-sm font-medium flex items-center gap-2 opacity-50 cursor-not-allowed"
            disabled
            title="Coming soon"
          >
            Filter <FiSettings className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Content */}
      <div className="p-8 overflow-y-auto flex-1">
        <BankTable />
      </div>
    </div>
  );
}
