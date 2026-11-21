"use client";

import { useState, useEffect, useCallback } from "react";
import { fetchApi } from "@/lib/api";
import Pagination from "@/components/ui/Pagination";
import ThermalReceiptModal, {
  ReceiptPayload,
} from "@/components/receipt/ThermalReceiptModal";
import { bookingToReceipt } from "@/components/receipt/receiptMapper";
import {
  Loader2,
  Sparkles,
  Wrench,
  User,
  UserCheck,
  Calendar,
  Activity,
  DollarSign,
  Printer,
  Crown,
} from "lucide-react";

const PAGE_SIZE = 6;

const filterTabs = [
  "all",
  "requested",
  "accepted",
  "in-progress",
  "completed",
  "cancelled",
];

interface AdminBookingItem {
  _id: string;
  serviceTitle?: string;
  customerName?: string;
  customerEmail?: string;
  customerPhone?: string;
  address?: string;
  technicianName?: string;
  technicianEmail?: string;
  preferredDate?: string;
  createdAt?: string;
  status: string;
  paymentStatus?: string;
  basePrice?: number | string;
  finalAmount?: number | string;
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
  for (const key of ["bookings", "users", "data", "records", "results"]) {
    if (Array.isArray(payload[key])) return payload[key];
  }
  return [];
}

