"use client";

import { useState, useEffect } from "react";
import { fetchApi } from "@/lib/api";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";

export default function PaymentHistoryPage() {
  const [payments, setPayments] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // এখানে আপাতত ডামি ডেটা রাখছি, কারণ সার্ভারে customer payments API আলাদা করে বানানো হয়নি
    // তবে এটা পরে সার্ভার থেকে আসবে
    setLoading(false);
  }, []);

  if (loading) return <div className="flex justify-center py-20"><Loader2 className="animate-spin text-fixlab-green" size={40} /></div>;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-extrabold text-fixlab-charcoal">Payment History</h1>
        <p className="text-fixlab-gray text-sm">All your completed transactions.</p>
      </div>

      <div className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-fixlab-cream border-b border-gray-100">
                <th className="px-6 py-4 text-xs font-bold text-fixlab-gray uppercase">Transaction ID</th>
                <th className="px-6 py-4 text-xs font-bold text-fixlab-gray uppercase">Service</th>
                <th className="px-6 py-4 text-xs font-bold text-fixlab-gray uppercase">Technician</th>
                <th className="px-6 py-4 text-xs font-bold text-fixlab-gray uppercase">Amount</th>
                <th className="px-6 py-4 text-xs font-bold text-fixlab-gray uppercase">Date</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {payments.length === 0 && (
                <tr><td colSpan={5} className="text-center py-10 text-fixlab-gray">No payments yet.</td></tr>
              )}
              {payments.map((p) => (
                <tr key={p._id} className="hover:bg-gray-50/50">
                  <td className="px-6 py-4 text-sm font-mono text-fixlab-gray">{p.transactionId}</td>
                  <td className="px-6 py-4 text-sm font-bold text-fixlab-charcoal">{p.serviceTitle}</td>
                  <td className="px-6 py-4 text-sm text-fixlab-gray">{p.technicianName}</td>
                  <td className="px-6 py-4 text-sm font-bold text-fixlab-green">${p.amount}</td>
                  <td className="px-6 py-4 text-sm text-fixlab-gray">{new Date(p.paidAt).toLocaleDateString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}