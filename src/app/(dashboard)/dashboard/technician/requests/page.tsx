"use client";

import { toast } from "@/components/ui/CustomToast";
import Pagination from "@/components/ui/Pagination";
import ThermalReceiptModal, {
  ReceiptPayload,
} from "@/components/receipt/ThermalReceiptModal";
import { bookingToReceipt } from "@/components/receipt/receiptMapper";
import {
  Check,
  X,
  Play,
  CheckCircle,
  Loader2,
  Sparkles,
  User,
  Wrench,
  Calendar,
  Activity,
  DollarSign,
  Printer,
} from "lucide-react";
import { useState, useEffect, useCallback } from "react";
import { fetchApi } from "@/lib/api";

const PAGE_SIZE = 6;
const filterTabs = ["all", "requested", "accepted", "in-progress", "completed"];

interface RequestItem {
  _id: string;
  customerName?: string;
  customerEmail?: string;
  customerPhone?: string;
  address?: string;
  technicianName?: string;
  technicianEmail?: string;
  serviceTitle?: string;
  problemDescription?: string;
  preferredDate?: string;
  status: string;
  paymentStatus?: string;
  basePrice?: number | string;
  finalAmount?: number | string;
}

export default function RequestsPage() {
  const [requests, setRequests] = useState<RequestItem[]>([]);
  const [filter, setFilter] = useState("all");
  const [currentPage, setCurrentPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [updatingId, setUpdatingId] = useState<string | null>(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedBooking, setSelectedBooking] = useState<RequestItem | null>(
    null
  );
  const [finalAmount, setFinalAmount] = useState("");
  const [activeReceipt, setActiveReceipt] = useState<ReceiptPayload | null>(
    null
  );

  const fetchRequests = useCallback((showSpinner = false) => {
    if (showSpinner) setLoading(true);
    fetchApi("/api/bookings/technician")
      .then((data) => {
        const list = Array.isArray(data)
          ? data
          : Array.isArray(data?.requests)
          ? data.requests
          : Array.isArray(data?.bookings)
          ? data.bookings
          : Array.isArray(data?.data)
          ? data.data
          : [];
        setRequests(list);
      })
      .catch((err: any) => {
        toast.error(err?.message || "Failed to load requests");
        setRequests([]);
      })
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    fetchRequests(true);
  }, [fetchRequests]);

  useEffect(() => {
    if (!modalOpen || updatingId) return;
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setModalOpen(false);
        setSelectedBooking(null);
      }
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [modalOpen, updatingId]);

  const updateStatus = async (
    id: string,
    newStatus: string,
    amount?: number
  ) => {
    if (newStatus === "completed") {
      const numericAmount = Number(amount);
      if (Number.isNaN(numericAmount) || numericAmount <= 0) {
        toast.error("Please enter a valid final amount greater than 0");
        return;
      }
      amount = numericAmount;
    }

    setUpdatingId(id);
    try {
      await fetchApi(`/api/bookings/${id}/status`, {
        method: "PATCH",
        body: JSON.stringify({ status: newStatus, finalAmount: amount }),
      });
      toast.success(`Request ${newStatus}`);
      setModalOpen(false);
      setSelectedBooking(null);
      fetchRequests(false);
    } catch (err: any) {
      toast.error(err?.message || "Could not update status");
    } finally {
      setUpdatingId(null);
    }
  };

  const openCompleteModal = (booking: RequestItem) => {
    setSelectedBooking(booking);
    setFinalAmount((booking.finalAmount ?? booking.basePrice ?? "").toString());
    setModalOpen(true);
  };

  const filteredRequests =
    filter === "all"
      ? requests
      : requests.filter((r) => r.status === filter);

  const totalPages = Math.max(1, Math.ceil(filteredRequests.length / PAGE_SIZE));
  const safePage = Math.min(currentPage, totalPages);
  const paginatedRequests = filteredRequests.slice(
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
              <Sparkles size={12} /> Job Queue
            </span>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-gray-900 tracking-tight">
              Manage <span className="text-[#ff5722]">Requests</span>
            </h1>
            <p className="text-gray-700 text-sm font-medium mt-1">
              Review incoming requests, inspect receipts, and update job statuses.
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
                  {s.replace("-", " ")}
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
                    <User size={13} className="text-[#ff5722]" />
                    Customer Info
                  </span>
                </th>
                <th className="px-6 py-4 text-[11px] font-extrabold text-gray-800 uppercase tracking-wider">
                  <span className="inline-flex items-center gap-1.5">
                    <Wrench size={13} className="text-[#ff5722]" />
                    Service & Problem
                  </span>
                </th>
                <th className="px-6 py-4 text-[11px] font-extrabold text-gray-800 uppercase tracking-wider">
                  <span className="inline-flex items-center gap-1.5">
                    <Calendar size={13} className="text-[#ff5722]" />
                    Date
                  </span>
                </th>
                <th className="px-6 py-4 text-[11px] font-extrabold text-gray-800 uppercase tracking-wider">
                  <span className="inline-flex items-center gap-1.5">
                    <Activity size={13} className="text-[#ff5722]" />
                    Status
                  </span>
                </th>
                <th className="px-6 py-4 text-[11px] font-extrabold text-gray-800 uppercase tracking-wider text-center">
                  <span className="inline-flex items-center gap-1.5">
                    <Printer size={13} className="text-[#ff5722]" />
                    Receipt
                  </span>
                </th>
                <th className="px-6 py-4 text-[11px] font-extrabold text-gray-800 uppercase tracking-wider text-right">
                  Actions
                </th>
              </tr>
            </thead>

            <tbody className="divide-y divide-white/65">
              {paginatedRequests.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-6 py-16 text-center">
                    <div className="inline-flex flex-col items-center justify-center p-6 rounded-[1.75rem] bg-white/10 backdrop-blur-[1px] border border-white/85 ring-1 ring-slate-900/12 shadow-[10px_10px_22px_rgba(15,23,42,0.1),-8px_-8px_18px_rgba(255,255,255,0.92)]">
                      <div className="w-14 h-14 rounded-2xl bg-white/15 border border-white/90 ring-1 ring-[#ff5722]/25 flex items-center justify-center text-[#ff5722] mb-3 shadow-[5px_5px_12px_rgba(15,23,42,0.09),-4px_-4px_10px_rgba(255,255,255,0.92)]">
                        <Wrench size={24} />
                      </div>
                      <p className="text-sm font-extrabold text-gray-900">
                        No requests found.
                      </p>
                      <p className="text-xs font-medium text-gray-700 mt-1">
                        Incoming customer repair requests will show up here.
                      </p>
                    </div>
                  </td>
                </tr>
              ) : (
                paginatedRequests.map((req) => {
                  const formattedDate = req.preferredDate
                    ? new Date(req.preferredDate).toLocaleDateString()
                    : "—";
                  const isBusy = updatingId === req._id;
                  const canPrintReceipt = [
                    "requested",
                    "accepted",
                    "in-progress",
                    "completed",
                  ].includes(req.status);

                  const badgeClass =
                    req.status === "requested"
                      ? "bg-blue-500/12 text-blue-700 ring-blue-500/25"
                      : req.status === "accepted"
                      ? "bg-indigo-500/12 text-indigo-700 ring-indigo-500/25"
                      : req.status === "in-progress"
                      ? "bg-amber-500/15 text-amber-800 ring-amber-500/30"
                      : req.status === "completed"
                      ? "bg-emerald-500/12 text-emerald-700 ring-emerald-500/25"
                      : "bg-[#ff5722]/12 text-[#ff5722] ring-[#ff5722]/25";

                  const isPaid = req.paymentStatus === "paid";

                  return (
                    <tr
                      key={req._id}
                      className="group hover:bg-white/10 transition-all duration-200"
                    >
                      <td className="px-6 py-3.5">
                        <p className="font-extrabold text-sm text-gray-900 group-hover:text-[#ff5722] transition-colors">
                          {req.customerName || "Customer"}
                        </p>
                        {req.customerPhone && (
                          <p className="text-xs font-semibold text-gray-700 mt-0.5">
                            {req.customerPhone}
                          </p>
                        )}
                        {req.address && (
                          <p
                            title={req.address}
                            className="text-xs font-medium text-gray-600 truncate max-w-[170px] mt-0.5"
                          >
                            {req.address}
                          </p>
                        )}
                      </td>

                      <td className="px-6 py-3.5">
                        <p className="font-extrabold text-sm text-gray-900">
                          {req.serviceTitle || "Repair Service"}
                        </p>
                        {req.problemDescription && (
                          <p
                            title={req.problemDescription}
                            className="text-xs font-medium text-gray-700 truncate max-w-[220px] mt-0.5"
                          >
                            {req.problemDescription}
                          </p>
                        )}
                      </td>

                      <td className="px-6 py-3.5 text-sm font-semibold text-gray-800 whitespace-nowrap">
                        {formattedDate}
                      </td>

                      <td className="px-6 py-3.5 whitespace-nowrap">
                        <span
                          className={`inline-block px-3.5 py-1 text-xs font-extrabold rounded-full capitalize bg-white/15 backdrop-blur-[1px] border border-white/90 ring-1 shadow-[3px_3px_8px_rgba(15,23,42,0.08),-3px_-3px_8px_rgba(255,255,255,0.92)] ${badgeClass}`}
                        >
                          {req.status.replace("-", " ")}
                        </span>
                      </td>

                      <td className="px-6 py-3.5 text-center whitespace-nowrap">
                        {canPrintReceipt ? (
                          <button
                            type="button"
                            onClick={() =>
                              setActiveReceipt(bookingToReceipt(req))
                            }
                            className="h-8 px-3.5 text-xs font-extrabold text-gray-900 bg-white/45 hover:bg-white/75 backdrop-blur-[1px] border border-white/90 ring-1 ring-slate-900/15 rounded-full shadow-[4px_4px_10px_rgba(15,23,42,0.08),-3px_-3px_8px_rgba(255,255,255,0.92)] inline-flex items-center justify-center gap-1.5 transition-all cursor-pointer"
                          >
                            <Printer
                              size={13}
                              className="text-[#ff5722] shrink-0"
                            />
                            <span>Receipt</span>
                          </button>
                        ) : (
                          <span className="text-xs font-semibold text-gray-400">
                            —
                          </span>
                        )}
                      </td>

                      <td className="px-6 py-3.5 text-right whitespace-nowrap">
                        <div className="inline-flex items-center justify-end gap-2">
                          {req.status === "requested" && (
                            <>
                              <button
                                type="button"
                                disabled={isBusy}
                                onClick={() =>
                                  updateStatus(req._id, "accepted")
                                }
                                title="Accept request"
                                className="h-8 w-8 text-emerald-700 bg-white/35 hover:bg-emerald-500/15 backdrop-blur-[1px] border border-white/90 ring-1 ring-emerald-500/30 rounded-full shadow-[4px_4px_10px_rgba(15,23,42,0.08),-3px_-3px_8px_rgba(255,255,255,0.92)] inline-flex items-center justify-center transition-all disabled:opacity-60 cursor-pointer"
                              >
                                <Check size={15} />
                              </button>
                              <button
                                type="button"
                                disabled={isBusy}
                                onClick={() =>
                                  updateStatus(req._id, "rejected")
                                }
                                title="Reject request"
                                className="h-8 w-8 text-red-600 bg-white/35 hover:bg-red-500/15 backdrop-blur-[1px] border border-white/90 ring-1 ring-red-500/30 rounded-full shadow-[4px_4px_10px_rgba(15,23,42,0.08),-3px_-3px_8px_rgba(255,255,255,0.92)] inline-flex items-center justify-center transition-all disabled:opacity-60 cursor-pointer"
                              >
                                <X size={15} />
                              </button>
                            </>
                          )}

                          {req.status === "accepted" && (
                            <button
                              type="button"
                              disabled={isBusy}
                              onClick={() =>
                                updateStatus(req._id, "in-progress")
                              }
                              className="h-8 px-3.5 text-xs font-extrabold text-amber-800 bg-white/35 hover:bg-amber-500/20 backdrop-blur-[1px] border border-white/90 ring-1 ring-amber-500/35 rounded-full shadow-[4px_4px_10px_rgba(15,23,42,0.08),-3px_-3px_8px_rgba(255,255,255,0.92)] inline-flex items-center justify-center gap-1.5 transition-all disabled:opacity-60 cursor-pointer"
                            >
                              <Play size={12} />
                              <span>Start Work</span>
                            </button>
                          )}

                          {req.status === "in-progress" && (
                            <button
                              type="button"
                              disabled={isBusy}
                              onClick={() => openCompleteModal(req)}
                              className="h-8 px-4 text-xs font-extrabold text-white bg-gradient-to-r from-[#ff5722] to-[#ff6d3f] hover:from-[#e64a19] hover:to-[#ff5722] rounded-full shadow-[5px_5px_14px_rgba(255,87,34,0.32),-3px_-3px_10px_rgba(255,255,255,0.85)] inline-flex items-center justify-center gap-1.5 transition-all disabled:opacity-60 cursor-pointer"
                            >
                              <CheckCircle size={13} />
                              <span>Complete</span>
                            </button>
                          )}

                          {req.status === "completed" && (
                            <span
                              className={`h-8 min-w-[68px] px-3 rounded-full text-[11px] font-extrabold capitalize border inline-flex items-center justify-center ${
                                isPaid
                                  ? "bg-emerald-500/15 text-emerald-800 border-emerald-500/35"
                                  : "bg-amber-500/15 text-amber-800 border-amber-500/35"
                              }`}
                            >
                              {req.paymentStatus || "unpaid"}
                            </span>
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
            totalItems={filteredRequests.length}
            pageSize={PAGE_SIZE}
            onPageChange={setCurrentPage}
            itemLabel="requests"
          />
        </div>
      </div>

      <ThermalReceiptModal
        receipt={activeReceipt}
        onClose={() => setActiveReceipt(null)}
      />

      {modalOpen && selectedBooking && (
        <div
          onClick={() => {
            if (!updatingId) {
              setModalOpen(false);
              setSelectedBooking(null);
            }
          }}
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 backdrop-blur-[2px] p-4"
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="relative w-full max-w-sm rounded-[2rem] bg-white/85 backdrop-blur-xl border border-white/90 ring-1 ring-slate-900/15 p-6 sm:p-7 shadow-[16px_16px_34px_rgba(15,23,42,0.22),-10px_-10px_24px_rgba(255,255,255,0.92),inset_0_1px_0_rgba(255,255,255,0.9)]"
          >
            <h3 className="text-lg font-extrabold text-gray-900 mb-1">
              Enter <span className="text-[#ff5722]">Final Amount</span>
            </h3>
            <p className="text-xs font-medium text-gray-700 mb-4">
              Confirm the completed repair charge for{" "}
              <span className="font-bold text-gray-900">
                {selectedBooking.serviceTitle || "this service"}
              </span>
              .
            </p>

            <div className="relative mb-5">
              <DollarSign
                size={16}
                className="text-[#ff5722] absolute left-4 top-1/2 -translate-y-1/2 pointer-events-none"
              />
              <input
                type="number"
                min="0.01"
                step="any"
                value={finalAmount}
                onChange={(e) => setFinalAmount(e.target.value)}
                className="w-full pl-10 pr-4 py-3 rounded-2xl bg-white/60 border border-white/90 ring-1 ring-slate-900/12 text-sm font-bold text-gray-900 outline-none focus:ring-2 focus:ring-[#ff5722]/35 focus:border-[#ff5722]/50 shadow-[inset_1px_1px_3px_rgba(15,23,42,0.07)]"
              />
            </div>

            <div className="flex gap-2.5">
              <button
                type="button"
                disabled={Boolean(updatingId)}
                onClick={() => {
                  setModalOpen(false);
                  setSelectedBooking(null);
                }}
                className="flex-1 py-3 bg-white/70 hover:bg-white border border-white/90 text-gray-900 text-xs sm:text-sm font-extrabold rounded-full shadow-[5px_5px_12px_rgba(15,23,42,0.09),-4px_-4px_10px_rgba(255,255,255,0.92)] transition-all disabled:opacity-60 cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="button"
                disabled={updatingId === selectedBooking._id}
                onClick={() =>
                  updateStatus(
                    selectedBooking._id,
                    "completed",
                    Number(finalAmount)
                  )
                }
                className="flex-1 py-3 bg-gradient-to-r from-[#ff5722] to-[#ff6d3f] hover:from-[#e64a19] hover:to-[#ff5722] text-white text-xs sm:text-sm font-extrabold rounded-full shadow-[6px_6px_15px_rgba(255,87,34,0.34),-4px_-4px_10px_rgba(255,255,255,0.85)] transition-all disabled:opacity-60 cursor-pointer"
              >
                {updatingId === selectedBooking._id ? "Saving..." : "Confirm"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}