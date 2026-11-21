"use client";

import { useState, useEffect, useMemo } from "react";
import { fetchApi } from "@/lib/api";
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
  User,
  Printer,
  Crown,
} from "lucide-react";

const PAGE_SIZE = 6;

type TxFilter = "all" | "service" | "subscription";

interface TechnicianPaymentItem {
  _id?: string;
  id?: string;
  type?: "booking" | "subscription" | string;
  planId?: string;
  bookingId?: string;
  transactionId?: string;
  stripePaymentIntentId?: string;
  serviceTitle?: string;
  customerName?: string;
  customerEmail?: string;
  customerPhone?: string;
  address?: string;
  technicianName?: string;
  technicianEmail?: string;
  amount?: number | string;
  currency?: string;
  paymentStatus?: string;
  cardBrand?: string;
  cardLast4?: string;
  paidAt?: string;
  createdAt?: string;
}

function isSubscriptionPayment(item: TechnicianPaymentItem): boolean {
  if (item.type === "subscription") return true;
  const title = String(item.serviceTitle || "").toLowerCase();
  return title.includes("pro monthly") || title.includes("pro yearly") || title.includes("fixlab pro");
}

export default function TechnicianTransactionsPage() {
  const [payments, setPayments] = useState<TechnicianPaymentItem[]>([]);
  const [filter, setFilter] = useState<TxFilter>("all");
  const [currentPage, setCurrentPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [activeReceipt, setActiveReceipt] = useState<ReceiptPayload | null>(
    null
  );

  useEffect(() => {
    let active = true;

    const loadTechnicianTransactions = async () => {
      try {
        let list: TechnicianPaymentItem[] = [];

        try {
          const data = await fetchApi("/api/payments/technician");
          list = Array.isArray(data)
            ? data
            : Array.isArray(data?.payments)
            ? data.payments
            : Array.isArray(data?.transactions)
            ? data.transactions
            : Array.isArray(data?.data)
            ? data.data
            : [];
        } catch {
          // Fallback: build paid transaction entries from technician bookings
          const bookingRes = await fetchApi("/api/bookings/technician");
          const bookings = Array.isArray(bookingRes)
            ? bookingRes
            : Array.isArray(bookingRes?.requests)
            ? bookingRes.requests
            : Array.isArray(bookingRes?.bookings)
            ? bookingRes.bookings
            : Array.isArray(bookingRes?.data)
            ? bookingRes.data
            : [];

          list = bookings
            .filter(
              (b: any) =>
                b?.paymentStatus === "paid" || b?.status === "paid"
            )
            .map((b: any) => ({
              _id: b._id,
              type: "booking",
              bookingId: b._id,
              transactionId:
                b.transactionId ||
                b.stripePaymentIntentId ||
                `JOB-${String(b._id || "").slice(-6).toUpperCase()}`,
              serviceTitle: b.serviceTitle || "Repair Service",
              customerName: b.customerName || "Customer",
              customerEmail: b.customerEmail || "",
              customerPhone: b.customerPhone || "",
              address: b.address || "",
              technicianName: b.technicianName || "Verified Tech",
              technicianEmail: b.technicianEmail || "",
              amount: b.finalAmount ?? b.basePrice ?? 0,
              currency: "usd",
              paymentStatus: "paid",
              paidAt: b.paidAt || b.updatedAt || b.preferredDate || b.createdAt,
            }));
        }

        if (!active) return;

        // Ensure Pro subscription shows even if /api/payments/technician only returns booking payments
        const hasSubscriptionInList = list.some((item) =>
          isSubscriptionPayment(item)
        );

        if (!hasSubscriptionInList) {
          try {
            const meData = await fetchApi("/api/auth/me");
            const meUser = meData?.user || meData;
            if (
              active &&
              meUser &&
              (meUser.plan === "pro" || meUser.isVerifiedPro)
            ) {
              const isYearly = meUser.proPlanId === "pro_yearly";
              const subAmount = isYearly ? 149 : 19;
              list = [
                {
                  _id: `pro-sub-${meUser._id || meUser.email || "user"}`,
                  type: "subscription",
                  planId: meUser.proPlanId || "pro_monthly",
                  transactionId:
                    meUser.proSessionId ||
                    `PRO-${String(meUser._id || "SUB")
                      .slice(-6)
                      .toUpperCase()}`,
                  serviceTitle: isYearly
                    ? "FixLab Pro Yearly"
                    : "FixLab Pro Monthly",
                  customerName: "Self (Pro Plan)",
                  customerEmail: meUser.email || "",
                  technicianName: meUser.name || "Technician",
                  technicianEmail: meUser.email || "",
                  amount: subAmount,
                  currency: "usd",
                  paymentStatus: "paid",
                  paidAt: meUser.proUpgradedAt || meUser.updatedAt,
                },
                ...list,
              ];
            }
          } catch {
            // Ignore secondary /api/auth/me error
          }
        }

        if (active) {
          setPayments(list);
        }
      } catch (err) {
        console.error(err);
        if (active) setPayments([]);
      } finally {
        if (active) setLoading(false);
      }
    };

    loadTechnicianTransactions();

    return () => {
      active = false;
    };
  }, []);

  const filteredPayments = useMemo(() => {
    if (filter === "subscription") {
      return payments.filter((item) => isSubscriptionPayment(item));
    }
    if (filter === "service") {
      return payments.filter((item) => !isSubscriptionPayment(item));
    }
    return payments;
  }, [payments, filter]);

  const subscriptionCount = useMemo(
    () => payments.filter((item) => isSubscriptionPayment(item)).length,
    [payments]
  );

  const totalEarned = useMemo(() => {
    return payments
      .filter((item) => !isSubscriptionPayment(item))
      .reduce((sum, item) => {
        const val = Number(item.amount ?? 0);
        return sum + (Number.isNaN(val) ? 0 : val);
      }, 0);
  }, [payments]);

  const totalPages = Math.max(
    1,
    Math.ceil(filteredPayments.length / PAGE_SIZE)
  );
  const safePage = Math.min(currentPage, totalPages);
  const paginatedPayments = filteredPayments.slice(
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
    <div className="space-y-7 relative z-10">
      <div className="relative overflow-hidden rounded-[2rem] bg-white/15 backdrop-blur-md border border-white/55 p-6 sm:p-8 shadow-[0_10px_28px_rgba(0,0,0,0.03),inset_0_1px_0_rgba(255,255,255,0.65)]">
        <div className="absolute -right-12 -top-12 w-48 h-48 rounded-full bg-[#ff5722]/12 blur-2xl pointer-events-none" />

        <div className="relative z-10 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <span className="inline-flex items-center gap-1.5 py-1 px-3.5 rounded-full bg-[#ff5722]/10 border border-[#ff5722]/20 text-[#ff5722] font-extrabold tracking-wider uppercase text-[11px] mb-3">
              <Sparkles size={12} /> Earnings & Subscriptions
            </span>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-gray-900 tracking-tight">
              My <span className="text-[#ff5722]">Transactions</span>
            </h1>
            <p className="text-gray-700 text-sm font-medium mt-1">
              View completed job payments, your Pro plan payments, and print
              receipts.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3 self-start sm:self-center">
            <div className="px-4 py-2.5 rounded-2xl bg-white/25 backdrop-blur-xs border border-white/60 shadow-2xs">
              <p className="text-[10px] font-extrabold uppercase tracking-wider text-gray-600">
                Transactions
              </p>
              <p className="text-base font-extrabold text-gray-900">
                {payments.length}
              </p>
            </div>

            <div className="px-4 py-2.5 rounded-2xl bg-emerald-500/12 backdrop-blur-xs border border-emerald-500/25 shadow-2xs">
              <p className="text-[10px] font-extrabold uppercase tracking-wider text-emerald-800">
                Pro Plans
              </p>
              <p className="text-base font-extrabold text-emerald-800">
                {subscriptionCount}
              </p>
            </div>

            <div className="px-4 py-2.5 rounded-2xl bg-[#ff5722]/12 backdrop-blur-xs border border-[#ff5722]/25 shadow-2xs">
              <p className="text-[10px] font-extrabold uppercase tracking-wider text-[#ff5722]">
                Total Earned
              </p>
              <p className="text-base font-extrabold text-[#ff5722]">
                ${totalEarned.toFixed(2)}
              </p>
            </div>
          </div>
        </div>

        {/* Filter Tabs */}
        <div className="relative z-10 flex flex-wrap items-center gap-2 mt-5 pt-4 border-t border-white/40">
          <button
            type="button"
            onClick={() => {
              setFilter("all");
              setCurrentPage(1);
            }}
            className={`px-4 py-1.5 rounded-full text-xs font-extrabold transition cursor-pointer ${
              filter === "all"
                ? "bg-[#ff5722] text-white shadow-xs"
                : "bg-white/65 text-gray-700 hover:bg-white"
            }`}
          >
            All ({payments.length})
          </button>

          <button
            type="button"
            onClick={() => {
              setFilter("service");
              setCurrentPage(1);
            }}
            className={`px-4 py-1.5 rounded-full text-xs font-extrabold transition cursor-pointer ${
              filter === "service"
                ? "bg-[#ff5722] text-white shadow-xs"
                : "bg-white/65 text-gray-700 hover:bg-white"
            }`}
          >
            Service Earnings ({payments.length - subscriptionCount})
          </button>

          <button
            type="button"
            onClick={() => {
              setFilter("subscription");
              setCurrentPage(1);
            }}
            className={`inline-flex items-center gap-1.5 px-4 py-1.5 rounded-full text-xs font-extrabold transition cursor-pointer ${
              filter === "subscription"
                ? "bg-emerald-700 text-white shadow-xs"
                : "bg-white/65 text-gray-700 hover:bg-white"
            }`}
          >
            <Crown size={13} />
            <span>Pro Subscriptions ({subscriptionCount})</span>
          </button>
        </div>
      </div>

      <div className="relative overflow-hidden bg-white/15 backdrop-blur-md rounded-[2rem] border border-white/55 p-2 sm:p-4 shadow-[0_10px_28px_rgba(0,0,0,0.03),inset_0_1px_0_rgba(255,255,255,0.65)]">
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
                    Service / Plan
                  </span>
                </th>
                <th className="px-6 py-4 text-[11px] font-extrabold text-gray-700 uppercase tracking-wider">
                  <span className="inline-flex items-center gap-1.5">
                    <User size={13} className="text-[#ff5722]" />
                    Customer / Type
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
              {paginatedPayments.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-6 py-16 text-center">
                    <div className="inline-flex flex-col items-center justify-center">
                      <div className="w-14 h-14 rounded-2xl bg-[#ff5722]/10 border border-[#ff5722]/20 flex items-center justify-center text-[#ff5722] mb-3">
                        <CreditCard size={24} />
                      </div>
                      <p className="text-sm font-extrabold text-gray-900">
                        No transactions found.
                      </p>
                      <p className="text-xs font-medium text-gray-600 mt-1">
                        {filter === "subscription"
                          ? "Your Pro plan subscription payments will appear here."
                          : "Paid job and subscription transactions will appear here."}
                      </p>
                    </div>
                  </td>
                </tr>
              ) : (
                paginatedPayments.map((p, idx) => {
                  const rowKey = p._id || p.id || p.transactionId || idx;
                  const isSub = isSubscriptionPayment(p);
                  const numericAmount = Number(p.amount ?? 0);
                  const displayAmount = Number.isNaN(numericAmount)
                    ? p.amount || "0.00"
                    : numericAmount.toFixed(2);

                  return (
                    <tr
                      key={rowKey}
                      className="group hover:bg-white/25 transition-colors duration-200"
                    >
                      <td className="px-6 py-3.5 text-xs sm:text-sm font-mono font-semibold text-gray-700 truncate max-w-[150px]">
                        <span
                          title={p.transactionId || ""}
                          className="px-2.5 py-1 rounded-lg bg-white/30 border border-white/50 inline-block max-w-full truncate group-hover:border-[#ff5722]/35 transition-colors"
                        >
                          {p.transactionId || "—"}
                        </span>
                      </td>

                      <td className="px-6 py-3.5 text-sm font-extrabold text-gray-900 group-hover:text-[#ff5722] transition-colors">
                        <div className="flex items-center gap-2 flex-wrap">
                          <span>{p.serviceTitle || "Repair Service"}</span>
                          {isSub && (
                            <span className="inline-flex items-center gap-1 rounded-full bg-emerald-100 text-emerald-800 px-2 py-0.5 text-[10px] font-extrabold">
                              <Crown size={11} />
                              Pro Plan
                            </span>
                          )}
                        </div>
                      </td>

                      <td className="px-6 py-3.5 text-sm font-semibold text-gray-700">
                        {isSub
                          ? "Pro Subscription"
                          : p.customerName || "Customer"}
                      </td>

                      <td className="px-6 py-3.5 text-sm font-extrabold">
                        <span
                          className={`inline-flex items-center px-3 py-1 rounded-full border ${
                            isSub
                              ? "bg-emerald-500/12 border-emerald-500/25 text-emerald-800"
                              : "bg-[#ff5722]/12 border-[#ff5722]/25 text-[#ff5722]"
                          }`}
                        >
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
                })
              )}
            </tbody>
          </table>
        </div>

        <div className="px-4 pb-2">
          <Pagination
            currentPage={safePage}
            totalItems={filteredPayments.length}
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