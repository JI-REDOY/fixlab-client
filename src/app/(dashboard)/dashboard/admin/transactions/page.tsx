"use client";

import { useState, useEffect, useCallback } from "react";
import { fetchApi } from "@/lib/api";
import Pagination from "@/components/ui/Pagination";
import ThermalReceiptModal, {
  ReceiptPayload,
} from "@/components/receipt/ThermalReceiptModal";
import { transactionToReceipt } from "@/components/receipt/receiptMapper";
import {
  DollarSign,
  Loader2,
  Sparkles,
  User,
  Wrench,
  Hash,
  Calendar,
  TrendingUp,
  Printer,
  Crown,
} from "lucide-react";

const PAGE_SIZE = 6;

interface PaymentTransaction {
  _id: string;
  bookingId?: string;
  customerName?: string;
  customerEmail?: string;
  technicianName?: string;
  technicianEmail?: string;
  serviceTitle?: string;
  transactionId?: string;
  stripePaymentIntentId?: string;
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
  for (const key of ["payments", "transactions", "users", "data", "records", "results"]) {
    if (Array.isArray(payload[key])) return payload[key];
  }
  return [];
}

export default function AdminTransactionsPage() {
  const [payments, setPayments] = useState<PaymentTransaction[]>([]);
  const [proEmails, setProEmails] = useState<Set<string>>(new Set());
  const [proNames, setProNames] = useState<Set<string>>(new Set());
  const [currentPage, setCurrentPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [activeReceipt, setActiveReceipt] = useState<ReceiptPayload | null>(
    null
  );

  const loadPayments = useCallback(() => {
    setLoading(true);
    Promise.all([
      fetchApi("/api/admin/payments"),
      fetchApi("/api/admin/users").catch(() => []),
    ])
      .then(([data, usersData]) => {
        const list = extractList(data);
        setPayments(list);

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
        setPayments([]);
      })
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    loadPayments();
  }, [loadPayments]);

  const isTransactionTechnicianPro = (t: PaymentTransaction): boolean => {
    if (isProActiveFromFields(t)) return true;

    const techEmail = String(t?.technicianEmail || "")
      .trim()
      .toLowerCase();
    const techName = String(t?.technicianName || "")
      .trim()
      .toLowerCase();

    if (techEmail && proEmails.has(techEmail)) return true;
    if (techName && proNames.has(techName)) return true;
    return false;
  };

  const totalRevenue = payments.reduce(
    (sum, p) => sum + Number(p?.amount ?? 0),
    0
  );

  const totalPages = Math.max(1, Math.ceil(payments.length / PAGE_SIZE));
  const safePage = Math.min(currentPage, totalPages);
  const paginatedPayments = payments.slice(
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
        <div className="relative z-10 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div className="min-w-0">
            <span className="inline-flex items-center gap-1.5 py-1 px-3.5 rounded-full bg-white/15 backdrop-blur-[1px] border border-white/90 ring-1 ring-[#ff5722]/25 text-[#ff5722] font-extrabold tracking-wider uppercase text-[11px] mb-3 shadow-[5px_5px_12px_rgba(15,23,42,0.09),-4px_-4px_10px_rgba(255,255,255,0.92)]">
              <Sparkles size={12} /> Payment Ledger
            </span>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-gray-900 tracking-tight">
              <span className="text-[#ff5722]">Transactions</span>
            </h1>
            <p className="text-gray-700 text-sm font-medium mt-1">
              Every payment processed on the platform.
            </p>
          </div>

          <div className="px-5 py-3 rounded-2xl bg-white/10 backdrop-blur-[1px] border border-white/90 ring-1 ring-slate-900/12 shadow-[7px_7px_16px_rgba(15,23,42,0.1),-5px_-5px_12px_rgba(255,255,255,0.92)] self-start sm:self-center">
            <p className="text-[10px] font-extrabold uppercase tracking-wider text-gray-600">
              Total Transactions
            </p>
            <p className="text-lg font-extrabold text-gray-900 mt-0.5">
              {payments.length}
            </p>
          </div>
        </div>
      </div>

      <div className="group relative overflow-hidden bg-transparent hover:bg-white/8 backdrop-blur-[1px] p-5 sm:p-6 rounded-[2rem] border border-white/85 ring-1 ring-slate-900/12 hover:ring-[#ff5722]/35 hover:border-[#ff5722]/50 shadow-[14px_14px_28px_rgba(15,23,42,0.13),-10px_-10px_24px_rgba(255,255,255,0.92),inset_0_1px_0_rgba(255,255,255,0.85)] transition-all duration-300 flex items-center justify-between gap-4 w-full sm:w-96">
        <div className="flex items-center gap-4 min-w-0">
          <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-2xl bg-gradient-to-r from-[#ff5722] to-[#ff6d3f] text-white border border-white/90 ring-1 ring-[#ff5722]/35 flex items-center justify-center shrink-0 shadow-[6px_6px_14px_rgba(255,87,34,0.3),-4px_-4px_10px_rgba(255,255,255,0.85)]">
            <DollarSign size={24} />
          </div>
          <div className="min-w-0">
            <p className="text-xs font-extrabold uppercase tracking-wider text-gray-700">
              Total Revenue
            </p>
            <p className="text-2xl sm:text-3xl font-extrabold text-gray-900 tracking-tight mt-0.5 truncate">
              ${totalRevenue}
            </p>
          </div>
        </div>

        <span className="inline-flex items-center gap-1 px-3 py-1.5 rounded-full bg-white/15 backdrop-blur-[1px] border border-white/90 ring-1 ring-emerald-500/25 text-emerald-700 text-xs font-extrabold shadow-[4px_4px_10px_rgba(15,23,42,0.08),-3px_-3px_8px_rgba(255,255,255,0.92)] shrink-0">
          <TrendingUp size={13} />
          <span>Paid</span>
        </span>
      </div>

      <div className="relative overflow-hidden bg-transparent backdrop-blur-[1px] rounded-[2rem] border border-white/85 ring-1 ring-slate-900/12 p-3 sm:p-4 shadow-[14px_14px_30px_rgba(15,23,42,0.14),-10px_-10px_24px_rgba(255,255,255,0.92),inset_0_1px_0_rgba(255,255,255,0.85)]">
        {paginatedPayments.length === 0 ? (
          <div className="px-4 py-14 text-center">
            <div className="inline-flex flex-col items-center justify-center p-6 rounded-[1.75rem] bg-white/10 backdrop-blur-[1px] border border-white/85 ring-1 ring-slate-900/12 shadow-[10px_10px_22px_rgba(15,23,42,0.1),-8px_-8px_18px_rgba(255,255,255,0.92)]">
              <div className="w-14 h-14 rounded-2xl bg-white/15 border border-white/90 ring-1 ring-[#ff5722]/25 flex items-center justify-center text-[#ff5722] mb-3 shadow-[5px_5px_12px_rgba(15,23,42,0.09),-4px_-4px_10px_rgba(255,255,255,0.92)]">
                <DollarSign size={24} />
              </div>
              <p className="text-sm font-extrabold text-gray-900">
                No transactions yet.
              </p>
              <p className="text-xs font-medium text-gray-700 mt-1">
                Completed customer payments will be recorded here.
              </p>
            </div>
          </div>
        ) : (
          <>
            {/* Mobile Card View */}
            <div className="grid grid-cols-1 gap-3.5 md:hidden p-1">
              {paginatedPayments.map((t) => {
                const dateValue = t.paidAt || t.createdAt;
                const formattedDate = dateValue
                  ? new Date(dateValue).toLocaleDateString()
                  : "—";
                const isTechPro = isTransactionTechnicianPro(t);

                return (
                  <div
                    key={t._id}
                    className="rounded-[1.5rem] bg-white/15 backdrop-blur-[1px] border border-white/90 ring-1 ring-slate-900/10 p-4 shadow-[8px_8px_18px_rgba(15,23,42,0.09),-6px_-6px_14px_rgba(255,255,255,0.9)] space-y-3"
                  >
                    <div className="flex items-start justify-between gap-2.5">
                      <div className="min-w-0">
                        <p className="text-sm font-extrabold text-gray-900 break-words">
                          {t.serviceTitle || "Repair Service"}
                        </p>
                        <div className="inline-flex items-center gap-1.5 text-xs font-semibold text-gray-700 mt-1">
                          <Calendar size={12} className="text-[#ff5722] shrink-0" />
                          <span>{formattedDate}</span>
                        </div>
                      </div>

                      <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-extrabold bg-white/20 border border-white/90 ring-1 ring-[#ff5722]/25 text-[#ff5722] shrink-0">
                        ${Number(t.amount ?? 0)}
                      </span>
                    </div>

                    <div className="space-y-2 pt-2 border-t border-white/70 text-xs">
                      <div className="flex items-center justify-between gap-2">
                        <span className="inline-flex items-center gap-1.5 font-bold text-gray-600 shrink-0">
                          <User size={12} className="text-[#ff5722]" />
                          Customer
                        </span>
                        <span className="font-bold text-gray-900 truncate">
                          {t.customerName || "Customer"}
                        </span>
                      </div>

                      <div className="flex items-center justify-between gap-2">
                        <span className="inline-flex items-center gap-1.5 font-bold text-gray-600 shrink-0">
                          <Wrench size={12} className="text-[#ff5722]" />
                          Technician
                        </span>
                        <div className="inline-flex items-center gap-1.5 min-w-0">
                          <span className="font-bold text-gray-900 truncate">
                            {t.technicianName || "Technician"}
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
                          <Hash size={12} className="text-[#ff5722]" />
                          Txn ID
                        </span>
                        <span
                          title={t.transactionId || ""}
                          className="font-mono text-[11px] font-semibold text-gray-800 truncate max-w-[175px]"
                        >
                          {t.transactionId || "—"}
                        </span>
                      </div>
                    </div>

                    <div className="pt-2.5 border-t border-white/70 flex justify-end">
                      <button
                        type="button"
                        onClick={() =>
                          setActiveReceipt(transactionToReceipt(t))
                        }
                        className="w-full sm:w-auto px-3.5 py-1.5 text-xs font-extrabold text-gray-900 bg-white/25 hover:bg-white/45 backdrop-blur-[1px] border border-white/90 ring-1 ring-slate-900/15 rounded-full shadow-[4px_4px_10px_rgba(15,23,42,0.08),-3px_-3px_8px_rgba(255,255,255,0.92)] inline-flex items-center justify-center gap-1.5 transition-all cursor-pointer"
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
                  <tr className="bg-white/10 border-b border-white/80">
                    <th className="px-6 py-4 text-[11px] font-extrabold text-gray-800 uppercase tracking-wider">
                      <span className="inline-flex items-center gap-1.5">
                        <User size={13} className="text-[#ff5722]" />
                        Customer
                      </span>
                    </th>
                    <th className="px-6 py-4 text-[11px] font-extrabold text-gray-800 uppercase tracking-wider">
                      <span className="inline-flex items-center gap-1.5">
                        <Wrench size={13} className="text-[#ff5722]" />
                        Technician
                      </span>
                    </th>
                    <th className="px-6 py-4 text-[11px] font-extrabold text-gray-800 uppercase tracking-wider">
                      Service
                    </th>
                    <th className="px-6 py-4 text-[11px] font-extrabold text-gray-800 uppercase tracking-wider">
                      <span className="inline-flex items-center gap-1.5">
                        <Hash size={13} className="text-[#ff5722]" />
                        Txn ID
                      </span>
                    </th>
                    <th className="px-6 py-4 text-[11px] font-extrabold text-gray-800 uppercase tracking-wider">
                      <span className="inline-flex items-center gap-1.5">
                        <DollarSign size={13} className="text-[#ff5722]" />
                        Amount
                      </span>
                    </th>
                    <th className="px-6 py-4 text-[11px] font-extrabold text-gray-800 uppercase tracking-wider">
                      <span className="inline-flex items-center gap-1.5">
                        <Calendar size={13} className="text-[#ff5722]" />
                        Date
                      </span>
                    </th>
                    <th className="px-6 py-4 text-[11px] font-extrabold text-gray-800 uppercase tracking-wider text-right">
                      Receipt
                    </th>
                  </tr>
                </thead>

                <tbody className="divide-y divide-white/65">
                  {paginatedPayments.map((t) => {
                    const dateValue = t.paidAt || t.createdAt;
                    const formattedDate = dateValue
                      ? new Date(dateValue).toLocaleDateString()
                      : "—";
                    const isTechPro = isTransactionTechnicianPro(t);

                    return (
                      <tr
                        key={t._id}
                        className="group hover:bg-white/10 transition-all duration-200"
                      >
                        <td className="px-6 py-3.5 text-sm font-extrabold text-gray-900 group-hover:text-[#ff5722] transition-colors whitespace-nowrap">
                          {t.customerName || "Customer"}
                        </td>

                        <td className="px-6 py-3.5 text-sm font-semibold text-gray-800 whitespace-nowrap">
                          <div className="inline-flex items-center gap-2">
                            <span>{t.technicianName || "Technician"}</span>
                            {isTechPro && (
                              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-gradient-to-r from-[#ff5722] to-[#ff6d3f] text-white text-[10px] font-extrabold tracking-wider uppercase shadow-2xs">
                                <Crown size={10} />
                                <span>PRO</span>
                              </span>
                            )}
                          </div>
                        </td>

                        <td className="px-6 py-3.5 text-sm font-semibold text-gray-800">
                          {t.serviceTitle || "Repair Service"}
                        </td>

                        <td className="px-6 py-3.5 whitespace-nowrap">
                          <span
                            title={t.transactionId || ""}
                            className="inline-block px-2.5 py-1 rounded-xl bg-white/15 backdrop-blur-[1px] border border-white/85 ring-1 ring-slate-900/10 text-xs font-mono font-semibold text-gray-800 truncate max-w-[120px] shadow-[3px_3px_8px_rgba(15,23,42,0.06),-2px_-2px_6px_rgba(255,255,255,0.92)]"
                          >
                            {t.transactionId || "—"}
                          </span>
                        </td>

                        <td className="px-6 py-3.5 text-sm font-extrabold whitespace-nowrap">
                          <span className="inline-flex items-center px-3 py-1 rounded-full bg-white/15 backdrop-blur-[1px] border border-white/90 ring-1 ring-[#ff5722]/25 text-[#ff5722] shadow-[3px_3px_8px_rgba(15,23,42,0.08),-3px_-3px_8px_rgba(255,255,255,0.92)]">
                            ${Number(t.amount ?? 0)}
                          </span>
                        </td>

                        <td className="px-6 py-3.5 text-sm font-semibold text-gray-800 whitespace-nowrap">
                          {formattedDate}
                        </td>

                        <td className="px-6 py-3.5 text-right whitespace-nowrap">
                          <button
                            type="button"
                            onClick={() =>
                              setActiveReceipt(transactionToReceipt(t))
                            }
                            className="px-3 py-1.5 text-xs font-extrabold text-gray-900 bg-white/25 hover:bg-white/45 backdrop-blur-[1px] border border-white/90 ring-1 ring-slate-900/15 rounded-full shadow-[4px_4px_10px_rgba(15,23,42,0.08),-3px_-3px_8px_rgba(255,255,255,0.92)] inline-flex items-center gap-1 transition-all cursor-pointer"
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
            itemLabel="transactions"
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