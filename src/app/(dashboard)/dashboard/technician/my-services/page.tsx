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
  X,
} from "lucide-react";
import { toast } from "@/components/ui/CustomToast";
import Pagination from "@/components/ui/Pagination";
import { useState, useEffect, useCallback } from "react";
import { fetchApi } from "@/lib/api";

const PAGE_SIZE = 6;

interface ServiceItem {
  _id: string;
  title?: string;
  category?: string;
  description?: string;
  estimatedDuration?: string;
  serviceMode?: string;
  serviceArea?: string;
  image?: string;
  basePrice?: number | string;
  approvalStatus?: string;
  isAvailable?: boolean;
}

export default function MyServicesPage() {
  const [services, setServices] = useState<ServiceItem[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [busyId, setBusyId] = useState<string | null>(null);

  // Delete Modal
  const [serviceToDelete, setServiceToDelete] = useState<ServiceItem | null>(
    null
  );

  // Edit Modal
  const [editingService, setEditingService] = useState<ServiceItem | null>(
    null
  );
  const [editForm, setEditForm] = useState({
    title: "",
    category: "Smartphone",
    description: "",
    basePrice: "",
    estimatedDuration: "",
    serviceMode: "Home Visit",
    serviceArea: "",
  });
  const [savingEdit, setSavingEdit] = useState(false);

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

  const confirmDeleteService = async () => {
    if (!serviceToDelete?._id) return;
    const id = serviceToDelete._id;
    setBusyId(id);
    try {
      await fetchApi(`/api/services/${id}`, { method: "DELETE" });
      setServices((prev) => prev.filter((s) => s._id !== id));
      toast.success("Service deleted");
      setServiceToDelete(null);
    } catch (err: any) {
      toast.error(err?.message || "Failed to delete service");
    } finally {
      setBusyId(null);
    }
  };

  const openEditModal = (service: ServiceItem) => {
    setEditingService(service);
    setEditForm({
      title: service.title || "",
      category: service.category || "Smartphone",
      description: service.description || "",
      basePrice: String(service.basePrice ?? ""),
      estimatedDuration: service.estimatedDuration || "",
      serviceMode: service.serviceMode || "Home Visit",
      serviceArea: service.serviceArea || "",
    });
  };

  const handleEditSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingService?._id) return;

    setSavingEdit(true);
    try {
      await fetchApi(`/api/services/${editingService._id}`, {
        method: "PATCH",
        body: JSON.stringify({
          ...editForm,
          basePrice: Number(editForm.basePrice),
          approvalStatus: "pending",
        }),
      });

      setServices((prev) =>
        prev.map((s) =>
          s._id === editingService._id
            ? {
                ...s,
                ...editForm,
                basePrice: Number(editForm.basePrice),
                approvalStatus: "pending",
              }
            : s
        )
      );

      toast.success("Service updated! Waiting for admin re-approval.");
      setEditingService(null);
    } catch (err: any) {
      toast.error(err?.message || "Failed to update service");
    } finally {
      setSavingEdit(false);
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
          s._id === id ? { ...s, isAvailable: !currentStatus } : s
        )
      );
      toast.success("Availability updated!");
    } catch (err: any) {
      toast.error(err?.message || "Failed to update availability");
    } finally {
      setBusyId(null);
    }
  };

  const totalPages = Math.max(1, Math.ceil(services.length / PAGE_SIZE));
  const safePage = Math.min(currentPage, totalPages);
  const paginatedServices = services.slice(
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
    <div className="space-y-8 relative z-10 min-w-0">
      <div className="relative overflow-hidden rounded-[2rem] bg-transparent hover:bg-white/5 backdrop-blur-[1px] border border-white/85 ring-1 ring-slate-900/12 p-5 sm:p-8 shadow-[14px_14px_28px_rgba(15,23,42,0.13),-10px_-10px_24px_rgba(255,255,255,0.92),inset_0_1px_0_rgba(255,255,255,0.85)] transition-all duration-300">
        <div className="relative z-10 flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4">
          <div className="min-w-0">
            <span className="inline-flex items-center gap-1.5 py-1 px-3.5 rounded-full bg-white/15 backdrop-blur-[1px] border border-white/90 ring-1 ring-[#ff5722]/25 text-[#ff5722] font-extrabold tracking-wider uppercase text-[11px] mb-3 shadow-[5px_5px_12px_rgba(15,23,42,0.09),-4px_-4px_10px_rgba(255,255,255,0.92)]">
              <Sparkles size={12} /> Service Catalog
            </span>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-gray-900 tracking-tight break-words">
              My <span className="text-[#ff5722]">Services</span>
            </h1>
            <p className="text-gray-700 text-sm font-medium mt-1">
              Manage all your listed services.
            </p>
          </div>

          <Link
            href="/dashboard/technician/add-service"
            className="inline-flex items-center justify-center gap-1.5 px-5 py-3 bg-gradient-to-r from-[#ff5722] to-[#ff6d3f] hover:from-[#e64a19] hover:to-[#ff5722] text-white text-xs sm:text-sm font-extrabold rounded-full border border-[#ff5722]/40 shadow-[6px_6px_16px_rgba(255,87,34,0.34),-4px_-4px_10px_rgba(255,255,255,0.85)] transition-all shrink-0 w-full sm:w-auto self-start sm:self-center"
          >
            <Plus size={16} />
            <span>Add New</span>
          </Link>
        </div>
      </div>

      <div className="relative overflow-hidden bg-transparent backdrop-blur-[1px] rounded-[2rem] border border-white/85 ring-1 ring-slate-900/12 p-3 sm:p-4 shadow-[14px_14px_30px_rgba(15,23,42,0.14),-10px_-10px_24px_rgba(255,255,255,0.92),inset_0_1px_0_rgba(255,255,255,0.85)]">
        {paginatedServices.length === 0 ? (
          <div className="px-4 py-14 text-center">
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
          </div>
        ) : (
          <>
            {/* Mobile Card View */}
            <div className="grid grid-cols-1 gap-3.5 md:hidden">
              {paginatedServices.map((service) => {
                const isAvailable = Boolean(service.isAvailable);
                const isBusy = busyId === service._id;
                const statusStyle =
                  service.approvalStatus === "approved"
                    ? "bg-emerald-500/12 text-emerald-700 ring-emerald-500/25"
                    : service.approvalStatus === "pending"
                    ? "bg-amber-500/15 text-amber-800 ring-amber-500/30"
                    : "bg-red-500/12 text-red-700 ring-red-500/25";

                return (
                  <div
                    key={service._id}
                    className="rounded-[1.5rem] bg-white/10 backdrop-blur-[1px] border border-white/85 ring-1 ring-slate-900/10 p-4 shadow-[6px_6px_16px_rgba(15,23,42,0.08),-4px_-4px_10px_rgba(255,255,255,0.88)] space-y-3.5"
                  >
                    <div className="flex items-start gap-3 min-w-0">
                      <div className="relative w-12 h-12 rounded-2xl overflow-hidden shrink-0 border border-white/90 ring-1 ring-slate-900/12 bg-white/10 shadow-[4px_4px_10px_rgba(15,23,42,0.1),-3px_-3px_8px_rgba(255,255,255,0.92)]">
                        <Image
                          src={service.image || "/icon-whiteTheme.png"}
                          alt={service.title || "Service"}
                          fill
                          sizes="48px"
                          className="object-cover"
                        />
                      </div>

                      <div className="min-w-0 flex-1">
                        <p className="font-extrabold text-sm text-gray-900 break-words">
                          {service.title || "Repair Service"}
                        </p>
                        <div className="flex items-center flex-wrap gap-2 mt-1">
                          <span className="text-xs font-semibold text-gray-700">
                            {service.category || "General"}
                          </span>
                          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full bg-white/20 border border-white/90 ring-1 ring-[#ff5722]/25 text-xs font-extrabold text-[#ff5722]">
                            ${service.basePrice ?? 0}
                          </span>
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center justify-between gap-2 pt-2.5 border-t border-white/75">
                      <span
                        className={`inline-block px-3 py-1 text-xs font-extrabold rounded-full capitalize bg-white/15 backdrop-blur-[1px] border border-white/90 ring-1 ${statusStyle}`}
                      >
                        {service.approvalStatus || "pending"}
                      </span>

                      <div className="flex items-center gap-2">
                        <span className="text-[11px] font-bold text-gray-700">
                          Available
                        </span>
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
                      </div>
                    </div>

                    <div className="flex items-center justify-end gap-2 pt-2.5 border-t border-white/75">
                      <button
                        type="button"
                        onClick={() => openEditModal(service)}
                        title="Edit service"
                        className="px-3.5 py-2 text-xs font-extrabold text-blue-700 bg-white/15 hover:bg-blue-500/15 backdrop-blur-[1px] border border-white/90 ring-1 ring-blue-500/25 rounded-xl inline-flex items-center gap-1.5 transition-all cursor-pointer"
                      >
                        <Edit size={14} />
                        <span>Edit</span>
                      </button>
                      <button
                        type="button"
                        disabled={isBusy}
                        onClick={() => setServiceToDelete(service)}
                        title="Delete service"
                        className="px-3.5 py-2 text-xs font-extrabold text-red-600 bg-white/15 hover:bg-red-500/15 backdrop-blur-[1px] border border-white/90 ring-1 ring-red-500/25 rounded-xl inline-flex items-center gap-1.5 transition-all disabled:opacity-60 cursor-pointer"
                      >
                        <Trash2 size={14} />
                        <span>Delete</span>
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Desktop Table View */}
            <div className="hidden md:block overflow-x-auto">
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
                  {paginatedServices.map((service) => {
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

                        <td className="px-6 py-3.5 text-sm font-extrabold whitespace-nowrap">
                          <span className="inline-flex items-center px-3 py-1 rounded-full bg-white/15 backdrop-blur-[1px] border border-white/90 ring-1 ring-[#ff5722]/25 text-[#ff5722] shadow-[3px_3px_8px_rgba(15,23,42,0.08),-3px_-3px_8px_rgba(255,255,255,0.92)]">
                            ${service.basePrice ?? 0}
                          </span>
                        </td>

                        <td className="px-6 py-3.5 whitespace-nowrap">
                          <span
                            className={`inline-block px-3.5 py-1 text-xs font-extrabold rounded-full capitalize bg-white/15 backdrop-blur-[1px] border border-white/90 ring-1 shadow-[3px_3px_8px_rgba(15,23,42,0.08),-3px_-3px_8px_rgba(255,255,255,0.92)] ${statusStyle}`}
                          >
                            {service.approvalStatus || "pending"}
                          </span>
                        </td>

                        <td className="px-6 py-3.5 whitespace-nowrap">
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

                        <td className="px-6 py-3.5 text-right whitespace-nowrap">
                          <div className="inline-flex items-center justify-end gap-2">
                            <button
                              type="button"
                              onClick={() => openEditModal(service)}
                              title="Edit service"
                              className="p-2 text-blue-700 bg-white/15 hover:bg-blue-500/15 backdrop-blur-[1px] border border-white/90 ring-1 ring-blue-500/25 rounded-xl shadow-[4px_4px_10px_rgba(15,23,42,0.08),-3px_-3px_8px_rgba(255,255,255,0.92)] transition-all cursor-pointer"
                            >
                              <Edit size={16} />
                            </button>
                            <button
                              type="button"
                              disabled={isBusy}
                              onClick={() => setServiceToDelete(service)}
                              title="Delete service"
                              className="p-2 text-red-600 bg-white/15 hover:bg-red-500/15 backdrop-blur-[1px] border border-white/90 ring-1 ring-red-500/25 rounded-xl shadow-[4px_4px_10px_rgba(15,23,42,0.08),-3px_-3px_8px_rgba(255,255,255,0.92)] transition-all disabled:opacity-60 cursor-pointer"
                            >
                              <Trash2 size={16} />
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </>
        )}

        <div className="px-4 pb-2">
          <Pagination
            currentPage={safePage}
            totalItems={services.length}
            pageSize={PAGE_SIZE}
            onPageChange={setCurrentPage}
            itemLabel="services"
          />
        </div>
      </div>

      {/* Edit Modal */}
      {editingService && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 backdrop-blur-[2px] p-4">
          <div className="relative w-full max-w-lg max-h-[90vh] overflow-y-auto rounded-[2rem] bg-white/90 backdrop-blur-xl border border-white ring-1 ring-slate-900/15 p-5 sm:p-6 shadow-[16px_16px_34px_rgba(15,23,42,0.22)]">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-extrabold text-gray-900">
                Edit <span className="text-[#ff5722]">Service</span>
              </h3>
              <button
                type="button"
                onClick={() => setEditingService(null)}
                className="p-2 rounded-full bg-slate-100 text-gray-700 hover:text-[#ff5722] cursor-pointer"
              >
                <X size={16} />
              </button>
            </div>

            <form onSubmit={handleEditSubmit} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1">
                    Title
                  </label>
                  <input
                    type="text"
                    required
                    value={editForm.title}
                    onChange={(e) =>
                      setEditForm({ ...editForm, title: e.target.value })
                    }
                    className="w-full px-3.5 py-2.5 rounded-xl bg-white border border-slate-200 text-sm font-semibold text-gray-900 outline-none focus:border-[#ff5722]"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1">
                    Category
                  </label>
                  <select
                    value={editForm.category}
                    onChange={(e) =>
                      setEditForm({ ...editForm, category: e.target.value })
                    }
                    className="w-full px-3.5 py-2.5 rounded-xl bg-white border border-slate-200 text-sm font-semibold text-gray-900 outline-none focus:border-[#ff5722]"
                  >
                    <option>Smartphone</option>
                    <option>Laptop & PC</option>
                    <option>AC</option>
                    <option>Refrigerator</option>
                    <option>TV</option>
                    <option>Washing Machine</option>
                    <option>Electrical</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1">
                    Base Price ($)
                  </label>
                  <input
                    type="number"
                    min="1"
                    required
                    value={editForm.basePrice}
                    onChange={(e) =>
                      setEditForm({ ...editForm, basePrice: e.target.value })
                    }
                    className="w-full px-3.5 py-2.5 rounded-xl bg-white border border-slate-200 text-sm font-semibold text-gray-900 outline-none focus:border-[#ff5722]"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1">
                    Duration
                  </label>
                  <input
                    type="text"
                    required
                    value={editForm.estimatedDuration}
                    onChange={(e) =>
                      setEditForm({
                        ...editForm,
                        estimatedDuration: e.target.value,
                      })
                    }
                    className="w-full px-3.5 py-2.5 rounded-xl bg-white border border-slate-200 text-sm font-semibold text-gray-900 outline-none focus:border-[#ff5722]"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1">
                    Service Mode
                  </label>
                  <select
                    value={editForm.serviceMode}
                    onChange={(e) =>
                      setEditForm({ ...editForm, serviceMode: e.target.value })
                    }
                    className="w-full px-3.5 py-2.5 rounded-xl bg-white border border-slate-200 text-sm font-semibold text-gray-900 outline-none focus:border-[#ff5722]"
                  >
                    <option>Home Visit</option>
                    <option>Shop Drop-off</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1">
                    Service Area
                  </label>
                  <input
                    type="text"
                    required
                    value={editForm.serviceArea}
                    onChange={(e) =>
                      setEditForm({ ...editForm, serviceArea: e.target.value })
                    }
                    className="w-full px-3.5 py-2.5 rounded-xl bg-white border border-slate-200 text-sm font-semibold text-gray-900 outline-none focus:border-[#ff5722]"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1">
                  Description
                </label>
                <textarea
                  rows={3}
                  required
                  value={editForm.description}
                  onChange={(e) =>
                    setEditForm({ ...editForm, description: e.target.value })
                  }
                  className="w-full px-3.5 py-2.5 rounded-xl bg-white border border-slate-200 text-sm font-medium text-gray-900 outline-none focus:border-[#ff5722] resize-none"
                />
              </div>

              <div className="flex gap-2.5 pt-2">
                <button
                  type="button"
                  onClick={() => setEditingService(null)}
                  className="flex-1 py-2.5 rounded-full bg-slate-100 hover:bg-slate-200 text-gray-800 text-xs font-extrabold cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={savingEdit}
                  className="flex-1 py-2.5 rounded-full bg-gradient-to-r from-[#ff5722] to-[#ff6d3f] text-white text-xs font-extrabold shadow-xs disabled:opacity-60 cursor-pointer"
                >
                  {savingEdit ? "Saving..." : "Save & Re-submit"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {serviceToDelete && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 backdrop-blur-[2px] p-4">
          <div className="relative w-full max-w-sm rounded-[2rem] bg-white/90 backdrop-blur-xl border border-white ring-1 ring-slate-900/15 p-6 shadow-[16px_16px_34px_rgba(15,23,42,0.22)]">
            <h3 className="text-lg font-extrabold text-gray-900">
              Delete <span className="text-red-600">Service?</span>
            </h3>
            <p className="text-xs font-medium text-gray-600 mt-1.5">
              Are you sure you want to delete{" "}
              <span className="font-bold text-gray-900">
                {serviceToDelete.title || "this service"}
              </span>
              ?
            </p>

            <div className="flex gap-2.5 mt-6">
              <button
                type="button"
                disabled={Boolean(busyId)}
                onClick={() => setServiceToDelete(null)}
                className="flex-1 py-2.5 bg-slate-100 hover:bg-slate-200 text-gray-800 text-xs font-extrabold rounded-full cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="button"
                disabled={Boolean(busyId)}
                onClick={confirmDeleteService}
                className="flex-1 py-2.5 bg-red-600 hover:bg-red-700 text-white text-xs font-extrabold rounded-full disabled:opacity-60 cursor-pointer"
              >
                {busyId ? "Deleting..." : "Yes, Delete"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}