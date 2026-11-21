"use client";

import Image from "next/image";
import Link from "next/link";
import { useState, useEffect, useCallback } from "react";
import { createPortal } from "react-dom";
import { toast } from "@/components/ui/CustomToast";
import Pagination from "@/components/ui/Pagination";
import {
  Check,
  X,
  Loader2,
  Sparkles,
  Wrench,
  UserCheck,
  ShieldCheck,
  Crown,
  Eye,
  MapPin,
  Clock,
  DollarSign,
  Mail,
  ArrowUpRight,
} from "lucide-react";
import { fetchApi } from "@/lib/api";

const PAGE_SIZE = 6;
const filterTabs = ["all", "pending", "approved", "rejected"];

interface AdminServiceItem {
  _id: string;
  title?: string;
  category?: string;
  description?: string;
  image?: string;
  basePrice?: number | string;
  estimatedDuration?: string;
  serviceMode?: string;
  serviceArea?: string;
  technicianName?: string;
  technicianEmail?: string;
  email?: string;
  approvalStatus?: string;
  isVerifiedPro?: boolean;
  technicianIsVerifiedPro?: boolean;
  plan?: string;
  technicianPlan?: string;
  proExpiresAt?: string | null;
  technicianProExpiresAt?: string | null;
  technician?: {
    isVerifiedPro?: boolean;
    plan?: string;
    proExpiresAt?: string | null;
  };
}

function isProActiveFromFields(obj: any): boolean {
  if (!obj || typeof obj !== "object") return false;

  const rawPro = Boolean(
    obj?.isVerifiedPro ||
      obj?.technicianIsVerifiedPro ||
      obj?.plan === "pro" ||
      obj?.technicianPlan === "pro" ||
      obj?.user?.isVerifiedPro ||
      obj?.user?.plan === "pro" ||
      obj?.technician?.isVerifiedPro ||
      obj?.technician?.plan === "pro"
  );

  if (!rawPro) return false;

  const expiresAt =
    obj?.proExpiresAt ||
    obj?.technicianProExpiresAt ||
    obj?.user?.proExpiresAt ||
    obj?.technician?.proExpiresAt ||
    null;

  if (expiresAt) {
    const expiryMs = new Date(expiresAt).getTime();
    if (!Number.isNaN(expiryMs) && expiryMs <= Date.now()) {
      return false;
    }
  }

  return true;
}

function extractList(payload: any): any[] {
  if (Array.isArray(payload)) return payload;
  if (!payload || typeof payload !== "object") return [];
  for (const key of ["services", "users", "data", "records", "results"]) {
    if (Array.isArray(payload[key])) return payload[key];
  }
  return [];
}

