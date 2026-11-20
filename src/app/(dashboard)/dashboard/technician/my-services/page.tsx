"use client";

import Image from "next/image";
import Link from "next/link";
import {
  Edit,
  Trash2,
  Loader2,
  Sparkles,
  Plus,
  Wrench,
  DollarSign,
  ShieldCheck,
  ToggleRight,
} from "lucide-react";
import { toast } from "@/components/ui/CustomToast";
import { useState, useEffect, useCallback } from "react";
import { fetchApi } from "@/lib/api";

interface ServiceItem {
  _id: string;
  title?: string;
  category?: string;
  image?: string;
  basePrice?: number | string;
  approvalStatus?: string;
  isAvailable?: boolean;
}

export default function MyServicesPage() {
  const [services, setServices] = useState<ServiceItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [busyId, setBusyId] = useState<string | null>(null);

  const loadServices = useCallback(() => {
    setLoading(true);
    fetchApi("/api/services/technician/my-services")
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
    loadServices();
  }, [loadServices]);

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this service?")) return;
    setBusyId(id);
    try {
      await fetchApi(`/api/services/${id}`, { method: "DELETE" });
      setServices((prev) => prev.filter((s) => s._id !== id));
      toast.success("Service deleted");
    } catch (err: any) {
      toast.error(err?.message || "Failed to delete service");
    } finally {
      setBusyId(null);
    }
  };

  const toggleAvailability = async (id: string, currentStatus: boolean) => {
    setBusyId(id);
    try {
      await fetchApi(`/api/services/${id}`, {
        method: "PATCH",
        body: JSON.stringify({ isAvailable: !currentStatus }),
      });
      setServices((prev) =>
        prev.map((s) =>
          s._id === id
            ? { ...s, isAvailable: !currentStatus, approvalStatus: "pending" }
            : s
        )
      );
      toast.success("Availability updated (Needs re-approval)");
    } catch (err: any) {
      toast.error(err?.message || "Failed to update availability");
    } finally {
      setBusyId(null);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center py-24">
        <Loader2 className="animate-spin text-[#ff5722]" size={42} />
      </div>
    );
  }

  return (
    <div className="space-y-8 relative z-10">
      {/* Transparent Soft UI Header Banner */}
      <div className="relative overflow-hidden rounded-[2rem] bg-transparent hover:bg-white/5 backdrop-blur-[1px] border border-white/85 ring-1 ring-slate-900/12 p-6 sm:p-8 shadow-[14px_14px_28px_rgba(15,23,42,0.13),-10px_-10px_24px_rgba(255,255,255,0.92),inset_0_1px_0_rgba(255,255,255,0.85)] transition-all duration-300">
        <div className="relative z-10 flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4">
          <div>
            <span className="inline-flex items-center gap-1.5 py-1 px-3.5 rounded-full bg-white/15 backdrop-blur-[1px] border border-white/90 ring-1 ring-[#ff5722]/25 text-[#ff5722] font-extrabold tracking-wider uppercase text-[11px] mb-3 shadow-[5px_5px_12px_rgba(15,23,42,0.09),-4px_-4px_10px_rgba(255,255,255,0.92)]">
              <Sparkles size={12} /> Service Catalog
            </span>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-gray-900 tracking-tight">
              My <span className="text-[#ff5722]">Services</span>
            </h1>
            <p className="text-gray-700 text-sm font-medium mt-1">
              Manage all your listed services.
            </p>
          </div>

          <Link
            href="/dashboard/technician/add-service"
            className="inline-flex items-center justify-center gap-1.5 px-5 py-3 bg-gradient-to-r from-[#ff5722] to-[#ff6d3f] hover:from-[#e64a19] hover:to-[#ff5722] text-white text-xs sm:text-sm font-extrabold rounded-full border border-[#ff5722]/40 shadow-[6px_6px_16px_rgba(255,87,34,0.34),-4px_-4px_10px_rgba(255,255,255,0.85)] transition-all shrink-0 self-start sm:self-center"
          >
            <Plus size={16} />
            <span>Add New</span>
          </Link>
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
                    <DollarSign size={13} className="text-[#ff5722]" />
                    Price
                  </span>
                </th>
                <th className="px-6 py-4 text-[11px] font-extrabold text-gray-800 uppercase tracking-wider">
                  <span className="inline-flex items-center gap-1.5">
                    <ShieldCheck size={13} className="text-[#ff5722]" />
                    Status
                  </span>
                </th>
                <th className="px-6 py-4 text-[11px] font-extrabold text-gray-800 uppercase tracking-wider">
                  <span className="inline-flex items-center gap-1.5">
                    <ToggleRight size={13} className="text-[#ff5722]" />
                    Available
                  </span>
                </th>
                <th className="px-6 py-4 text-[11px] font-extrabold text-gray-800 uppercase tracking-wider text-right">
                  Actions
                </th>
              </tr>
            </thead>

            <tbody className="divide-y divide-white/65">
              {services.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-6 py-16 text-center">
                    <div className="inline-flex flex-col items-center justify-center p-6 rounded-[1.75rem] bg-white/10 backdrop-blur-[1px] border border-white/85 ring-1 ring-slate-900/12 shadow-[10px_10px_22px_rgba(15,23,42,0.1),-8px_-8px_18px_rgba(255,255,255,0.92)]">
                      <div className="w-14 h-14 rounded-2xl bg-white/15 border border-white/90 ring-1 ring-[#ff5722]/25 flex items-center justify-center text-[#ff5722] mb-3 shadow-[5px_5px_12px_rgba(15,23,42,0.09),-4px_-4px_10px_rgba(255,255,255,0.92)]">
                        <Wrench size={24} />
                      </div>
                      <p className="text-sm font-extrabold text-gray-900">
                        No services found. Add one!
                      </p>
                      <p className="text-xs font-medium text-gray-700 mt-1">
                        Create a repair service to start receiving bookings.
                      </p>
                    </div>
                  </td>
                </tr>
              ) : (
                services.map((service) => {
                  const isAvailable = Boolean(service.isAvailable);
                  const isBusy = busyId === service._id;
                  const statusStyle =
                    service.approvalStatus === "approved"
                      ? "bg-emerald-500/12 text-emerald-700 ring-emerald-500/25"
                      : service.approvalStatus === "pending"
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
                          <div className="min-w-0">
                            <p className="font-extrabold text-sm text-gray-900 group-hover:text-[#ff5722] transition-colors line-clamp-1">
                              {service.title || "Repair Service"}
                            </p>
                            <p className="text-xs font-semibold text-gray-700 mt-0.5">
                              {service.category || "General"}
                            </p>
                          </div>
                        </div>
                      </td>

                      <td className="px-6 py-4 text-sm font-extrabold whitespace-nowrap">
                        <span className="inline-flex items-center px-3 py-1 rounded-full bg-white/15 backdrop-blur-[1px] border border-white/90 ring-1 ring-[#ff5722]/25 text-[#ff5722] shadow-[3px_3px_8px_rgba(15,23,42,0.08),-3px_-3px_8px_rgba(255,255,255,0.92)]">
                          ${service.basePrice ?? 0}
                        </span>
                      </td>

                      <td className="px-6 py-4 whitespace-nowrap">
                        <span
                          className={`inline-block px-3.5 py-1 text-xs font-extrabold rounded-full capitalize bg-white/15 backdrop-blur-[1px] border border-white/90 ring-1 shadow-[3px_3px_8px_rgba(15,23,42,0.08),-3px_-3px_8px_rgba(255,255,255,0.92)] ${statusStyle}`}
                        >
                          {service.approvalStatus || "pending"}
                        </span>
                      </td>

                      <td className="px-6 py-4 whitespace-nowrap">
                        <button
                          type="button"
                          disabled={isBusy}
                          onClick={() =>
                            toggleAvailability(service._id, isAvailable)
                          }
                          aria-label="Toggle availability"
                          className={`w-11 h-6 rounded-full relative transition-all border border-white/80 cursor-pointer disabled:opacity-60 ${
                            isAvailable
                              ? "bg-gradient-to-r from-[#ff5722] to-[#ff6d3f] shadow-[0_3px_10px_rgba(255,87,34,0.35)]"
                              : "bg-slate-300/80 shadow-[inset_1px_1px_3px_rgba(15,23,42,0.15)]"
                          }`}
                        >
                          <span
                            className={`absolute top-0.5 w-4.5 h-4.5 rounded-full bg-white shadow-sm transition-all ${
                              isAvailable ? "left-5.5" : "left-0.5"
                            }`}
                          />
                        </button>
                      </td>

                      <td className="px-6 py-4 text-right whitespace-nowrap">
                        <div className="inline-flex items-center justify-end gap-2">
                          <button
                            type="button"
                            onClick={() => toast.info("Edit modal coming soon")}
                            title="Edit service"
                            className="p-2 text-blue-700 bg-white/15 hover:bg-blue-500/15 backdrop-blur-[1px] border border-white/90 ring-1 ring-blue-500/25 rounded-xl shadow-[4px_4px_10px_rgba(15,23,42,0.08),-3px_-3px_8px_rgba(255,255,255,0.92)] transition-all cursor-pointer"
                          >
                            <Edit size={16} />
                          </button>
                          <button
                            type="button"
                            disabled={isBusy}
                            onClick={() => handleDelete(service._id)}
                            title="Delete service"
                            className="p-2 text-red-600 bg-white/15 hover:bg-red-500/15 backdrop-blur-[1px] border border-white/90 ring-1 ring-red-500/25 rounded-xl shadow-[4px_4px_10px_rgba(15,23,42,0.08),-3px_-3px_8px_rgba(255,255,255,0.92)] transition-all disabled:opacity-60 cursor-pointer"
                          >
                            <Trash2 size={16} />
                          </button>
                        </div>
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