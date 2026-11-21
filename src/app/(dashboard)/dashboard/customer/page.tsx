"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { authClient } from "@/lib/auth-client";
import { fetchApi } from "@/lib/api";
import {
  FileText,
  Clock,
  CheckCircle,
  Loader2,
  Sparkles,
  ArrowUpRight,
  Crown,
} from "lucide-react";

interface CustomerStats {
  total: number;
  active: number;
  completed: number;
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

export default function CustomerDashboard() {
  const router = useRouter();
  const { data: session, isPending } = authClient.useSession();

  const [stats, setStats] = useState<CustomerStats>({
    total: 0,
    active: 0,
    completed: 0,
  });
  const [isProMember, setIsProMember] = useState(false);
  const [loading, setLoading] = useState(true);

  const userRole = ((session?.user as any)?.role || "customer") as string;

  useEffect(() => {
    if (isPending) return;

    if (!session?.user) {
      setIsProMember(false);
      setLoading(false);
      return;
    }

    if (userRole !== "customer") {
      router.replace(`/dashboard/${userRole}`);
      return;
    }

    let active = true;
    setLoading(true);
    setIsProMember(checkProStatus(session));

    Promise.all([
      fetchApi("/api/bookings/customer/stats"),
      fetchApi("/api/user/profile").catch(() => null),
      fetchApi("/api/me").catch(() => null),
    ])
      .then(([data, profileData, meData]) => {
        if (!active) return;
        const source = data?.stats ?? data?.data ?? data ?? {};
        setStats({
          total: Number(source.total ?? 0),
          active: Number(source.active ?? 0),
          completed: Number(source.completed ?? 0),
        });

        const proActive =
          checkProStatus(session) ||
          checkProStatus(profileData) ||
          checkProStatus(meData);
        setIsProMember(proActive);
      })
      .catch((err) => {
        console.error(err);
      })
      .finally(() => {
        if (active) setLoading(false);
      });

    return () => {
      active = false;
    };
  }, [isPending, session, userRole, router]);

  if (isPending || loading || (session?.user && userRole !== "customer")) {
    return (
      <div className="flex justify-center py-24">
        <Loader2 className="animate-spin text-[#ff5722]" size={42} />
      </div>
    );
  }

  const statCards = [
    {
      label: "Total Requests",
      sublabel: "All repair bookings",
      value: stats.total,
      icon: FileText,
      href: "/dashboard/customer/bookings",
      iconBox:
        "bg-white/15 text-[#ff5722] border-white/90 ring-1 ring-[#ff5722]/25 shadow-[6px_6px_14px_rgba(15,23,42,0.1),-5px_-5px_12px_rgba(255,255,255,0.92)] group-hover:bg-[#ff5722] group-hover:text-white group-hover:border-[#ff5722] group-hover:ring-[#ff5722]/35",
    },
    {
      label: "Active Jobs",
      sublabel: "In progress or scheduled",
      value: stats.active,
      icon: Clock,
      href: "/dashboard/customer/bookings",
      iconBox:
        "bg-white/15 text-amber-600 border-white/90 ring-1 ring-amber-500/25 shadow-[6px_6px_14px_rgba(15,23,42,0.1),-5px_-5px_12px_rgba(255,255,255,0.92)] group-hover:bg-[#ff5722] group-hover:text-white group-hover:border-[#ff5722] group-hover:ring-[#ff5722]/35",
    },
    {
      label: "Completed Jobs",
      sublabel: "Successfully fixed",
      value: stats.completed,
      icon: CheckCircle,
      href: "/dashboard/customer/payments",
      iconBox:
        "bg-white/15 text-emerald-600 border-white/90 ring-1 ring-emerald-500/25 shadow-[6px_6px_14px_rgba(15,23,42,0.1),-5px_-5px_12px_rgba(255,255,255,0.92)] group-hover:bg-[#ff5722] group-hover:text-white group-hover:border-[#ff5722] group-hover:ring-[#ff5722]/35",
    },
  ];

  return (
    <div className="space-y-8 relative z-10 min-w-0">
      {/* Transparent Soft UI Header Banner */}
      <div className="relative overflow-hidden rounded-[2rem] bg-transparent hover:bg-white/5 backdrop-blur-[1px] border border-white/85 ring-1 ring-slate-900/12 p-5 sm:p-8 shadow-[14px_14px_28px_rgba(15,23,42,0.13),-10px_-10px_24px_rgba(255,255,255,0.92),inset_0_1px_0_rgba(255,255,255,0.85)] transition-all duration-300">
        <div className="relative z-10 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div className="min-w-0">
            <div className="flex items-center gap-2 flex-wrap mb-3">
              <span className="inline-flex items-center gap-1.5 py-1 px-3.5 rounded-full bg-white/15 backdrop-blur-[1px] border border-white/90 ring-1 ring-[#ff5722]/25 text-[#ff5722] font-extrabold tracking-wider uppercase text-[11px] shadow-[5px_5px_12px_rgba(15,23,42,0.09),-4px_-4px_10px_rgba(255,255,255,0.92)]">
                <Sparkles size={12} /> Customer Portal
              </span>
              {isProMember && (
                <span className="inline-flex items-center gap-1 py-1 px-3 rounded-full bg-gradient-to-r from-[#ff5722] to-[#ff6d3f] text-white font-extrabold tracking-wider uppercase text-[10px] shadow-2xs">
                  <Crown size={11} />
                  <span>PRO</span>
                </span>
              )}
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-gray-900 tracking-tight">
              Dashboard <span className="text-[#ff5722]">Overview</span>
            </h1>
            <p className="text-gray-700 text-sm font-medium mt-1">
              Welcome back! Here is a summary of your repair jobs.
            </p>
          </div>

          <Link
            href="/services"
            className="inline-flex items-center justify-center gap-1.5 px-5 py-3 rounded-full bg-gradient-to-r from-[#ff5722] to-[#ff6d3f] text-white text-xs sm:text-sm font-extrabold border border-[#ff5722]/40 shadow-[6px_6px_16px_rgba(255,87,34,0.34),-4px_-4px_10px_rgba(255,255,255,0.85)] hover:from-[#e64a19] hover:to-[#ff5722] transition-all shrink-0 w-full sm:w-auto self-start sm:self-center"
          >
            <span>Book a Repair</span>
            <ArrowUpRight size={16} />
          </Link>
        </div>
      </div>

      {/* Transparent Soft UI Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-6">
        {statCards.map((card) => {
          const IconComponent = card.icon;

          return (
            <Link
              key={card.label}
              href={card.href}
              className="group relative overflow-hidden min-w-0 bg-transparent hover:bg-white/8 backdrop-blur-[1px] p-5 sm:p-6 rounded-[2rem] border border-white/85 ring-1 ring-slate-900/12 hover:ring-[#ff5722]/35 hover:border-[#ff5722]/50 shadow-[14px_14px_28px_rgba(15,23,42,0.13),-10px_-10px_24px_rgba(255,255,255,0.92),inset_0_1px_0_rgba(255,255,255,0.85)] hover:shadow-[16px_16px_32px_rgba(255,87,34,0.16),-10px_-10px_24px_rgba(255,255,255,0.96)] transition-all duration-300 hover:-translate-y-1 flex flex-col justify-between"
            >
              {/* Subdued Hover Shine */}
              <div className="absolute inset-0 z-10 bg-gradient-to-tr from-transparent via-white/15 to-transparent -translate-x-[150%] group-hover:translate-x-[150%] transition-transform duration-[1.1s] ease-in-out pointer-events-none" />

              <div className="relative z-20 flex items-center justify-between gap-3 mb-5">
                <div
                  className={`w-12 h-12 sm:w-14 sm:h-14 rounded-2xl border backdrop-blur-[1px] flex items-center justify-center transition-all duration-300 shrink-0 ${card.iconBox}`}
                >
                  <IconComponent size={24} />
                </div>

                <span className="inline-flex items-center gap-1 px-3 py-1.5 rounded-full bg-white/15 backdrop-blur-[1px] border border-white/90 ring-1 ring-slate-900/10 shadow-[4px_4px_10px_rgba(15,23,42,0.08),-4px_-4px_10px_rgba(255,255,255,0.92)] text-xs font-bold text-gray-800 group-hover:text-[#ff5722] group-hover:border-[#ff5722]/35 transition-colors shrink-0">
                  <span>View</span>
                  <ArrowUpRight
                    size={14}
                    className="transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
                  />
                </span>
              </div>

              <div className="relative z-20 min-w-0">
                <p className="text-2xl sm:text-3xl font-extrabold text-gray-900 tracking-tight break-words">
                  {card.value}
                </p>
                <p className="text-sm font-bold text-gray-800 mt-1 break-words">
                  {card.label}
                </p>
                <p className="text-xs font-medium text-gray-700 mt-0.5 break-words">
                  {card.sublabel}
                </p>
              </div>

              {/* Sliding Orange Accent Line */}
              <div className="relative z-20 w-full h-[3px] bg-slate-900/10 rounded-full overflow-hidden mt-5 shadow-[inset_1px_1px_3px_rgba(15,23,42,0.12)]">
                <div className="h-full w-0 bg-gradient-to-r from-[#ff5722] to-[#ff6d3f] transition-all duration-300 group-hover:w-full" />
              </div>
            </Link>
          );
        })}
      </div>
    </div>
  );
}