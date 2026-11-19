"use client";

import { useState, useEffect } from "react";
import { fetchApi } from "@/lib/api";
import { Loader2 } from "lucide-react";

export default function AdminBookingsPage() {
  const [bookings, setBookings] = useState<any[]>([]);
  const [filter, setFilter] = useState("all");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchApi("/api/admin/bookings")
      .then((data) => setBookings(data))
      .catch((err) => console.error(err))
      .finally(() => setLoading(false));
  }, []);

  const filteredBookings = filter === "all" ? bookings : bookings.filter(b => b.status === filter);

  if (loading) return <div className="flex justify-center py-20"><Loader2 className="animate-spin text-fixlab-green" size={40} /></div>;

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-fixlab-charcoal">All Bookings</h1>
          <p className="text-fixlab-gray text-sm">Monitor every repair job across the platform.</p>
        </div>
        <div className="flex gap-2 bg-white p-1 rounded-xl shadow-sm border border-gray-100 overflow-x-auto">
          {["all", "requested", "accepted", "in-progress", "completed", "cancelled"].map((s) => (
            <button
              key={s}
              onClick={() => setFilter(s)}
              className={`px-4 py-2 rounded-lg text-xs font-bold capitalize whitespace-nowrap transition-all ${
                filter === s ? "bg-fixlab-green text-white" : "text-fixlab-gray hover:bg-fixlab-cream"
              }`}
            >
              {s.replace("-", " ")}
            </button>
          ))}
        </div>
      </div>

      <div className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-fixlab-cream border-b border-gray-100">
                <th className="px-6 py-4 text-xs font-bold text-fixlab-gray uppercase">Service</th>
                <th className="px-6 py-4 text-xs font-bold text-fixlab-gray uppercase">Customer</th>
                <th className="px-6 py-4 text-xs font-bold text-fixlab-gray uppercase">Technician</th>
                <th className="px-6 py-4 text-xs font-bold text-fixlab-gray uppercase">Date</th>
                <th className="px-6 py-4 text-xs font-bold text-fixlab-gray uppercase">Status</th>
                <th className="px-6 py-4 text-xs font-bold text-fixlab-gray uppercase">Amount</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {filteredBookings.length === 0 && (
                <tr><td colSpan={6} className="text-center py-10 text-fixlab-gray">No bookings found.</td></tr>
              )}
              {filteredBookings.map((b) => (
                <tr key={b._id} className="hover:bg-gray-50/50">
                  <td className="px-6 py-4 font-bold text-sm text-fixlab-charcoal">{b.serviceTitle}</td>
                  <td className="px-6 py-4 text-sm text-fixlab-gray">{b.customerName}</td>
                  <td className="px-6 py-4 text-sm text-fixlab-gray">{b.technicianName}</td>
                  <td className="px-6 py-4 text-sm text-fixlab-gray">{new Date(b.preferredDate).toLocaleDateString()}</td>
                  <td className="px-6 py-4">
                    <span className={`px-3 py-1 text-xs font-bold rounded-full capitalize ${
                      b.status === "completed" ? "bg-green-100 text-green-700" :
                      b.status === "in-progress" ? "bg-amber-100 text-amber-700" : 
                      b.status === "accepted" ? "bg-indigo-100 text-indigo-700" : 
                      "bg-blue-100 text-blue-700"
                    }`}>
                      {b.status.replace("-", " ")}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-sm font-bold text-fixlab-green">${b.finalAmount || b.basePrice}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}