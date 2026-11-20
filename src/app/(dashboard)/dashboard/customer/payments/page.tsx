"use client";

import { useState, useEffect, useMemo } from "react";
import { fetchApi } from "@/lib/api";
import {
  Loader2,
  CreditCard,
  Sparkles,
  Receipt,
  Calendar,
  Wrench,
  UserCheck,
} from "lucide-react";

interface PaymentItem {
  _id?: string;
  id?: string;
  transactionId?: string;
  serviceTitle?: string;
  technicianName?: string;
  amount?: number | string;
  paidAt?: string;
  createdAt?: string;
}

export default function PaymentHistoryPage() {
  const [payments, setPayments] = useState<PaymentItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let active = true;

    fetchApi("/api/payments/my-payments")
      .then((data) => {
        if (!active) return;
        const list = Array.isArray(data)
          ? data
          : Array.isArray(data?.payments)
          ? data.payments
          : Array.isArray(data?.data)
          ? data.data
          : [];
        setPayments(list);
      })
      .catch((err) => {
        console.error(err);
        if (active) setPayments([]);
      })
      .finally(() => {
        if (active) setLoading(false);
      });

    return () => {
      active = false;
    };
  }, []);

  const totalSpent = useMemo(() => {
    return payments.reduce((sum, item) => {
      const val = Number(item.amount ?? 0);
      return sum + (Number.isNaN(val) ? 0 : val);
    }, 0);
  }, [payments]);

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
    <div className="space-y-7 relative">
      {/* Header Banner */}
      <div className="relative overflow-hidden rounded-[2rem] bg-white/15 backdrop-blur-md border border-white/55 p-6 sm:p-8 shadow-[0_10px_28px_rgba(0,0,0,0.03),inset_0_1px_0_rgba(255,255,255,0.65)]">
        <div className="absolute -right-12 -top-12 w-48 h-48 rounded-full bg-[#ff5722]/12 blur-2xl pointer-events-none" />

        <div className="relative z-10 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
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

          <div className="flex items-center gap-3 self-start sm:self-center">
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

      {/* Glass Table Container */}
      <div className="relative overflow-hidden bg-white/15 backdrop-blur-md rounded-[2rem] border border-white/55 shadow-[0_10px_28px_rgba(0,0,0,0.03),inset_0_1px_0_rgba(255,255,255,0.65)]">
        <div className="overflow-x-auto">
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
              </tr>
            </thead>

            <tbody className="divide-y divide-white/40">
              {payments.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-6 py-16 text-center">
                    <div className="inline-flex flex-col items-center justify-center">
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
                  </td>
                </tr>
              ) : (
                payments.map((p, idx) => {
                  const rowKey = p._id || p.id || p.transactionId || idx;
                  const numericAmount = Number(p.amount ?? 0);
                  const displayAmount = Number.isNaN(numericAmount)
                    ? p.amount || "0.00"
                    : numericAmount.toFixed(2);

                  return (
                    <tr
                      key={rowKey}
                      className="group hover:bg-white/25 transition-colors duration-200"
                    >
                      <td className="px-6 py-4 text-xs sm:text-sm font-mono font-semibold text-gray-700 truncate max-w-[150px]">
                        <span
                          title={p.transactionId || ""}
                          className="px-2.5 py-1 rounded-lg bg-white/30 border border-white/50 inline-block max-w-full truncate group-hover:border-[#ff5722]/35 transition-colors"
                        >
                          {p.transactionId || "—"}
                        </span>
                      </td>

                      <td className="px-6 py-4 text-sm font-extrabold text-gray-900 group-hover:text-[#ff5722] transition-colors">
                        {p.serviceTitle || "Repair Service"}
                      </td>

                      <td className="px-6 py-4 text-sm font-semibold text-gray-700">
                        {p.technicianName || "Verified Tech"}
                      </td>

                      <td className="px-6 py-4 text-sm font-extrabold">
                        <span className="inline-flex items-center px-3 py-1 rounded-full bg-[#ff5722]/12 border border-[#ff5722]/25 text-[#ff5722]">
                          ${displayAmount}
                        </span>
                      </td>

                      <td className="px-6 py-4 text-sm font-semibold text-gray-700 whitespace-nowrap">
                        {formatDate(p.paidAt || p.createdAt)}
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