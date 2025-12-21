"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { ReactNode } from "react";

interface SidebarNavItemProps {
  href: string;
  icon: ReactNode;
  label: string;
  isActive?: boolean;
}

export function SidebarNavItem({ href, icon, label, isActive: isActiveProp }: SidebarNavItemProps) {
  const pathname = usePathname();
  
  // Determine if this item is active
  const isActive = isActiveProp !== undefined 
    ? isActiveProp 
    : pathname === href || pathname.startsWith(href + '/');

  return (
    <Link
      href={href}
      className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-colors ${
        isActive
          ? 'bg-white text-blue-600 shadow-sm border border-slate-200'
          : 'text-slate-600 hover:bg-slate-200'
      }`}
    >
      <span className="w-4 h-4 flex items-center justify-center">
        {icon}
      </span>
      {label}
    </Link>
  );
}