export default function AdminBookingsPage() {
  const [bookings, setBookings] = useState<AdminBookingItem[]>([]);
  const [proEmails, setProEmails] = useState<Set<string>>(new Set());
  const [proNames, setProNames] = useState<Set<string>>(new Set());
  const [filter, setFilter] = useState("all");
  const [currentPage, setCurrentPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [activeReceipt, setActiveReceipt] = useState<ReceiptPayload | null>(
    null
  );

  const loadBookings = useCallback(() => {
    setLoading(true);
    Promise.all([
      fetchApi("/api/admin/bookings"),
      fetchApi("/api/admin/users").catch(() => []),
    ])
      .then(([data, usersData]) => {
        const list = extractList(data);
        setBookings(list);

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
      .catch((err) => {
        console.error(err);
        setBookings([]);
      })
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    loadBookings();
  }, [loadBookings]);

  const isBookingTechnicianPro = (booking: AdminBookingItem): boolean => {
    if (isProActiveFromFields(booking)) return true;

    const techEmail = String(booking?.technicianEmail || "")
      .trim()
      .toLowerCase();
    const techName = String(booking?.technicianName || "")
      .trim()
      .toLowerCase();

    if (techEmail && proEmails.has(techEmail)) return true;
    if (techName && proNames.has(techName)) return true;
    return false;
  };

  const filteredBookings =
    filter === "all"
      ? bookings
      : bookings.filter((b) => b.status === filter);

  const totalPages = Math.max(1, Math.ceil(filteredBookings.length / PAGE_SIZE));
  const safePage = Math.min(currentPage, totalPages);
  const paginatedBookings = filteredBookings.slice(
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
              <Sparkles size={12} /> Platform Bookings
            </span>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-gray-900 tracking-tight">
              All <span className="text-[#ff5722]">Bookings</span>
            </h1>
            <p className="text-gray-700 text-sm font-medium mt-1">
              Monitor every repair job across the platform.
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
                    <Wrench size={13} className="text-[#ff5722]" />
                    Service
                  </span>
                </th>
                <th className="px-6 py-4 text-[11px] font-extrabold text-gray-800 uppercase tracking-wider">
                  <span className="inline-flex items-center gap-1.5">
                    <User size={13} className="text-[#ff5722]" />
                    Customer
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
                <th className="px-6 py-4 text-[11px] font-extrabold text-gray-800 uppercase tracking-wider">
                  <span className="inline-flex items-center gap-1.5">
                    <DollarSign size={13} className="text-[#ff5722]" />
                    Amount
                  </span>
                </th>
                <th className="px-6 py-4 text-[11px] font-extrabold text-gray-800 uppercase tracking-wider text-right">
                  Receipt
                </th>
              </tr>
            </thead>

            <tbody className="divide-y divide-white/65">
              {paginatedBookings.length === 0 ? (
                <tr>
                  <td colSpan={7} className="px-6 py-16 text-center">
                    <div className="inline-flex flex-col items-center justify-center p-6 rounded-[1.75rem] bg-white/10 backdrop-blur-[1px] border border-white/85 ring-1 ring-slate-900/12 shadow-[10px_10px_22px_rgba(15,23,42,0.1),-8px_-8px_18px_rgba(255,255,255,0.92)]">
                      <div className="w-14 h-14 rounded-2xl bg-white/15 border border-white/90 ring-1 ring-[#ff5722]/25 flex items-center justify-center text-[#ff5722] mb-3 shadow-[5px_5px_12px_rgba(15,23,42,0.09),-4px_-4px_10px_rgba(255,255,255,0.92)]">
                        <Wrench size={24} />
                      </div>
                      <p className="text-sm font-extrabold text-gray-900">
                        No bookings found.
                      </p>
                      <p className="text-xs font-medium text-gray-700 mt-1">
                        Bookings matching this filter will appear here.
                      </p>
                    </div>
                  </td>
                </tr>
              ) : (
                paginatedBookings.map((b) => {
                  const dateValue = b.preferredDate || b.createdAt;
                  const formattedDate = dateValue
                    ? new Date(dateValue).toLocaleDateString()
                    : "—";
                  const amount = b.finalAmount ?? b.basePrice ?? 0;
                  const canPrintReceipt = [
                    "accepted",
                    "in-progress",
                    "completed",
                  ].includes(b.status);
                  const isTechPro = isBookingTechnicianPro(b);

                  const statusBadgeStyle =
                    b.status === "completed"
                      ? "bg-emerald-500/12 text-emerald-700 ring-emerald-500/25"
                      : b.status === "in-progress"
                      ? "bg-amber-500/15 text-amber-800 ring-amber-500/30"
                      : b.status === "accepted"
                      ? "bg-indigo-500/12 text-indigo-800 ring-indigo-500/30"
                      : b.status === "cancelled"
                      ? "bg-red-500/12 text-red-700 ring-red-500/25"
                      : "bg-blue-500/12 text-blue-700 ring-blue-500/25";

                  return (
                    <tr
                      key={b._id}
                      className="group hover:bg-white/10 transition-all duration-200"
                    >
                      <td className="px-6 py-3.5 font-extrabold text-sm text-gray-900 group-hover:text-[#ff5722] transition-colors">
                        {b.serviceTitle || "Repair Service"}
                      </td>

                      <td className="px-6 py-3.5 text-sm font-semibold text-gray-800 whitespace-nowrap">
                        {b.customerName || "Customer"}
                      </td>

                      <td className="px-6 py-3.5 text-sm font-semibold text-gray-800 whitespace-nowrap">
                        <div className="inline-flex items-center gap-2">
                          <span>{b.technicianName || "Technician"}</span>
                          {isTechPro && (
                            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-gradient-to-r from-[#ff5722] to-[#ff6d3f] text-white text-[10px] font-extrabold tracking-wider uppercase shadow-2xs">
                              <Crown size={10} />
                              <span>PRO</span>
                            </span>
                          )}
                        </div>
                      </td>

                      <td className="px-6 py-3.5 text-sm font-semibold text-gray-800 whitespace-nowrap">
                        {formattedDate}
                      </td>

                      <td className="px-6 py-3.5 whitespace-nowrap">
                        <span
                          className={`inline-block px-3.5 py-1 text-xs font-extrabold rounded-full capitalize bg-white/15 backdrop-blur-[1px] border border-white/90 ring-1 shadow-[3px_3px_8px_rgba(15,23,42,0.08),-3px_-3px_8px_rgba(255,255,255,0.92)] ${statusBadgeStyle}`}
                        >
                          {b.status.replace("-", " ")}
                        </span>
                      </td>

                      <td className="px-6 py-3.5 text-sm font-extrabold whitespace-nowrap">
                        <span className="inline-flex items-center px-3 py-1 rounded-full bg-white/15 backdrop-blur-[1px] border border-white/90 ring-1 ring-[#ff5722]/25 text-[#ff5722] shadow-[3px_3px_8px_rgba(15,23,42,0.08),-3px_-3px_8px_rgba(255,255,255,0.92)]">
                          ${amount}
                        </span>
                      </td>

                      <td className="px-6 py-3.5 text-right whitespace-nowrap">
                        {canPrintReceipt ? (
                          <button
                            type="button"
                            onClick={() =>
                              setActiveReceipt(bookingToReceipt(b))
                            }
                            className="px-3 py-1.5 text-xs font-extrabold text-gray-900 bg-white/25 hover:bg-white/45 backdrop-blur-[1px] border border-white/90 ring-1 ring-slate-900/15 rounded-full shadow-[4px_4px_10px_rgba(15,23,42,0.08),-3px_-3px_8px_rgba(255,255,255,0.92)] inline-flex items-center gap-1 transition-all cursor-pointer"
                          >
                            <Printer size={13} className="text-[#ff5722]" />
                            <span>Receipt</span>
                          </button>
                        ) : (
                          <span className="text-xs font-semibold text-gray-400">
                            —
                          </span>
                        )}
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
            totalItems={filteredBookings.length}
            pageSize={PAGE_SIZE}
            onPageChange={setCurrentPage}
            itemLabel="bookings"
          />
        </div>
      </div>

      <ThermalReceiptModal
        receipt={activeReceipt}
        onClose={() => setActiveReceipt(null)}
      />
    </div>
  );
}