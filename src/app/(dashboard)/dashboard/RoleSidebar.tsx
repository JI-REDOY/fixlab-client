"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { authClient } from "@/lib/auth-client";
import { fetchApi } from "@/lib/api";
import { ROLE_NAV_ITEMS, RoleBadge, UserRole } from "./RoleConfig";
import { LogOut, Sparkles, Crown } from "lucide-react";

interface RoleSidebarProps {
  role: UserRole;
  userName?: string | null;
  userImage?: string | null;
  onSignOut?: () => void;
  plan?: "free" | "pro" | string;
}

const PRO_STORAGE_KEY = "fixlab_pro_subscription";

function hasActiveStoredPro(email?: string | null): boolean {
  if (typeof window === "undefined" || !email) return false;
  try {
    const raw = localStorage.getItem(PRO_STORAGE_KEY);
    if (!raw) return false;
    const parsed = JSON.parse(raw);
    if (!parsed?.proExpiresAt || !parsed?.email) return false;
    if (
      String(parsed.email).trim().toLowerCase() !==
      String(email).trim().toLowerCase()
    ) {
      return false;
    }
    return new Date(parsed.proExpiresAt).getTime() > Date.now();
  } catch {
    return false;
  }
}

function checkProStatus(payload: any): boolean {
  if (!payload || typeof payload !== "object") return false;

  const targets = [
    payload,
    payload?.user,
    payload?.data,
    payload?.data?.user,
    payload?.profile,
    payload?.subscription,
  ].filter(Boolean);

  for (const item of targets) {
    const planVal = String(
      item?.plan || item?.subscriptionPlan || item?.tier || ""
    )
      .trim()
      .toLowerCase();

    const statusVal = String(
      item?.subscriptionStatus || item?.proStatus || item?.status || ""
    )
      .trim()
      .toLowerCase();

    const hasProFlag = Boolean(
      item?.isVerifiedPro ||
        item?.isPro ||
        item?.pro ||
        planVal === "pro" ||
        planVal.includes("pro") ||
        statusVal === "pro"
    );

    if (!hasProFlag) continue;

    const expiresAt =
      item?.proExpiresAt ||
      item?.subscriptionExpiresAt ||
      item?.expiresAt ||
      null;

    if (expiresAt) {
      const expiryMs = new Date(expiresAt).getTime();
      if (!Number.isNaN(expiryMs) && expiryMs <= Date.now()) {
        continue;
      }
    }

    return true;
  }

  return false;
}

export default function RoleSidebar({
  role,
  userName,
  userImage,
  onSignOut,
  plan = "free",
}: RoleSidebarProps) {
  const pathname = usePathname();
  const navItems = ROLE_NAV_ITEMS[role];
  const { data: session, isPending } = authClient.useSession();

  const [isProMember, setIsProMember] = useState(false);

  useEffect(() => {
    if (role !== "technician") {
      setIsProMember(false);
      return;
    }

    if (isPending) return;

    const email = session?.user?.email;
    if (!email) {
      setIsProMember(false);
      return;
    }

    if (String(plan).toLowerCase() === "pro" || hasActiveStoredPro(email)) {
      setIsProMember(true);
      return;
    }

    let active = true;
    setIsProMember(checkProStatus(session));

    Promise.all([
      fetchApi("/api/auth/me").catch(() => null),
      fetchApi("/api/user/profile").catch(() => null),
      fetchApi("/api/me").catch(() => null),
    ]).then(([authMeData, profileData, meData]) => {
      if (!active) return;
      const resolvedEmail =
        authMeData?.user?.email ||
        authMeData?.email ||
        session?.user?.email ||
        null;

      const proActive =
        hasActiveStoredPro(resolvedEmail) ||
        checkProStatus(session) ||
        checkProStatus(authMeData) ||
        checkProStatus(profileData) ||
        checkProStatus(meData);

      setIsProMember(proActive);
    });

    return () => {
      active = false;
    };
  }, [role, isPending, session, plan, pathname]);

  const showTechnicianPro = role === "technician" && isProMember;

  const fallbackAvatar = `https://ui-avatars.com/api/?name=${encodeURIComponent(
    userName || "User"
  )}&background=ff5722&color=fff&bold=true`;

  const isProRouteActive = pathname === "/dashboard/technician/pro";

  return (
    <aside className="w-full lg:w-64 h-full flex-1 shrink-0 rounded-none bg-transparent backdrop-blur-[1px] border-0 ring-0 p-5 shadow-[6px_0_18px_rgba(15,23,42,0.05)] flex flex-col justify-between gap-6">
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
                className={`flex items-center gap-3 px-4 py-3 rounded-2xl text-sm font-bold transition-colors ${
                  isActive
                    ? "bg-gradient-to-r from-[#ff5722] to-[#ff6d3f] text-white shadow-[0_4px_12px_rgba(255,87,34,0.22)]"
                    : "text-gray-700 hover:bg-white/25 hover:text-gray-900"
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

      <div className="pt-4 border-t border-slate-200/70 space-y-3">
        <div className="flex items-center gap-3 px-2">
          <img
            src={userImage || fallbackAvatar}
            alt={userName || "User"}
            className="w-9 h-9 rounded-full object-cover border border-slate-200 shrink-0"
          />
          <div className="min-w-0 flex-1">
            <div className="flex items-center gap-1.5 min-w-0">
              <p className="text-xs font-extrabold text-gray-900 truncate">
                {userName || "FixLab User"}
              </p>
              {showTechnicianPro && (
                <span className="inline-flex items-center gap-0.5 px-1.5 py-0.5 rounded-full bg-gradient-to-r from-[#ff5722] to-[#ff6d3f] text-white text-[9px] font-extrabold tracking-wider uppercase shrink-0 shadow-2xs">
                  <Crown size={9} />
                  <span>PRO</span>
                </span>
              )}
            </div>
            <p className="text-[10px] font-bold uppercase text-[#ff5722]">
              {role}
            </p>
          </div>
        </div>

        <div className="space-y-2">
          {onSignOut && (
            <button
              type="button"
              onClick={onSignOut}
              className="w-full flex items-center justify-center gap-2 px-4 py-2.5 rounded-2xl bg-white/30 hover:bg-red-50/70 text-gray-700 hover:text-red-600 border border-white/80 text-xs font-extrabold cursor-pointer transition-colors"
            >
              <LogOut size={15} />
              <span>Sign Out</span>
            </button>
          )}

          {role === "technician" && (
            <Link
              href="/dashboard/technician/pro"
              className={`w-full flex items-center justify-center gap-2 px-4 py-2.5 rounded-2xl text-xs font-extrabold transition-all ${
                isProRouteActive
                  ? "bg-gradient-to-r from-[#ff5722] to-[#ff6d3f] text-white shadow-[0_4px_12px_rgba(255,87,34,0.22)]"
                  : "bg-gradient-to-r from-[#ff5722] to-[#ff6d3f] text-white hover:opacity-95 shadow-[0_4px_12px_rgba(255,87,34,0.18)]"
              }`}
            >
              <Sparkles size={15} />
              <span>{showTechnicianPro ? "Pro Active" : "Get Pro"}</span>
            </Link>
          )}
        </div>
      </div>
    </aside>
  );
}