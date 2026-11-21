"use client";

import { useEffect, useMemo, useState } from "react";
import { Crown, Printer, Search, ShieldCheck, Calendar, Hash } from "lucide-react";
import ThermalReceiptModal, {
  ReceiptPayload,
} from "@/components/receipt/ThermalReceiptModal";

interface ProPaymentRecord {
  _id?: string;
  id?: string;
  type?: string;
  planId?: string;
  serviceTitle?: string;
  technicianName?: string;
  technicianEmail?: string;
  customerEmail?: string;
  email?: string;
  amount?: number;
  currency?: string;
  transactionId?: string;
  stripePaymentIntentId?: string;
  paymentStatus?: string;
  paidAt?: string;
  createdAt?: string;
  cardBrand?: string;
  cardLast4?: string;
}

interface AdminUserRecord {
  _id?: string;
  id?: string;
  name?: string;
  email?: string;
  role?: string;
  plan?: string;
  isVerifiedPro?: boolean;
  proPlanId?: string;
  proUpgradedAt?: string;
  proExpiresAt?: string;
}

interface ProRowItem {
  id: string;
  name: string;
  email: string;
  planLabel: string;
  amount: number;
  currency: string;
  transactionId: string;
  paymentStatus: string;
  date: string;
  cardBrand?: string;
  cardLast4?: string;
}

function getAuthToken(): string | null {
  if (typeof window === "undefined") return null;
  return (
    localStorage.getItem("fixlab_token") ||
    localStorage.getItem("token") ||
    localStorage.getItem("accessToken") ||
    null
  );
}

function extractArray(payload: any, keys: string[]): any[] {
  if (Array.isArray(payload)) return payload;
  if (!payload || typeof payload !== "object") return [];
  for (const key of keys) {
    if (Array.isArray(payload[key])) return payload[key];
  }
  return [];
}

function isSubscriptionPayment(p: ProPaymentRecord): boolean {
  if (!p || typeof p !== "object") return false;
  if (p.type === "subscription") return true;
  if (p.planId === "pro_monthly" || p.planId === "pro_yearly") return true;
  const title = String(p.serviceTitle || "").toLowerCase();
  if (title.includes("pro") || title.includes("subscription")) return true;
  return false;
}

function isUserPro(u: AdminUserRecord): boolean {
  if (!u || typeof u !== "object") return false;
  return Boolean(u.plan === "pro" || u.isVerifiedPro);
}

function formatDateLabel(dateStr?: string): string {
  if (!dateStr) return "—";
  const parsed = new Date(dateStr);
  if (Number.isNaN(parsed.getTime())) return "—";
  return parsed.toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
}

function proRowToReceipt(row: ProRowItem): ReceiptPayload {
  return {
    type: "transaction",
    bookingId: row.id,
    transactionId: row.transactionId !== "—" ? row.transactionId : undefined,
    serviceTitle: row.planLabel,
    status: "completed",
    paymentStatus: row.paymentStatus || "paid",
    amount: row.amount.toFixed(2),
    currency: row.currency.toLowerCase(),
    technicianName: row.name,
    technicianEmail: row.email !== "—" ? row.email : undefined,
    customerName: row.name,
    customerEmail: row.email !== "—" ? row.email : undefined,
    paidAt: row.date || new Date().toISOString(),
    cardBrand: row.cardBrand,
    cardLast4: row.cardLast4,
  };
}

