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
        "bg-white/75 text-[#ff5722] border-white/85 shadow-[6px_6px_14px_rgba(15,23,42,0.07),-6px_-6px_14px_rgba(255,255,255,0.95)] group-hover:bg-[#ff5722] group-hover:text-white group-hover:border-[#ff5722]",
    },
    {
      label: "Active Jobs",
      sublabel: "In progress or scheduled",
      value: stats.active,
      icon: Clock,
      href: "/dashboard/customer/bookings",
      iconBox:
        "bg-white/75 text-amber-600 border-white/85 shadow-[6px_6px_14px_rgba(15,23,42,0.07),-6px_-6px_14px_rgba(255,255,255,0.95)] group-hover:bg-[#ff5722] group-hover:text-white group-hover:border-[#ff5722]",
    },
    {
      label: "Completed Jobs",
      sublabel: "Successfully fixed",
      value: stats.completed,
      icon: CheckCircle,
      href: "/dashboard/customer/payments",
      iconBox:
        "bg-white/75 text-emerald-600 border-white/85 shadow-[6px_6px_14px_rgba(15,23,42,0.07),-6px_-6px_14px_rgba(255,255,255,0.95)] group-hover:bg-[#ff5722] group-hover:text-white group-hover:border-[#ff5722]",
    },
  ];

  return (
    <div className="space-y-8 relative z-10">
      {/* Soft Glass Header Banner */}
      <div className="relative overflow-hidden rounded-[2rem] bg-white/45 hover:bg-white/55 backdrop-blur-xs border border-white/80 p-6 sm:p-8 shadow-[10px_10px_24px_rgba(15,23,42,0.08),-10px_-10px_24px_rgba(255,255,255,0.92),inset_0_1px_0_rgba(255,255,255,0.95)] transition-all duration-300">
        <div className="absolute -right-14 -top-14 w-52 h-52 rounded-full bg-[#ff5722]/12 blur-2xl pointer-events-none" />

        <div className="relative z-10 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 flex-wrap mb-3">
              <span className="inline-flex items-center gap-1.5 py-1 px-3.5 rounded-full bg-white/75 border border-white/85 text-[#ff5722] font-extrabold tracking-wider uppercase text-[11px] shadow-[4px_4px_10px_rgba(15,23,42,0.06),-4px_-4px_10px_rgba(255,255,255,0.95)]">
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
            className="inline-flex items-center justify-center gap-1.5 px-5 py-3 rounded-full bg-gradient-to-r from-[#ff5722] to-[#ff6d3f] text-white text-xs sm:text-sm font-extrabold border border-[#ff5722]/30 shadow-[6px_6px_16px_rgba(255,87,34,0.3),-4px_-4px_12px_rgba(255,255,255,0.85)] hover:from-[#e64a19] hover:to-[#ff5722] transition-all shrink-0 self-start sm:self-center"
          >
            <span>Book a Repair</span>
            <ArrowUpRight size={16} />
          </Link>
        </div>
      </div>

      {/* Soft Glass Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-5 sm:gap-6">
        {statCards.map((card) => {
          const IconComponent = card.icon;

          return (
            <Link
              key={card.label}
              href={card.href}
              className="group relative overflow-hidden bg-white/45 hover:bg-white/60 backdrop-blur-xs p-6 rounded-[2rem] border border-white/80 hover:border-[#ff5722]/50 shadow-[10px_10px_24px_rgba(15,23,42,0.08),-10px_-10px_24px_rgba(255,255,255,0.92),inset_0_1px_0_rgba(255,255,255,0.95)] hover:shadow-[12px_12px_28px_rgba(255,87,34,0.14),-10px_-10px_24px_rgba(255,255,255,0.96)] transition-all duration-300 hover:-translate-y-1 flex flex-col justify-between"
            >
              {/* Subdued Hover Shine */}
              <div className="absolute inset-0 z-10 bg-gradient-to-tr from-transparent via-white/25 to-transparent -translate-x-[150%] group-hover:translate-x-[150%] transition-transform duration-[1.1s] ease-in-out pointer-events-none" />

              <div className="relative z-20 flex items-center justify-between gap-4 mb-5">
                <div
                  className={`w-14 h-14 rounded-2xl border flex items-center justify-center transition-all duration-300 shrink-0 ${card.iconBox}`}
                >
                  <IconComponent size={26} />
                </div>

                <span className="inline-flex items-center gap-1 px-3 py-1.5 rounded-full bg-white/75 border border-white/85 shadow-[4px_4px_10px_rgba(15,23,42,0.05),-4px_-4px_10px_rgba(255,255,255,0.95)] text-xs font-bold text-gray-700 group-hover:text-[#ff5722] group-hover:border-[#ff5722]/35 transition-colors">
                  <span>View</span>
                  <ArrowUpRight
                    size={14}
                    className="transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
                  />
                </span>
              </div>

              <div className="relative z-20">
                <p className="text-3xl font-extrabold text-gray-900 tracking-tight">
                  {card.value}
                </p>
                <p className="text-sm font-bold text-gray-800 mt-1">
                  {card.label}
                </p>
                <p className="text-xs font-medium text-gray-600 mt-0.5">
                  {card.sublabel}
                </p>
              </div>

              {/* Sliding Orange Accent Line */}
              <div className="relative z-20 w-full h-[3px] bg-black/5 rounded-full overflow-hidden mt-5 shadow-[inset_2px_2px_4px_rgba(0,0,0,0.08),inset_-2px_-2px_4px_rgba(255,255,255,0.9)]">
                <div className="h-full w-0 bg-gradient-to-r from-[#ff5722] to-[#ff6d3f] transition-all duration-300 group-hover:w-full" />
              </div>
            </Link>
          );
        })}
      </div>
    </div>
  );
}