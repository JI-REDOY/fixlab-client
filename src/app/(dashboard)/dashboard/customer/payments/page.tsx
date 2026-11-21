"use client";

import { useState, useEffect, useMemo } from "react";
import { fetchApi } from "@/lib/api";
import { toast } from "@/components/ui/CustomToast";
import Pagination from "@/components/ui/Pagination";
import ThermalReceiptModal, {
  ReceiptPayload,
} from "@/components/receipt/ThermalReceiptModal";
import { transactionToReceipt } from "@/components/receipt/receiptMapper";
import {
  Loader2,
  CreditCard,
  Sparkles,
  Receipt,
  Calendar,
  Wrench,
  UserCheck,
  Printer,
  Crown,
} from "lucide-react";

const PAGE_SIZE = 6;

interface PaymentItem {
  _id?: string;
  id?: string;
  bookingId?: string;
  transactionId?: string;
  stripePaymentIntentId?: string;
  serviceTitle?: string;
  technicianName?: string;
  technicianEmail?: string;
  customerName?: string;
  customerEmail?: string;
  customerPhone?: string;
  address?: string;
  amount?: number | string;
  currency?: string;
  paymentStatus?: string;
  cardBrand?: string;
  cardLast4?: string;
  paidAt?: string;
  createdAt?: string;
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
  for (const key of [
    "payments",
    "technicians",
    "services",
    "users",
    "data",
    "records",
    "results",
  ]) {
    if (Array.isArray(payload[key])) return payload[key];
  }
  return [];
}

