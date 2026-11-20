"use client";

import Image from "next/image";
import { useState, useEffect, useCallback } from "react";
import { toast } from "@/components/ui/CustomToast";
import {
  Check,
  X,
  Loader2,
  Sparkles,
  Wrench,
  UserCheck,
  ShieldCheck,
} from "lucide-react";
import { fetchApi } from "@/lib/api";

const filterTabs = ["all", "pending", "approved", "rejected"];

interface AdminServiceItem {
  _id: string;
  title?: string;
  image?: string;
  technicianName?: string;
  approvalStatus?: string;
}

export default function AdminServicesPage() {
  const [services, setServices] = useState<AdminServiceItem[]>([]);
  const [filter, setFilter] = useState("all");
  const [loading, setLoading] = useState(true);
  const [updatingId, setUpdatingId] = useState<string | null>(null);

  const fetchServices = useCallback(() => {
    setLoading(true);
    fetchApi("/api/admin/services")
      .then((data) => {
        const list = Array.isArray(data)
          ? data
          : Array.isArray(data?.services)
          ? data.services
          : Array.isArray(data?.data)
          ? data.data
          : [];
        setServices(list);
      })
      .catch((err: any) => {
        toast.error(err?.message || "Failed to load services");
        setServices([]);
      })
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    fetchServices();
  }, [fetchServices]);

  const updateStatus = async (id: string, newStatus: string) => {
    setUpdatingId(id);
    try {
      await fetchApi(`/api/admin/services/${id}/approval`, {
        method: "PATCH",
        body: JSON.stringify({ approvalStatus: newStatus }),
      });
      setServices((prev) =>
        prev.map((s) => (s._id === id ? { ...s, approvalStatus: newStatus } : s))
      );
      toast.success(`Service ${newStatus}`);
    } catch (err: any) {
      toast.error(err?.message || "Failed to update service status");
    } finally {
      setUpdatingId(null);
    }
  };

  const filteredServices =
    filter === "all"
      ? services
      : services.filter((s) => s.approvalStatus === filter);

  if (loading) {
    return (
      <div className="flex justify-center py-24">
        <Loader2 className="animate-spin text-[#ff5722]" size={42} />
      </div>
    );
  }

  return (
    <div className="space-y-8 relative z-10">
      {/* Transparent Soft UI Header & Filter Banner */}
      <div className="relative overflow-hidden rounded-[2rem] bg-transparent hover:bg-white/5 backdrop-blur-[1px] border border-white/85 ring-1 ring-slate-900/12 p-6 sm:p-8 shadow-[14px_14px_28px_rgba(15,23,42,0.13),-10px_-10px_24px_rgba(255,255,255,0.92),inset_0_1px_0_rgba(255,255,255,0.85)] transition-all duration-300">
        <div className="relative z-10 flex flex-col lg:flex-row lg:justify-between lg:items-center gap-5">
          <div>
            <span className="inline-flex items-center gap-1.5 py-1 px-3.5 rounded-full bg-white/15 backdrop-blur-[1px] border border-white/90 ring-1 ring-[#ff5722]/25 text-[#ff5722] font-extrabold tracking-wider uppercase text-[11px] mb-3 shadow-[5px_5px_12px_rgba(15,23,42,0.09),-4px_-4px_10px_rgba(255,255,255,0.92)]">
              <Sparkles size={12} /> Moderation Queue
            </span>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-gray-900 tracking-tight">
              Service <span className="text-[#ff5722]">Approval</span>
            </h1>
            <p className="text-gray-700 text-sm font-medium mt-1">
              Review and moderate services listed by technicians.
            </p>
          </div>

          {/* Transparent Soft UI Filter Tabs */}
          <div className="flex gap-1.5 bg-white/10 backdrop-blur-[1px] p-1.5 rounded-2xl border border-white/90 ring-1 ring-slate-900/10 shadow-[6px_6px_14px_rgba(15,23,42,0.09),-4px_-4px_10px_rgba(255,255,255,0.92)] overflow-x-auto self-start lg:self-center">
            {filterTabs.map((s) => {
              const isActive = filter === s;
              return (
                <button
                  key={s}
                  type="button"
                  onClick={() => setFilter(s)}
                  className={`px-4 py-2 rounded-xl text-xs font-extrabold capitalize whitespace-nowrap transition-all cursor-pointer ${
                    isActive
                      ? "bg-gradient-to-r from-[#ff5722] to-[#ff6d3f] text-white shadow-[4px_4px_10px_rgba(255,87,34,0.3)]"
                      : "text-gray-800 hover:bg-white/20"
                  }`}
                >
                  {s}
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Transparent Soft UI Table Card */}
      <div className="relative overflow-hidden bg-transparent backdrop-blur-[1px] rounded-[2rem] border border-white/85 ring-1 ring-slate-900/12 shadow-[14px_14px_30px_rgba(15,23,42,0.14),-10px_-10px_24px_rgba(255,255,255,0.92),inset_0_1px_0_rgba(255,255,255,0.85)]">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-white/10 border-b border-white/80">
                <th className="px-6 py-4 text-[11px] font-extrabold text-gray-800 uppercase tracking-wider">
                  <span className="inline-flex items-center gap-1.5">
                    <Wrench size={13} className="text-[#ff5722]" />
                    Service
                  </span>
                </th>
                <th className="px-6 py-4 text-[11px] font-extrabold text-gray-800 uppercase tracking-wider">
                  <span className="inline-flex items-center gap-1.5">
                    <UserCheck size={13} className="text-[#ff5722]" />
                    Technician
                  </span>
                </th>
                <th className="px-6 py-4 text-[11px] font-extrabold text-gray-800 uppercase tracking-wider">
                  <span className="inline-flex items-center gap-1.5">
                    <ShieldCheck size={13} className="text-[#ff5722]" />
                    Status
                  </span>
                </th>
                <th className="px-6 py-4 text-[11px] font-extrabold text-gray-800 uppercase tracking-wider text-right">
                  Actions
                </th>
              </tr>
            </thead>

            <tbody className="divide-y divide-white/65">
              {filteredServices.length === 0 ? (
                <tr>
                  <td colSpan={4} className="px-6 py-16 text-center">
                    <div className="inline-flex flex-col items-center justify-center p-6 rounded-[1.75rem] bg-white/10 backdrop-blur-[1px] border border-white/85 ring-1 ring-slate-900/12 shadow-[10px_10px_22px_rgba(15,23,42,0.1),-8px_-8px_18px_rgba(255,255,255,0.92)]">
                      <div className="w-14 h-14 rounded-2xl bg-white/15 border border-white/90 ring-1 ring-[#ff5722]/25 flex items-center justify-center text-[#ff5722] mb-3 shadow-[5px_5px_12px_rgba(15,23,42,0.09),-4px_-4px_10px_rgba(255,255,255,0.92)]">
                        <Wrench size={24} />
                      </div>
                      <p className="text-sm font-extrabold text-gray-900">
                        No services found.
                      </p>
                      <p className="text-xs font-medium text-gray-700 mt-1">
                        Services matching this filter will appear here.
                      </p>
                    </div>
                  </td>
                </tr>
              ) : (
                filteredServices.map((service) => {
                  const statusValue = service.approvalStatus || "pending";
                  const isBusy = updatingId === service._id;
                  const statusBadgeStyle =
                    statusValue === "approved"
                      ? "bg-emerald-500/12 text-emerald-700 ring-emerald-500/25"
                      : statusValue === "pending"
                      ? "bg-amber-500/15 text-amber-800 ring-amber-500/30"
                      : "bg-red-500/12 text-red-700 ring-red-500/25";

                  return (
                    <tr
                      key={service._id}
                      className="group hover:bg-white/10 transition-all duration-200"
                    >
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3.5">
                          <div className="relative w-12 h-12 rounded-2xl overflow-hidden shrink-0 border border-white/90 ring-1 ring-slate-900/12 bg-white/10 shadow-[5px_5px_12px_rgba(15,23,42,0.1),-4px_-4px_10px_rgba(255,255,255,0.92)]">
                            <Image
                              src={service.image || "/icon-whiteTheme.png"}
                              alt={service.title || "Service"}
                              fill
                              sizes="48px"
                              className="object-cover"
                            />
                          </div>
                          <p className="font-extrabold text-sm text-gray-900 group-hover:text-[#ff5722] transition-colors">
                            {service.title || "Repair Service"}
                          </p>
                        </div>
                      </td>

                      <td className="px-6 py-4 text-sm font-semibold text-gray-800 whitespace-nowrap">
                        {service.technicianName || "Technician"}
                      </td>

                      <td className="px-6 py-4 whitespace-nowrap">
                        <span
                          className={`inline-block px-3.5 py-1 text-xs font-extrabold rounded-full capitalize bg-white/15 backdrop-blur-[1px] border border-white/90 ring-1 shadow-[3px_3px_8px_rgba(15,23,42,0.08),-3px_-3px_8px_rgba(255,255,255,0.92)] ${statusBadgeStyle}`}
                        >
                          {statusValue}
                        </span>
                      </td>

                      <td className="px-6 py-4 text-right whitespace-nowrap">
                        {statusValue === "pending" && (
                          <div className="inline-flex items-center justify-end gap-2">
                            <button
                              type="button"
                              disabled={isBusy}
                              onClick={() =>
                                updateStatus(service._id, "approved")
                              }
                              className="p-2 text-emerald-700 bg-white/15 hover:bg-emerald-500/15 backdrop-blur-[1px] border border-white/90 ring-1 ring-emerald-500/30 rounded-xl shadow-[4px_4px_10px_rgba(15,23,42,0.08),-3px_-3px_8px_rgba(255,255,255,0.92)] transition-all disabled:opacity-60 cursor-pointer"
                              title="Approve"
                            >
                              <Check size={16} />
                            </button>
                            <button
                              type="button"
                              disabled={isBusy}
                              onClick={() =>
                                updateStatus(service._id, "rejected")
                              }
                              className="p-2 text-red-600 bg-white/15 hover:bg-red-500/15 backdrop-blur-[1px] border border-white/90 ring-1 ring-red-500/30 rounded-xl shadow-[4px_4px_10px_rgba(15,23,42,0.08),-3px_-3px_8px_rgba(255,255,255,0.92)] transition-all disabled:opacity-60 cursor-pointer"
                              title="Reject"
                            >
                              <X size={16} />
                            </button>
                          </div>
                        )}
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}