export default function AdminProPaymentsPage() {
  const [payments, setPayments] = useState<ProPaymentRecord[]>([]);
  const [proUsers, setProUsers] = useState<AdminUserRecord[]>([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeReceipt, setActiveReceipt] = useState<ReceiptPayload | null>(
    null
  );

  useEffect(() => {
    let active = true;

    const loadProData = async () => {
      try {
        setLoading(true);
        setError(null);

        const token = getAuthToken();
        const baseUrl =
          process.env.NEXT_PUBLIC_SERVER_URL || "http://localhost:5000";
        const headers: HeadersInit = {
          "Content-Type": "application/json",
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        };

        const [paymentsRes, usersRes] = await Promise.all([
          fetch(`${baseUrl}/api/admin/payments`, {
            headers,
            credentials: "include",
          }),
          fetch(`${baseUrl}/api/admin/users`, {
            headers,
            credentials: "include",
          }),
        ]);

        let nextPayments: ProPaymentRecord[] = [];
        let nextProUsers: AdminUserRecord[] = [];
        const errors: string[] = [];

        if (paymentsRes.ok) {
          const paymentsJson = await paymentsRes.json().catch(() => []);
          const rawPayments = extractArray(paymentsJson, [
            "payments",
            "data",
            "records",
            "results",
          ]);
          nextPayments = rawPayments.filter(isSubscriptionPayment);
        } else {
          const errJson = await paymentsRes.json().catch(() => ({}));
          errors.push(
            errJson?.message || `Payments API error (${paymentsRes.status})`
          );
        }

        if (usersRes.ok) {
          const usersJson = await usersRes.json().catch(() => []);
          const rawUsers = extractArray(usersJson, [
            "users",
            "data",
            "records",
            "results",
          ]);
          nextProUsers = rawUsers.filter(isUserPro);
        } else {
          const errJson = await usersRes.json().catch(() => ({}));
          errors.push(
            errJson?.message || `Users API error (${usersRes.status})`
          );
        }

        if (!active) return;

        setPayments(nextPayments);
        setProUsers(nextProUsers);

        if (
          nextPayments.length === 0 &&
          nextProUsers.length === 0 &&
          errors.length > 0
        ) {
          setError(errors.join(" • "));
        }
      } catch (err: any) {
        if (active) {
          setError(err?.message || "Error loading Pro payments");
        }
      } finally {
        if (active) {
          setLoading(false);
        }
      }
    };

    loadProData();

    return () => {
      active = false;
    };
  }, []);

  const mergedRows = useMemo<ProRowItem[]>(() => {
    const paymentByEmail = new Map<string, ProPaymentRecord>();
    for (const p of payments) {
      const email = String(
        p.technicianEmail || p.email || p.customerEmail || ""
      )
        .trim()
        .toLowerCase();
      if (email && !paymentByEmail.has(email)) {
        paymentByEmail.set(email, p);
      }
    }

    const rows: ProRowItem[] = [];
    const seenEmails = new Set<string>();

    for (let i = 0; i < proUsers.length; i++) {
      const u = proUsers[i];
      const emailRaw = String(u.email || "").trim();
      const emailKey = emailRaw.toLowerCase();
      if (emailKey) seenEmails.add(emailKey);

      const matchedPayment = emailKey ? paymentByEmail.get(emailKey) : undefined;
      const resolvedPlanId = u.proPlanId || matchedPayment?.planId;

      rows.push({
        id: String(u._id || u.id || emailKey || `pro-user-${i}`),
        name: u.name || matchedPayment?.technicianName || "Technician",
        email: emailRaw || matchedPayment?.technicianEmail || "—",
        planLabel:
          matchedPayment?.serviceTitle ||
          (resolvedPlanId === "pro_yearly"
            ? "FixLab Pro Yearly"
            : "FixLab Pro Monthly"),
        amount:
          typeof matchedPayment?.amount === "number"
            ? matchedPayment.amount
            : resolvedPlanId === "pro_yearly"
            ? 149
            : 19,
        currency: (matchedPayment?.currency || "usd").toUpperCase(),
        transactionId:
          matchedPayment?.transactionId ||
          matchedPayment?.stripePaymentIntentId ||
          "—",
        paymentStatus: matchedPayment?.paymentStatus || "paid",
        date:
          matchedPayment?.paidAt ||
          u.proUpgradedAt ||
          matchedPayment?.createdAt ||
          "",
        cardBrand: matchedPayment?.cardBrand,
        cardLast4: matchedPayment?.cardLast4,
      });
    }

    for (let i = 0; i < payments.length; i++) {
      const p = payments[i];
      const emailRaw = String(
        p.technicianEmail || p.email || p.customerEmail || ""
      ).trim();
      const emailKey = emailRaw.toLowerCase();
      if (emailKey && seenEmails.has(emailKey)) continue;

      rows.push({
        id: String(p._id || p.id || p.transactionId || `pro-pay-${i}`),
        name: p.technicianName || "Technician",
        email: emailRaw || "—",
        planLabel:
          p.serviceTitle ||
          (p.planId === "pro_yearly"
            ? "FixLab Pro Yearly"
            : "FixLab Pro Monthly"),
        amount: Number(p.amount || 0),
        currency: (p.currency || "usd").toUpperCase(),
        transactionId: p.transactionId || p.stripePaymentIntentId || "—",
        paymentStatus: p.paymentStatus || "paid",
        date: p.paidAt || p.createdAt || "",
        cardBrand: p.cardBrand,
        cardLast4: p.cardLast4,
      });
    }

    const q = search.trim().toLowerCase();
    if (!q) return rows;

    return rows.filter(
      (r) =>
        r.name.toLowerCase().includes(q) ||
        r.email.toLowerCase().includes(q) ||
        r.planLabel.toLowerCase().includes(q) ||
        r.transactionId.toLowerCase().includes(q)
    );
  }, [payments, proUsers, search]);

  const totalRevenue = useMemo(
    () => mergedRows.reduce((sum, item) => sum + (item.amount || 0), 0),
    [mergedRows]
  );

  const handlePrintList = () => {
    window.print();
  };

  return (
    <div className="max-w-6xl mx-auto space-y-6 min-w-0">
      <div className="pro-print-area space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 bg-white rounded-2xl border border-slate-200/80 p-5 sm:p-6 shadow-xs">
          <div className="min-w-0">
            <div className="inline-flex items-center gap-2 rounded-full bg-[#ff5722]/10 text-[#ff5722] px-3 py-1 text-xs font-extrabold mb-2">
              <Crown className="w-3.5 h-3.5" />
              <span>Pro Subscriptions</span>
            </div>
            <h1 className="text-xl sm:text-2xl font-extrabold text-slate-900">
              Pro Technicians & Payments
            </h1>
            <p className="text-sm text-slate-500 mt-1">
              List of technicians who upgraded to FixLab Pro and their payment
              records.
            </p>
          </div>

          <button
            type="button"
            onClick={handlePrintList}
            className="no-print inline-flex items-center justify-center gap-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-white px-4 py-2.5 text-sm font-bold cursor-pointer transition shrink-0 w-full sm:w-auto"
          >
            <Printer className="w-4 h-4" />
            <span>Print List</span>
          </button>
        </div>

        {/* Summary Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="bg-white rounded-2xl border border-slate-200/80 p-5 shadow-xs">
            <p className="text-xs font-bold uppercase tracking-wider text-slate-500">
              Total Pro Members
            </p>
            <p className="text-2xl font-extrabold text-slate-900 mt-1">
              {mergedRows.length}
            </p>
          </div>

          <div className="bg-white rounded-2xl border border-slate-200/80 p-5 shadow-xs">
            <p className="text-xs font-bold uppercase tracking-wider text-slate-500">
              Total Pro Revenue
            </p>
            <p className="text-2xl font-extrabold text-emerald-700 mt-1">
              ${totalRevenue.toFixed(2)} USD
            </p>
          </div>
        </div>

        {/* Search & List */}
        <div className="bg-white rounded-2xl border border-slate-200/80 p-4 sm:p-6 shadow-xs space-y-4">
          <div className="no-print relative max-w-sm">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search by name, email, plan or Txn ID..."
              className="w-full pl-9 pr-4 py-2 rounded-xl border border-slate-200 text-sm focus:outline-none focus:border-[#ff5722]"
            />
          </div>

          {loading ? (
            <div className="py-12 text-center text-sm font-medium text-slate-500">
              Loading Pro members list...
            </div>
          ) : error ? (
            <div className="py-12 text-center text-sm font-semibold text-red-600">
              {error}
            </div>
          ) : mergedRows.length === 0 ? (
            <div className="py-12 text-center text-sm font-medium text-slate-500">
              No Pro technicians or payments found yet.
            </div>
          ) : (
            <>
              {/* Mobile Card View */}
              <div className="grid grid-cols-1 gap-3.5 md:hidden">
                {mergedRows.map((row, index) => (
                  <div
                    key={row.id}
                    className="rounded-2xl border border-slate-200/90 bg-slate-50/40 p-4 space-y-3"
                  >
                    <div className="flex items-start justify-between gap-2.5">
                      <div className="min-w-0">
                        <div className="flex items-center gap-1.5 flex-wrap">
                          <span className="text-xs font-extrabold text-slate-400">
                            #{index + 1}
                          </span>
                          <span className="font-bold text-sm text-slate-900 break-words">
                            {row.name}
                          </span>
                          <span className="inline-flex items-center gap-1 rounded-full bg-emerald-100 text-emerald-800 px-2 py-0.5 text-[10px] font-bold shrink-0">
                            <ShieldCheck className="w-3 h-3" />
                            Pro
                          </span>
                        </div>
                        <p className="text-xs text-slate-500 truncate mt-0.5">
                          {row.email}
                        </p>
                      </div>

                      <span className="text-sm font-extrabold text-emerald-700 whitespace-nowrap shrink-0">
                        ${row.amount.toFixed(2)} {row.currency}
                      </span>
                    </div>

                    <div className="space-y-1.5 pt-2.5 border-t border-slate-200/70 text-xs">
                      <div className="flex items-center justify-between gap-2">
                        <span className="font-semibold text-slate-500">
                          Plan
                        </span>
                        <span className="font-bold text-slate-800 text-right">
                          {row.planLabel}
                        </span>
                      </div>

                      <div className="flex items-center justify-between gap-2">
                        <span className="inline-flex items-center gap-1 font-semibold text-slate-500 shrink-0">
                          <Hash className="w-3 h-3 text-slate-400" />
                          Txn ID
                        </span>
                        <span className="font-mono text-[11px] text-slate-700 truncate max-w-[190px]">
                          {row.transactionId}
                        </span>
                      </div>

                      <div className="flex items-center justify-between gap-2">
                        <span className="inline-flex items-center gap-1 font-semibold text-slate-500 shrink-0">
                          <Calendar className="w-3 h-3 text-slate-400" />
                          Date
                        </span>
                        <span className="font-medium text-slate-600">
                          {formatDateLabel(row.date)}
                        </span>
                      </div>
                    </div>

                    <div className="pt-2 border-t border-slate-200/70 flex justify-end no-print">
                      <button
                        type="button"
                        onClick={() => setActiveReceipt(proRowToReceipt(row))}
                        className="w-full sm:w-auto inline-flex items-center justify-center gap-1.5 rounded-lg border border-slate-200 bg-white hover:bg-[#ff5722] hover:border-[#ff5722] hover:text-white text-slate-800 px-3 py-1.5 text-xs font-extrabold transition cursor-pointer"
                      >
                        <Printer className="w-3.5 h-3.5" />
                        <span>Print Receipt</span>
                      </button>
                    </div>
                  </div>
                ))}
              </div>

              {/* Desktop Table View */}
              <div className="hidden md:block overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="border-b border-slate-200 text-xs font-extrabold uppercase tracking-wider text-slate-500">
                      <th className="py-3 px-3">#</th>
                      <th className="py-3 px-3">Technician</th>
                      <th className="py-3 px-3">Plan</th>
                      <th className="py-3 px-3">Amount</th>
                      <th className="py-3 px-3">Transaction ID</th>
                      <th className="py-3 px-3">Date</th>
                      <th className="py-3 px-3 text-right no-print">Receipt</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 text-sm">
                    {mergedRows.map((row, index) => (
                      <tr key={row.id} className="hover:bg-slate-50/70">
                        <td className="py-3.5 px-3 font-semibold text-slate-500">
                          {index + 1}
                        </td>
                        <td className="py-3.5 px-3">
                          <div className="flex items-center gap-2">
                            <span className="font-bold text-slate-900">
                              {row.name}
                            </span>
                            <span className="inline-flex items-center gap-1 rounded-full bg-emerald-100 text-emerald-800 px-2 py-0.5 text-[10px] font-bold">
                              <ShieldCheck className="w-3 h-3" />
                              Pro
                            </span>
                          </div>
                          <p className="text-xs text-slate-500">{row.email}</p>
                        </td>
                        <td className="py-3.5 px-3 font-semibold text-slate-800">
                          {row.planLabel}
                        </td>
                        <td className="py-3.5 px-3 font-bold text-emerald-700">
                          ${row.amount.toFixed(2)} {row.currency}
                        </td>
                        <td className="py-3.5 px-3 font-mono text-xs text-slate-600">
                          {row.transactionId}
                        </td>
                        <td className="py-3.5 px-3 text-xs text-slate-500">
                          {formatDateLabel(row.date)}
                        </td>
                        <td className="py-3.5 px-3 text-right no-print">
                          <button
                            type="button"
                            onClick={() =>
                              setActiveReceipt(proRowToReceipt(row))
                            }
                            className="inline-flex items-center gap-1.5 rounded-lg border border-slate-200 bg-white hover:bg-[#ff5722] hover:border-[#ff5722] hover:text-white text-slate-800 px-3 py-1.5 text-xs font-extrabold transition cursor-pointer"
                          >
                            <Printer className="w-3.5 h-3.5" />
                            <span>Print Receipt</span>
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </>
          )}
        </div>
      </div>

      <ThermalReceiptModal
        receipt={activeReceipt}
        onClose={() => setActiveReceipt(null)}
      />
    </div>
  );
}