export default function PaymentHistoryPage() {
  const [payments, setPayments] = useState<PaymentItem[]>([]);
  const [proEmails, setProEmails] = useState<Set<string>>(new Set());
  const [proNames, setProNames] = useState<Set<string>>(new Set());
  const [currentPage, setCurrentPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [activeReceipt, setActiveReceipt] = useState<ReceiptPayload | null>(
    null
  );

  useEffect(() => {
    let active = true;

    Promise.all([
      fetchApi("/api/payments/my-payments"),
      fetchApi("/api/technicians").catch(() => []),
      fetchApi("/api/services").catch(() => []),
    ])
      .then(([data, techData, servicesData]) => {
        if (!active) return;
        const list = extractList(data);
        setPayments(list);

        const emailsSet = new Set<string>();
        const namesSet = new Set<string>();

        const candidates = [
          ...extractList(techData),
          ...extractList(servicesData),
        ];

        for (const item of candidates) {
          if (isProActiveFromFields(item)) {
            const emailKey = String(
              item?.email || item?.technicianEmail || ""
            )
              .trim()
              .toLowerCase();
            const nameKey = String(item?.name || item?.technicianName || "")
              .trim()
              .toLowerCase();
            if (emailKey) emailsSet.add(emailKey);
            if (nameKey) namesSet.add(nameKey);
          }
        }

        setProEmails(emailsSet);
        setProNames(namesSet);
      })
      .catch((err: any) => {
        console.error(err);
        if (active) {
          toast.error(err?.message || "Failed to load payment history");
          setPayments([]);
        }
      })
      .finally(() => {
        if (active) setLoading(false);
      });

    return () => {
      active = false;
    };
  }, []);

  const isPaymentTechnicianPro = (item: PaymentItem): boolean => {
    if (isProActiveFromFields(item)) return true;

    const techEmail = String(item?.technicianEmail || "")
      .trim()
      .toLowerCase();
    const techName = String(item?.technicianName || "")
      .trim()
      .toLowerCase();

    if (techEmail && proEmails.has(techEmail)) return true;
    if (techName && proNames.has(techName)) return true;
    return false;
  };

  const totalSpent = useMemo(() => {
    return payments.reduce((sum, item) => {
      const val = Number(item.amount ?? 0);
      return sum + (Number.isNaN(val) ? 0 : val);
    }, 0);
  }, [payments]);

  const totalPages = Math.max(1, Math.ceil(payments.length / PAGE_SIZE));
  const safePage = Math.min(currentPage, totalPages);
  const paginatedPayments = payments.slice(
    (safePage - 1) * PAGE_SIZE,
    safePage * PAGE_SIZE
  );

  const formatDate = (dateStr?: string) => {
    if (!dateStr) return "—";
    const parsed = new Date(dateStr);
    return Number.isNaN(parsed.getTime()) ? "—" : parsed.toLocaleDateString();
  };

  if (loading) {
    return (
      <div className="flex justify-center py-24">
        <Loader2 className="animate-spin text-[#ff5722]" size={42} />
      </div>
    );
  }

  return (
    <div className="space-y-7 relative min-w-0">
      <div className="relative overflow-hidden rounded-[2rem] bg-white/15 backdrop-blur-md border border-white/55 p-5 sm:p-8 shadow-[0_10px_28px_rgba(0,0,0,0.03),inset_0_1px_0_rgba(255,255,255,0.65)]">
        <div className="absolute -right-12 -top-12 w-48 h-48 rounded-full bg-[#ff5722]/12 blur-2xl pointer-events-none" />

        <div className="relative z-10 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div className="min-w-0">
            <span className="inline-flex items-center gap-1.5 py-1 px-3.5 rounded-full bg-[#ff5722]/10 border border-[#ff5722]/20 text-[#ff5722] font-extrabold tracking-wider uppercase text-[11px] mb-3">
              <Sparkles size={12} /> Billing & Receipts
            </span>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-gray-900 tracking-tight">
              Payment <span className="text-[#ff5722]">History</span>
            </h1>
            <p className="text-gray-700 text-sm font-medium mt-1">
              All your completed transactions in one place.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2.5 sm:gap-3 self-start sm:self-center">
            <div className="px-4 py-2.5 rounded-2xl bg-white/25 backdrop-blur-xs border border-white/60 shadow-2xs">
              <p className="text-[10px] font-extrabold uppercase tracking-wider text-gray-600">
                Transactions
              </p>
              <p className="text-base font-extrabold text-gray-900">
                {payments.length}
              </p>
            </div>

            <div className="px-4 py-2.5 rounded-2xl bg-[#ff5722]/12 backdrop-blur-xs border border-[#ff5722]/25 shadow-2xs">
              <p className="text-[10px] font-extrabold uppercase tracking-wider text-[#ff5722]">
                Total Paid
              </p>
              <p className="text-base font-extrabold text-[#ff5722]">
                ${totalSpent.toFixed(2)}
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="relative overflow-hidden bg-white/15 backdrop-blur-md rounded-[2rem] border border-white/55 p-3 sm:p-4 shadow-[0_10px_28px_rgba(0,0,0,0.03),inset_0_1px_0_rgba(255,255,255,0.65)]">
        {paginatedPayments.length === 0 ? (
          <div className="px-4 py-14 text-center">
            <div className="inline-flex flex-col items-center justify-center p-6 rounded-[1.75rem] bg-white/25 border border-white/60">
              <div className="w-14 h-14 rounded-2xl bg-[#ff5722]/10 border border-[#ff5722]/20 flex items-center justify-center text-[#ff5722] mb-3">
                <CreditCard size={24} />
              </div>
              <p className="text-sm font-extrabold text-gray-900">
                No payments yet.
              </p>
              <p className="text-xs font-medium text-gray-600 mt-1">
                Completed service payments will appear here.
              </p>
            </div>
          </div>
        ) : (
          <>
            {/* Mobile Card View */}
            <div className="grid grid-cols-1 gap-3.5 md:hidden">
              {paginatedPayments.map((p, idx) => {
                const txId = p.transactionId || p.stripePaymentIntentId || "";
                const rowKey = p._id || p.id || txId || idx;
                const numericAmount = Number(p.amount ?? 0);
                const displayAmount = Number.isNaN(numericAmount)
                  ? p.amount || "0.00"
                  : numericAmount.toFixed(2);
                const isTechPro = isPaymentTechnicianPro(p);

                return (
                  <div
                    key={rowKey}
                    className="rounded-[1.5rem] bg-white/35 backdrop-blur-xs border border-white/70 p-4 shadow-2xs space-y-3"
                  >
                    <div className="flex items-start justify-between gap-2.5">
                      <div className="min-w-0">
                        <p className="text-sm font-extrabold text-gray-900 break-words">
                          {p.serviceTitle || "Repair Service"}
                        </p>
                        <div className="inline-flex items-center gap-1.5 text-xs font-semibold text-gray-600 mt-1">
                          <Calendar size={12} className="text-[#ff5722] shrink-0" />
                          <span>{formatDate(p.paidAt || p.createdAt)}</span>
                        </div>
                      </div>

                      <span className="inline-flex items-center px-3 py-1 rounded-full bg-[#ff5722]/12 border border-[#ff5722]/25 text-xs font-extrabold text-[#ff5722] shrink-0">
                        ${displayAmount}
                      </span>
                    </div>

                    <div className="space-y-2 pt-2.5 border-t border-white/60 text-xs">
                      <div className="flex items-center justify-between gap-2">
                        <span className="inline-flex items-center gap-1.5 font-bold text-gray-600 shrink-0">
                          <UserCheck size={12} className="text-[#ff5722]" />
                          Technician
                        </span>
                        <div className="inline-flex items-center gap-1.5 min-w-0">
                          <span className="font-bold text-gray-900 truncate">
                            {p.technicianName || "Verified Tech"}
                          </span>
                          {isTechPro && (
                            <span className="inline-flex items-center gap-0.5 px-1.5 py-0.5 rounded-full bg-gradient-to-r from-[#ff5722] to-[#ff6d3f] text-white text-[9px] font-extrabold tracking-wider uppercase shrink-0">
                              <Crown size={9} />
                              <span>PRO</span>
                            </span>
                          )}
                        </div>
                      </div>

                      <div className="flex items-center justify-between gap-2">
                        <span className="inline-flex items-center gap-1.5 font-bold text-gray-600 shrink-0">
                          <Receipt size={12} className="text-[#ff5722]" />
                          Txn ID
                        </span>
                        <span
                          title={txId}
                          className="font-mono text-[11px] font-semibold text-gray-800 truncate max-w-[175px]"
                        >
                          {txId || "—"}
                        </span>
                      </div>
                    </div>

                    <div className="pt-2.5 border-t border-white/60 flex justify-end">
                      <button
                        type="button"
                        onClick={() =>
                          setActiveReceipt(transactionToReceipt(p))
                        }
                        className="w-full sm:w-auto px-3.5 py-1.5 text-xs font-extrabold text-gray-900 bg-white/80 hover:bg-white border border-white/80 ring-1 ring-slate-900/10 rounded-full inline-flex items-center justify-center gap-1.5 transition-all cursor-pointer"
                      >
                        <Printer size={13} className="text-[#ff5722]" />
                        <span>Receipt</span>
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
                  <tr className="bg-white/25 border-b border-white/50">
                    <th className="px-6 py-4 text-[11px] font-extrabold text-gray-700 uppercase tracking-wider">
                      <span className="inline-flex items-center gap-1.5">
                        <Receipt size={13} className="text-[#ff5722]" />
                        Transaction ID
                      </span>
                    </th>
                    <th className="px-6 py-4 text-[11px] font-extrabold text-gray-700 uppercase tracking-wider">
                      <span className="inline-flex items-center gap-1.5">
                        <Wrench size={13} className="text-[#ff5722]" />
                        Service
                      </span>
                    </th>
                    <th className="px-6 py-4 text-[11px] font-extrabold text-gray-700 uppercase tracking-wider">
                      <span className="inline-flex items-center gap-1.5">
                        <UserCheck size={13} className="text-[#ff5722]" />
                        Technician
                      </span>
                    </th>
                    <th className="px-6 py-4 text-[11px] font-extrabold text-gray-700 uppercase tracking-wider">
                      <span className="inline-flex items-center gap-1.5">
                        <CreditCard size={13} className="text-[#ff5722]" />
                        Amount
                      </span>
                    </th>
                    <th className="px-6 py-4 text-[11px] font-extrabold text-gray-700 uppercase tracking-wider">
                      <span className="inline-flex items-center gap-1.5">
                        <Calendar size={13} className="text-[#ff5722]" />
                        Date
                      </span>
                    </th>
                    <th className="px-6 py-4 text-[11px] font-extrabold text-gray-700 uppercase tracking-wider text-right">
                      Receipt
                    </th>
                  </tr>
                </thead>

                <tbody className="divide-y divide-white/40">
                  {paginatedPayments.map((p, idx) => {
                    const txId = p.transactionId || p.stripePaymentIntentId || "";
                    const rowKey = p._id || p.id || txId || idx;
                    const numericAmount = Number(p.amount ?? 0);
                    const displayAmount = Number.isNaN(numericAmount)
                      ? p.amount || "0.00"
                      : numericAmount.toFixed(2);
                    const isTechPro = isPaymentTechnicianPro(p);

                    return (
                      <tr
                        key={rowKey}
                        className="group hover:bg-white/25 transition-colors duration-200"
                      >
                        <td className="px-6 py-3.5 text-xs sm:text-sm font-mono font-semibold text-gray-700 truncate max-w-[150px]">
                          <span
                            title={txId}
                            className="px-2.5 py-1 rounded-lg bg-white/30 border border-white/50 inline-block max-w-full truncate group-hover:border-[#ff5722]/35 transition-colors"
                          >
                            {txId || "—"}
                          </span>
                        </td>

                        <td className="px-6 py-3.5 text-sm font-extrabold text-gray-900 group-hover:text-[#ff5722] transition-colors">
                          {p.serviceTitle || "Repair Service"}
                        </td>

                        <td className="px-6 py-3.5 text-sm font-semibold text-gray-700 whitespace-nowrap">
                          <div className="inline-flex items-center gap-2 flex-wrap">
                            <span>{p.technicianName || "Verified Tech"}</span>
                            {isTechPro && (
                              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-gradient-to-r from-[#ff5722] to-[#ff6d3f] text-white text-[10px] font-extrabold tracking-wider uppercase shadow-2xs">
                                <Crown size={10} />
                                <span>PRO</span>
                              </span>
                            )}
                          </div>
                        </td>

                        <td className="px-6 py-3.5 text-sm font-extrabold">
                          <span className="inline-flex items-center px-3 py-1 rounded-full bg-[#ff5722]/12 border border-[#ff5722]/25 text-[#ff5722]">
                            ${displayAmount}
                          </span>
                        </td>

                        <td className="px-6 py-3.5 text-sm font-semibold text-gray-700 whitespace-nowrap">
                          {formatDate(p.paidAt || p.createdAt)}
                        </td>

                        <td className="px-6 py-3.5 text-right whitespace-nowrap">
                          <button
                            type="button"
                            onClick={() =>
                              setActiveReceipt(transactionToReceipt(p))
                            }
                            className="px-3 py-1.5 text-xs font-extrabold text-gray-900 bg-white/75 hover:bg-white border border-white/80 ring-1 ring-slate-900/10 rounded-full inline-flex items-center gap-1 transition-all cursor-pointer"
                          >
                            <Printer size={13} className="text-[#ff5722]" />
                            <span>Receipt</span>
                          </button>
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
            totalItems={payments.length}
            pageSize={PAGE_SIZE}
            onPageChange={setCurrentPage}
            itemLabel="payments"
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