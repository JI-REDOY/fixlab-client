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
}

export default function AdminTransactionsPage() {
  const [payments, setPayments] = useState<PaymentTransaction[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [activeReceipt, setActiveReceipt] = useState<ReceiptPayload | null>(
    null
  );

  const loadPayments = useCallback(() => {
    setLoading(true);
    fetchApi("/api/admin/payments")
      .then((data) => {
        const list = Array.isArray(data)
          ? data
          : Array.isArray(data?.payments)
          ? data.payments
          : Array.isArray(data?.transactions)
          ? data.transactions
          : Array.isArray(data?.data)
          ? data.data
          : [];
        setPayments(list);
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
    <div className="space-y-8 relative z-10">
      <div className="relative overflow-hidden rounded-[2rem] bg-transparent hover:bg-white/5 backdrop-blur-[1px] border border-white/85 ring-1 ring-slate-900/12 p-6 sm:p-8 shadow-[14px_14px_28px_rgba(15,23,42,0.13),-10px_-10px_24px_rgba(255,255,255,0.92),inset_0_1px_0_rgba(255,255,255,0.85)] transition-all duration-300">
        <div className="relative z-10 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
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

      <div className="group relative overflow-hidden bg-transparent hover:bg-white/8 backdrop-blur-[1px] p-6 rounded-[2rem] border border-white/85 ring-1 ring-slate-900/12 hover:ring-[#ff5722]/35 hover:border-[#ff5722]/50 shadow-[14px_14px_28px_rgba(15,23,42,0.13),-10px_-10px_24px_rgba(255,255,255,0.92),inset_0_1px_0_rgba(255,255,255,0.85)] transition-all duration-300 flex items-center justify-between gap-4 w-full sm:w-96">
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 rounded-2xl bg-gradient-to-r from-[#ff5722] to-[#ff6d3f] text-white border border-white/90 ring-1 ring-[#ff5722]/35 flex items-center justify-center shrink-0 shadow-[6px_6px_14px_rgba(255,87,34,0.3),-4px_-4px_10px_rgba(255,255,255,0.85)]">
            <DollarSign size={28} />
          </div>
          <div>
            <p className="text-xs font-extrabold uppercase tracking-wider text-gray-700">
              Total Revenue
            </p>
            <p className="text-3xl font-extrabold text-gray-900 tracking-tight mt-0.5">
              ${totalRevenue}
            </p>
          </div>
        </div>

        <span className="inline-flex items-center gap-1 px-3 py-1.5 rounded-full bg-white/15 backdrop-blur-[1px] border border-white/90 ring-1 ring-emerald-500/25 text-emerald-700 text-xs font-extrabold shadow-[4px_4px_10px_rgba(15,23,42,0.08),-3px_-3px_8px_rgba(255,255,255,0.92)] shrink-0">
          <TrendingUp size={13} />
          <span>Paid</span>
        </span>
      </div>

      <div className="relative overflow-hidden bg-transparent backdrop-blur-[1px] rounded-[2rem] border border-white/85 ring-1 ring-slate-900/12 p-2 sm:p-4 shadow-[14px_14px_30px_rgba(15,23,42,0.14),-10px_-10px_24px_rgba(255,255,255,0.92),inset_0_1px_0_rgba(255,255,255,0.85)]">
        <div className="overflow-x-auto">
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
              {paginatedPayments.length === 0 ? (
                <tr>
                  <td colSpan={7} className="px-6 py-16 text-center">
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
                  </td>
                </tr>
              ) : (
                paginatedPayments.map((t) => {
                  const dateValue = t.paidAt || t.createdAt;
                  const formattedDate = dateValue
                    ? new Date(dateValue).toLocaleDateString()
                    : "—";

                  return (
                    <tr
                      key={t._id}
                      className="group hover:bg-white/10 transition-all duration-200"
                    >
                      <td className="px-6 py-3.5 text-sm font-extrabold text-gray-900 group-hover:text-[#ff5722] transition-colors whitespace-nowrap">
                        {t.customerName || "Customer"}
                      </td>

                      <td className="px-6 py-3.5 text-sm font-semibold text-gray-800 whitespace-nowrap">
                        {t.technicianName || "Technician"}
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
                })
              )}
            </tbody>
          </table>
        </div>

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