export default function AdminServicesPage() {
  const [mounted, setMounted] = useState(false);
  const [services, setServices] = useState<AdminServiceItem[]>([]);
  const [proEmails, setProEmails] = useState<Set<string>>(new Set());
  const [proNames, setProNames] = useState<Set<string>>(new Set());
  const [filter, setFilter] = useState("all");
  const [currentPage, setCurrentPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [updatingId, setUpdatingId] = useState<string | null>(null);
  const [selectedService, setSelectedService] =
    useState<AdminServiceItem | null>(null);

  useEffect(() => {
    setMounted(true);
  }, []);

  const fetchServicesAndProUsers = useCallback(() => {
    setLoading(true);

    Promise.all([
      fetchApi("/api/admin/services"),
      fetchApi("/api/admin/users").catch(() => []),
    ])
      .then(([srvData, usersData]) => {
        const list = extractList(srvData);
        setServices(list);

        const usersList = extractList(usersData);
        const emailsSet = new Set<string>();
        const namesSet = new Set<string>();

        for (const u of usersList) {
          if (isProActiveFromFields(u)) {
            const emailKey = String(u?.email || "").trim().toLowerCase();
            const nameKey = String(u?.name || "").trim().toLowerCase();
            if (emailKey) emailsSet.add(emailKey);
            if (nameKey) namesSet.add(nameKey);
          }
        }

        setProEmails(emailsSet);
        setProNames(namesSet);
      })
      .catch((err: any) => {
        toast.error(err?.message || "Failed to load services");
        setServices([]);
      })
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    fetchServicesAndProUsers();
  }, [fetchServicesAndProUsers]);

  useEffect(() => {
    if (!selectedService) return;
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") setSelectedService(null);
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [selectedService]);

  const isServiceTechnicianPro = (service: AdminServiceItem): boolean => {
    if (isProActiveFromFields(service)) return true;

    const techEmail = String(service?.technicianEmail || service?.email || "")
      .trim()
      .toLowerCase();
    const techName = String(service?.technicianName || "")
      .trim()
      .toLowerCase();

    if (techEmail && proEmails.has(techEmail)) return true;
    if (techName && proNames.has(techName)) return true;
    return false;
  };

  const updateStatus = async (id: string, newStatus: string) => {
    setUpdatingId(id);
    try {
      await fetchApi(`/api/admin/services/${id}/approval`, {
        method: "PATCH",
        body: JSON.stringify({ approvalStatus: newStatus }),
      });
      setServices((prev) =>
        prev.map((s) =>
          s._id === id ? { ...s, approvalStatus: newStatus } : s
        )
      );
      setSelectedService((prev) =>
        prev && prev._id === id ? { ...prev, approvalStatus: newStatus } : prev
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

  const totalPages = Math.max(
    1,
    Math.ceil(filteredServices.length / PAGE_SIZE)
  );
  const safePage = Math.min(currentPage, totalPages);
  const paginatedServices = filteredServices.slice(
    (safePage - 1) * PAGE_SIZE,
    safePage * PAGE_SIZE
  );

  if (loading) {
    return (
      <div className="flex justify-center py-24">
        <Loader2 className="animate-spin text-[#ff5722]" size={42} />
      </div>
    );
  }

  return (
    <div className="space-y-8 relative z-10">
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

          <div className="flex gap-1.5 bg-white/10 backdrop-blur-[1px] p-1.5 rounded-2xl border border-white/90 ring-1 ring-slate-900/10 shadow-[6px_6px_14px_rgba(15,23,42,0.09),-4px_-4px_10px_rgba(255,255,255,0.92)] overflow-x-auto self-start lg:self-center">
            {filterTabs.map((s) => {
              const isActive = filter === s;
              return (
                <button
                  key={s}
                  type="button"
                  onClick={() => {
                    setFilter(s);
                    setCurrentPage(1);
                  }}
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

      <div className="relative overflow-hidden bg-transparent backdrop-blur-[1px] rounded-[2rem] border border-white/85 ring-1 ring-slate-900/12 p-2 sm:p-4 shadow-[14px_14px_30px_rgba(15,23,42,0.14),-10px_-10px_24px_rgba(255,255,255,0.92),inset_0_1px_0_rgba(255,255,255,0.85)]">
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
              {paginatedServices.length === 0 ? (
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
                paginatedServices.map((service) => {
                  const statusValue = service.approvalStatus || "pending";
                  const isBusy = updatingId === service._id;
                  const isTechPro = isServiceTechnicianPro(service);
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
                      <td className="px-6 py-3.5">
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

                      <td className="px-6 py-3.5 text-sm font-semibold text-gray-800 whitespace-nowrap">
                        <div className="inline-flex items-center gap-2">
                          <span>{service.technicianName || "Technician"}</span>
                          {isTechPro && (
                            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-gradient-to-r from-[#ff5722] to-[#ff6d3f] text-white text-[10px] font-extrabold tracking-wider uppercase shadow-2xs">
                              <Crown size={10} />
                              <span>PRO</span>
                            </span>
                          )}
                        </div>
                      </td>

                      <td className="px-6 py-3.5 whitespace-nowrap">
                        <span
                          className={`inline-block px-3.5 py-1 text-xs font-extrabold rounded-full capitalize bg-white/15 backdrop-blur-[1px] border border-white/90 ring-1 shadow-[3px_3px_8px_rgba(15,23,42,0.08),-3px_-3px_8px_rgba(255,255,255,0.92)] ${statusBadgeStyle}`}
                        >
                          {statusValue}
                        </span>
                      </td>

                      <td className="px-6 py-3.5 text-right whitespace-nowrap">
                        <div className="inline-flex items-center justify-end gap-2">
                          <button
                            type="button"
                            onClick={() => setSelectedService(service)}
                            className="px-3 py-1.5 text-xs font-extrabold text-gray-900 bg-white/25 hover:bg-white/45 backdrop-blur-[1px] border border-white/90 ring-1 ring-slate-900/15 rounded-xl shadow-[4px_4px_10px_rgba(15,23,42,0.08),-3px_-3px_8px_rgba(255,255,255,0.92)] inline-flex items-center gap-1.5 transition-all cursor-pointer"
                            title="View Details"
                          >
                            <Eye size={13} className="text-[#ff5722]" />
                            <span>Details</span>
                          </button>

                          {statusValue === "pending" && (
                            <>
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
                            </>
                          )}
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>

        <div className="px-4 pb-2">
          <Pagination
            currentPage={safePage}
            totalItems={filteredServices.length}
            pageSize={PAGE_SIZE}
            onPageChange={setCurrentPage}
            itemLabel="services"
          />
        </div>
      </div>

      {/* Service & Technician Details Modal */}
      {mounted &&
        typeof document !== "undefined" &&
        selectedService &&
        createPortal(
          <div
            onClick={() => setSelectedService(null)}
            className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/50 p-4"
          >
            <div
              onClick={(e) => e.stopPropagation()}
              className="w-full max-w-lg rounded-[2rem] bg-white border border-slate-200 ring-1 ring-slate-900/15 p-5 sm:p-6 shadow-[0_24px_60px_rgba(15,23,42,0.35)] space-y-4 max-h-[90vh] overflow-y-auto"
            >
              <div className="flex items-start justify-between gap-3">
                <div>
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="inline-flex items-center gap-1 rounded-full bg-[#ff5722]/10 text-[#ff5722] px-3 py-0.5 text-[11px] font-extrabold uppercase tracking-wider">
                      {selectedService.category || "Repair Service"}
                    </span>
                    <span className="inline-flex items-center rounded-full bg-slate-100 text-slate-700 px-2.5 py-0.5 text-[11px] font-extrabold capitalize">
                      {selectedService.approvalStatus || "pending"}
                    </span>
                  </div>
                  <h2 className="text-xl font-extrabold text-slate-900 mt-1.5">
                    {selectedService.title || "Repair Service"}
                  </h2>
                </div>

                <button
                  type="button"
                  onClick={() => setSelectedService(null)}
                  aria-label="Close details modal"
                  className="w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-700 flex items-center justify-center cursor-pointer shrink-0"
                >
                  <X size={15} />
                </button>
              </div>

              {selectedService.image && (
                <div className="relative w-full h-44 rounded-2xl overflow-hidden border border-slate-200 bg-slate-50">
                  <Image
                    src={selectedService.image}
                    alt={selectedService.title || "Service"}
                    fill
                    sizes="500px"
                    className="object-cover"
                  />
                </div>
              )}

              <div className="rounded-2xl bg-slate-50 border border-slate-200/80 p-3.5 space-y-2 text-xs">
                <div className="flex items-center justify-between gap-2">
                  <span className="font-semibold text-slate-500">
                    Technician
                  </span>
                  <div className="inline-flex items-center gap-1.5 font-extrabold text-slate-900">
                    <span>{selectedService.technicianName || "Technician"}</span>
                    {isServiceTechnicianPro(selectedService) && (
                      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-gradient-to-r from-[#ff5722] to-[#ff6d3f] text-white text-[10px] font-extrabold uppercase">
                        <Crown size={10} />
                        <span>PRO</span>
                      </span>
                    )}
                  </div>
                </div>

                {(selectedService.technicianEmail || selectedService.email) && (
                  <div className="flex items-center justify-between gap-2">
                    <span className="font-semibold text-slate-500 inline-flex items-center gap-1">
                      <Mail size={12} className="text-[#ff5722]" /> Email
                    </span>
                    <span className="font-bold text-slate-800 break-all text-right">
                      {selectedService.technicianEmail || selectedService.email}
                    </span>
                  </div>
                )}

                <div className="flex items-center justify-between gap-2">
                  <span className="font-semibold text-slate-500 inline-flex items-center gap-1">
                    <DollarSign size={12} className="text-[#ff5722]" /> Base Price
                  </span>
                  <span className="font-extrabold text-[#ff5722]">
                    ${selectedService.basePrice ?? 0}
                  </span>
                </div>

                {selectedService.serviceMode && (
                  <div className="flex items-center justify-between gap-2">
                    <span className="font-semibold text-slate-500 inline-flex items-center gap-1">
                      <Wrench size={12} className="text-[#ff5722]" /> Service Mode
                    </span>
                    <span className="font-bold text-slate-800">
                      {selectedService.serviceMode}
                    </span>
                  </div>
                )}

                {selectedService.estimatedDuration && (
                  <div className="flex items-center justify-between gap-2">
                    <span className="font-semibold text-slate-500 inline-flex items-center gap-1">
                      <Clock size={12} className="text-[#ff5722]" /> Duration
                    </span>
                    <span className="font-bold text-slate-800">
                      {selectedService.estimatedDuration}
                    </span>
                  </div>
                )}

                {selectedService.serviceArea && (
                  <div className="flex items-center justify-between gap-2">
                    <span className="font-semibold text-slate-500 inline-flex items-center gap-1">
                      <MapPin size={12} className="text-[#ff5722]" /> Area
                    </span>
                    <span className="font-bold text-slate-800">
                      {selectedService.serviceArea}
                    </span>
                  </div>
                )}
              </div>

              {selectedService.description && (
                <div className="space-y-1">
                  <p className="text-[11px] font-extrabold uppercase tracking-wider text-slate-500">
                    Description
                  </p>
                  <p className="text-xs text-slate-700 leading-relaxed bg-slate-50 rounded-xl p-3 border border-slate-200/70">
                    {selectedService.description}
                  </p>
                </div>
              )}

              <div className="flex flex-wrap items-center justify-between gap-2 pt-2">
                {(selectedService.technicianEmail || selectedService.email) && (
                  <Link
                    href={`/technicians/${encodeURIComponent(
                      String(
                        selectedService.technicianEmail || selectedService.email
                      )
                    )}`}
                    className="inline-flex items-center gap-1 text-xs font-extrabold text-[#ff5722] hover:underline"
                  >
                    <span>Open Technician Profile</span>
                    <ArrowUpRight size={14} />
                  </Link>
                )}

                <div className="flex items-center gap-2 ml-auto">
                  <button
                    type="button"
                    onClick={() => setSelectedService(null)}
                    className="px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-extrabold cursor-pointer"
                  >
                    Close
                  </button>
                </div>
              </div>
            </div>
          </div>,
          document.body
        )}
    </div>
  );
}