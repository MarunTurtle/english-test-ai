"use client";

import { FiDatabase, FiHome } from "react-icons/fi";
import { SidebarNavItem } from "./sidebar-nav-item";
import { WorkflowIndicator } from "./workflow-indicator";
import { LogoutButton } from "@/components/auth/logout-button";
import { ROUTES } from "@/lib/constants/routes";
import { useWorkflow } from "@/contexts/workflow-context";

export function Sidebar() {
  const { currentStep } = useWorkflow();

  return (
    <div className="w-64 bg-slate-100 border-r border-slate-200 flex flex-col h-screen">
      {/* Header */}
      <div className="p-6 border-b border-slate-200">
        <h1 className="text-xl font-bold text-slate-800 flex items-center gap-2">
          <FiDatabase className="w-5 h-5 text-blue-600" />
          EnglishTestAI
        </h1>
        <p className="text-xs text-slate-500 mt-1 uppercase tracking-wider">
          Teacher Control Panel
        </p>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-4 space-y-2">
        <SidebarNavItem
          href={ROUTES.DASHBOARD}
          icon={<FiHome className="w-4 h-4" />}
          label="Dashboard"
        />
        <SidebarNavItem
          href={ROUTES.BANK}
          icon={<FiDatabase className="w-4 h-4" />}
          label="Question Bank"
        />
      </nav>

      {/* Footer */}
      <div className="p-4 border-t border-slate-200 space-y-4">
        <WorkflowIndicator currentStep={currentStep} />
        <LogoutButton />
      </div>
    </div>
  );
}
