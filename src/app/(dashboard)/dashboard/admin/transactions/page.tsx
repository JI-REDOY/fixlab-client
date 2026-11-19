"use client";

import { useState, useEffect } from "react";
import { fetchApi } from "@/lib/api";
import { DollarSign, Loader2 } from "lucide-react";

export default function AdminTransactionsPage() {
  const [payments, setPayments] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchApi("/api/admin/payments")
      .then((data) => setPayments(data))
      .catch((err) => console.error(err))
      .finally(() => setLoading(false));
  }, []);

  const totalRevenue = payments.reduce((sum, p) => sum + p.amount, 0);

  if (loading) return <div className="flex justify-center py-20"><Loader2 className="animate-spin text-fixlab-green" size={40} /></div>;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-extrabold text-fixlab-charcoal">Transactions</h1>
        <p className="text-fixlab-gray text-sm">Every payment processed on the platform.</p>
      </div>

      <div className="bg-fixlab-green text-white p-6 rounded-3xl shadow-lg flex items-center gap-4 w-full sm:w-80">
        <div className="w-14 h-14 rounded-2xl bg-white/20 flex items-center justify-center">
          <DollarSign size={28} />
        </div>
        <div>
          <p className="text-sm font-medium text-fixlab-mint">Total Revenue</p>
          <p className="text-3xl font-extrabold">${totalRevenue}</p>
        </div>
      </div>

      <div className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-fixlab-cream border-b border-gray-100">
                <th className="px-6 py-4 text-xs font-bold text-fixlab-gray uppercase">Customer</th>
                <th className="px-6 py-4 text-xs font-bold text-fixlab-gray uppercase">Technician</th>
                <th className="px-6 py-4 text-xs font-bold text-fixlab-gray uppercase">Service</th>
                <th className="px-6 py-4 text-xs font-bold text-fixlab-gray uppercase">Txn ID</th>
                <th className="px-6 py-4 text-xs font-bold text-fixlab-gray uppercase">Amount</th>
                <th className="px-6 py-4 text-xs font-bold text-fixlab-gray uppercase">Date</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {payments.length === 0 && (
                <tr><td colSpan={6} className="text-center py-10 text-fixlab-gray">No transactions yet.</td></tr>
              )}
              {payments.map((t) => (
                <tr key={t._id} className="hover:bg-gray-50/50">
                  <td className="px-6 py-4 text-sm font-bold text-fixlab-charcoal">{t.customerName}</td>
                  <td className="px-6 py-4 text-sm text-fixlab-gray">{t.technicianName}</td>
                  <td className="px-6 py-4 text-sm text-fixlab-gray">{t.serviceTitle}</td>
                  <td className="px-6 py-4 text-sm font-mono text-fixlab-gray truncate max-w-[100px]">{t.transactionId}</td>
                  <td className="px-6 py-4 text-sm font-bold text-fixlab-green">${t.amount}</td>
                  <td className="px-6 py-4 text-sm text-fixlab-gray">{new Date(t.paidAt).toLocaleDateString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}