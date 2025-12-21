"use client";

import { FiDatabase, FiSearch, FiSettings } from "react-icons/fi";

export default function BankPage() {
  return (
    <div className="flex-1 flex flex-col bg-slate-50 h-screen">
      {/* Header */}
      <div className="p-8 border-b border-slate-200 bg-white">
        <h2 className="text-2xl font-bold text-slate-800">My Question Bank</h2>
        <div className="flex gap-4 mt-4">
          <div className="relative flex-1 max-w-md">
            <FiSearch className="absolute left-3 top-2.5 w-4 h-4 text-slate-400" />
            <input
              type="text"
              placeholder="Search by passage title or keyword..."
              className="w-full pl-10 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <button className="px-4 py-2 bg-slate-800 text-white rounded-lg text-sm font-medium flex items-center gap-2">
            Filter <FiSettings className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Content */}
      <div className="p-8">
        <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
          <table className="w-full text-left">
            <thead className="bg-slate-50 border-b border-slate-100">
              <tr>
                <th className="px-6 py-4 text-xs font-bold text-slate-400 uppercase tracking-widest">
                  Passage Title
                </th>
                <th className="px-6 py-4 text-xs font-bold text-slate-400 uppercase tracking-widest">
                  Details
                </th>
                <th className="px-6 py-4 text-xs font-bold text-slate-400 uppercase tracking-widest">
                  Date
                </th>
                <th className="px-6 py-4 text-xs font-bold text-slate-400 uppercase tracking-widest text-right">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              <tr>
                <td colSpan={4} className="px-6 py-20 text-center text-slate-400">
                  <div className="flex flex-col items-center gap-3">
                    <FiDatabase className="w-12 h-12 text-slate-300" />
                    <p className="italic">
                      No questions saved yet. Start by generating a new set!
                    </p>
                  </div>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
