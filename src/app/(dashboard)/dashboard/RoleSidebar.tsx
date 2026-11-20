"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { ROLE_NAV_ITEMS, RoleBadge, UserRole } from "./RoleConfig";
import { LogOut } from "lucide-react";

interface RoleSidebarProps {
  role: UserRole;
  userName?: string | null;
  userImage?: string | null;
  onSignOut?: () => void;
}

export default function RoleSidebar({
  role,
  userName,
  userImage,
  onSignOut,
}: RoleSidebarProps) {
  const pathname = usePathname();
  const navItems = ROLE_NAV_ITEMS[role];

  const fallbackAvatar = `https://ui-avatars.com/api/?name=${encodeURIComponent(
    userName || "User"
  )}&background=ff5722&color=fff&bold=true`;

  return (
    <aside className="w-full lg:w-64 shrink-0 rounded-[2rem] bg-white/45 backdrop-blur-xl border border-white/85 p-5 shadow-[12px_12px_28px_rgba(15,23,42,0.08),-10px_-10px_24px_rgba(255,255,255,0.92)] flex flex-col justify-between gap-6">
      <div className="space-y-5">
        <div className="flex items-center justify-between px-2">
          <span className="text-[11px] font-extrabold uppercase tracking-wider text-gray-500">
            Menu
          </span>
          <RoleBadge role={role} />
        </div>

        <nav className="flex flex-col gap-1.5">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive =
              pathname === item.href ||
              (item.href !== `/dashboard/${role}` &&
                pathname?.startsWith(item.href));

            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex items-center gap-3 px-4 py-3 rounded-2xl text-sm font-bold transition-all ${
                  isActive
                    ? "bg-gradient-to-r from-[#ff5722] to-[#ff6d3f] text-white shadow-[0_8px_18px_rgba(255,87,34,0.28)]"
                    : "text-gray-700 hover:bg-white/65 hover:text-gray-900"
                }`}
              >
                <Icon
                  size={18}
                  className={isActive ? "text-white" : "text-[#ff5722]"}
                />
                <span>{item.label}</span>
              </Link>
            );
          })}
        </nav>
      </div>

      <div className="pt-4 border-t border-white/75 space-y-3">
        <div className="flex items-center gap-3 px-2">
          <img
            src={userImage || fallbackAvatar}
            alt={userName || "User"}
            className="w-9 h-9 rounded-full object-cover border-2 border-white shadow-2xs"
          />
          <div className="min-w-0">
            <p className="text-xs font-extrabold text-gray-900 truncate">
              {userName || "FixLab User"}
            </p>
            <p className="text-[10px] font-bold uppercase text-[#ff5722]">
              {role}
            </p>
          </div>
        </div>

        {onSignOut && (
          <button
            type="button"
            onClick={onSignOut}
            className="w-full flex items-center justify-center gap-2 px-4 py-2.5 rounded-2xl bg-white/60 hover:bg-red-50 text-gray-700 hover:text-red-600 border border-white/80 text-xs font-extrabold transition-all cursor-pointer"
          >
            <LogOut size={15} />
            <span>Sign Out</span>
          </button>
        )}
      </div>
    </aside>
  );
}