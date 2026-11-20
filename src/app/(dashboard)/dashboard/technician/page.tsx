"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { fetchApi } from "@/lib/api";
import {
  Wrench,
  CheckCircle,
  Clock,
  Loader2,
  Sparkles,
  ArrowUpRight,
  PlusCircle,
} from "lucide-react";

interface TechnicianStats {
  totalServices: number;
  approvedServices: number;
  pendingRequests: number;
}

export default function TechnicianDashboard() {
  const [stats, setStats] = useState<TechnicianStats>({
    totalServices: 0,
    approvedServices: 0,
    pendingRequests: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let active = true;

    fetchApi("/api/bookings/technician/stats")
      .then((data) => {
        if (!active) return;
        const source = data?.stats ?? data?.data ?? data ?? {};
        setStats({
          totalServices: Number(source.totalServices ?? 0),
          approvedServices: Number(source.approvedServices ?? 0),
          pendingRequests: Number(source.pendingRequests ?? 0),
        });
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
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center py-24">
        <Loader2 className="animate-spin text-[#ff5722]" size={42} />
      </div>
    );
  }

  const statCards = [
    {
      label: "Total Services",
      sublabel: "All listed repair services",
      value: stats.totalServices,
      icon: Wrench,
      href: "/dashboard/technician/my-services",
      iconBox:
        "bg-white/15 text-[#ff5722] border-white/90 ring-1 ring-[#ff5722]/25 shadow-[6px_6px_14px_rgba(15,23,42,0.1),-5px_-5px_12px_rgba(255,255,255,0.92)] group-hover:bg-[#ff5722] group-hover:text-white group-hover:border-[#ff5722] group-hover:ring-[#ff5722]/35",
    },
    {
      label: "Approved Services",
      sublabel: "Live & active for booking",
      value: stats.approvedServices,
      icon: CheckCircle,
      href: "/dashboard/technician/my-services",
      iconBox:
        "bg-white/15 text-emerald-600 border-white/90 ring-1 ring-emerald-500/25 shadow-[6px_6px_14px_rgba(15,23,42,0.1),-5px_-5px_12px_rgba(255,255,255,0.92)] group-hover:bg-[#ff5722] group-hover:text-white group-hover:border-[#ff5722] group-hover:ring-[#ff5722]/35",
    },
    {
      label: "Pending Requests",
      sublabel: "Awaiting your response",
      value: stats.pendingRequests,
      icon: Clock,
      href: "/dashboard/technician/requests",
      iconBox:
        "bg-white/15 text-amber-600 border-white/90 ring-1 ring-amber-500/25 shadow-[6px_6px_14px_rgba(15,23,42,0.1),-5px_-5px_12px_rgba(255,255,255,0.92)] group-hover:bg-[#ff5722] group-hover:text-white group-hover:border-[#ff5722] group-hover:ring-[#ff5722]/35",
    },
  ];

  return (
    <div className="space-y-8 relative z-10">
      {/* Transparent Soft UI Header Banner */}
      <div className="relative overflow-hidden rounded-[2rem] bg-transparent hover:bg-white/5 backdrop-blur-[1px] border border-white/85 ring-1 ring-slate-900/12 p-6 sm:p-8 shadow-[14px_14px_28px_rgba(15,23,42,0.13),-10px_-10px_24px_rgba(255,255,255,0.92),inset_0_1px_0_rgba(255,255,255,0.85)] transition-all duration-300">
        <div className="relative z-10 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <span className="inline-flex items-center gap-1.5 py-1 px-3.5 rounded-full bg-white/15 backdrop-blur-[1px] border border-white/90 ring-1 ring-[#ff5722]/25 text-[#ff5722] font-extrabold tracking-wider uppercase text-[11px] mb-3 shadow-[5px_5px_12px_rgba(15,23,42,0.09),-4px_-4px_10px_rgba(255,255,255,0.92)]">
              <Sparkles size={12} /> Technician Workspace
            </span>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-gray-900 tracking-tight">
              Technician <span className="text-[#ff5722]">Overview</span>
            </h1>
            <p className="text-gray-700 text-sm font-medium mt-1">
              Manage your services and incoming repair requests.
            </p>
          </div>

          <Link
            href="/dashboard/technician/add-service"
            className="inline-flex items-center justify-center gap-1.5 px-5 py-3 rounded-full bg-gradient-to-r from-[#ff5722] to-[#ff6d3f] text-white text-xs sm:text-sm font-extrabold border border-[#ff5722]/40 shadow-[6px_6px_16px_rgba(255,87,34,0.34),-4px_-4px_10px_rgba(255,255,255,0.85)] hover:from-[#e64a19] hover:to-[#ff5722] transition-all shrink-0 self-start sm:self-center"
          >
            <PlusCircle size={16} />
            <span>Add Service</span>
          </Link>
        </div>
      </div>

      {/* Transparent Soft UI Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-5 sm:gap-6">
        {statCards.map((card) => {
          const IconComponent = card.icon;

          return (
            <Link
              key={card.label}
              href={card.href}
              className="group relative overflow-hidden bg-transparent hover:bg-white/8 backdrop-blur-[1px] p-6 rounded-[2rem] border border-white/85 ring-1 ring-slate-900/12 hover:ring-[#ff5722]/35 hover:border-[#ff5722]/50 shadow-[14px_14px_28px_rgba(15,23,42,0.13),-10px_-10px_24px_rgba(255,255,255,0.92),inset_0_1px_0_rgba(255,255,255,0.85)] hover:shadow-[16px_16px_32px_rgba(255,87,34,0.16),-10px_-10px_24px_rgba(255,255,255,0.96)] transition-all duration-300 hover:-translate-y-1 flex flex-col justify-between"
            >
              {/* Subdued Hover Shine */}
              <div className="absolute inset-0 z-10 bg-gradient-to-tr from-transparent via-white/15 to-transparent -translate-x-[150%] group-hover:translate-x-[150%] transition-transform duration-[1.1s] ease-in-out pointer-events-none" />

              <div className="relative z-20 flex items-center justify-between gap-4 mb-5">
                <div
                  className={`w-14 h-14 rounded-2xl border backdrop-blur-[1px] flex items-center justify-center transition-all duration-300 shrink-0 ${card.iconBox}`}
                >
                  <IconComponent size={26} />
                </div>

                <span className="inline-flex items-center gap-1 px-3 py-1.5 rounded-full bg-white/15 backdrop-blur-[1px] border border-white/90 ring-1 ring-slate-900/10 shadow-[4px_4px_10px_rgba(15,23,42,0.08),-4px_-4px_10px_rgba(255,255,255,0.92)] text-xs font-bold text-gray-800 group-hover:text-[#ff5722] group-hover:border-[#ff5722]/35 transition-colors">
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
                <p className="text-xs font-medium text-gray-700 mt-0.5">
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