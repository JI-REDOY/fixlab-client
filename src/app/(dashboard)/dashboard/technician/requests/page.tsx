"use client";

import { toast } from "sonner";
import { Check, X, Play, CheckCircle, Loader2 } from "lucide-react";
import { useState, useEffect } from "react";
import { fetchApi } from "@/lib/api";

export default function RequestsPage() {
  const [requests, setRequests] = useState<any[]>([]);
  const [filter, setFilter] = useState("all");
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedBooking, setSelectedBooking] = useState<any>(null);
  const [finalAmount, setFinalAmount] = useState("");

  const fetchRequests = () => {
    fetchApi("/api/bookings/technician")
      .then((data) => setRequests(data))
      .catch((err) => toast.error(err.message))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchRequests();
  }, []);

  const updateStatus = async (id: string, newStatus: string, amount?: number) => {
    try {
      await fetchApi(`/api/bookings/${id}/status`, {
        method: "PATCH",
        body: JSON.stringify({ status: newStatus, finalAmount: amount }),
      });
      toast.success(`Request ${newStatus}`);
      fetchRequests();
      setModalOpen(false);
    } catch (err: any) {
      toast.error(err.message);
    }
  };

  const openCompleteModal = (booking: any) => {
    setSelectedBooking(booking);
    setFinalAmount(booking.basePrice.toString());
    setModalOpen(true);
  };

  const filteredRequests = filter === "all" ? requests : requests.filter(r => r.status === filter);

  if (loading) return <div className="flex justify-center py-20"><Loader2 className="animate-spin text-fixlab-green" size={40} /></div>;

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-fixlab-charcoal">Manage Requests</h1>
          <p className="text-fixlab-gray text-sm">Review and update job statuses for incoming requests.</p>
        </div>
        <div className="flex gap-2 bg-white p-1 rounded-xl shadow-sm border border-gray-100 overflow-x-auto">
          {["all", "requested", "accepted", "in-progress", "completed"].map((s) => (
            <button key={s} onClick={() => setFilter(s)} className={`px-4 py-2 rounded-lg text-xs font-bold capitalize whitespace-nowrap transition-all ${filter === s ? "bg-fixlab-green text-white" : "text-fixlab-gray hover:bg-fixlab-cream"}`}>
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
                <th className="px-6 py-4 text-xs font-bold text-fixlab-gray uppercase">Customer Info</th>
                <th className="px-6 py-4 text-xs font-bold text-fixlab-gray uppercase">Service & Problem</th>
                <th className="px-6 py-4 text-xs font-bold text-fixlab-gray uppercase">Date</th>
                <th className="px-6 py-4 text-xs font-bold text-fixlab-gray uppercase">Status</th>
                <th className="px-6 py-4 text-xs font-bold text-fixlab-gray uppercase text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {filteredRequests.length === 0 && (
                <tr><td colSpan={5} className="text-center py-10 text-fixlab-gray">No requests found.</td></tr>
              )}
              {filteredRequests.map((req) => (
                <tr key={req._id} className="hover:bg-gray-50/50">
                  <td className="px-6 py-4">
                    <p className="font-bold text-sm text-fixlab-charcoal">{req.customerName}</p>
                    <p className="text-xs text-fixlab-gray">{req.customerPhone}</p>
                    <p className="text-xs text-fixlab-gray truncate max-w-[150px]">{req.address}</p>
                  </td>
                  <td className="px-6 py-4">
                    <p className="font-bold text-sm text-fixlab-charcoal">{req.serviceTitle}</p>
                    <p className="text-xs text-fixlab-gray truncate max-w-[200px]">{req.problemDescription}</p>
                  </td>
                  <td className="px-6 py-4 text-sm text-fixlab-gray">{new Date(req.preferredDate).toLocaleDateString()}</td>
                  <td className="px-6 py-4">
                    <span className={`px-3 py-1 text-xs font-bold rounded-full capitalize ${
                      req.status === "requested" ? "bg-blue-100 text-blue-700" :
                      req.status === "accepted" ? "bg-indigo-100 text-indigo-700" :
                      req.status === "in-progress" ? "bg-amber-100 text-amber-700" :
                      "bg-green-100 text-green-700"
                    }`}>
                      {req.status.replace("-", " ")}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-right space-x-2">
                    {req.status === "requested" && (
                      <>
                        <button onClick={() => updateStatus(req._id, "accepted")} className="p-2 text-green-600 bg-green-50 hover:bg-green-100 rounded-lg transition-colors"><Check size={16} /></button>
                        <button onClick={() => updateStatus(req._id, "rejected")} className="p-2 text-red-600 bg-red-50 hover:bg-red-100 rounded-lg transition-colors"><X size={16} /></button>
                      </>
                    )}
                    {req.status === "accepted" && (
                      <button onClick={() => updateStatus(req._id, "in-progress")} className="px-3 py-1.5 text-xs font-bold text-white bg-amber-500 hover:bg-amber-600 rounded-lg flex items-center gap-1 ml-auto">
                        <Play size={14} /> Start Work
                      </button>
                    )}
                    {req.status === "in-progress" && (
                      <button onClick={() => openCompleteModal(req)} className="px-3 py-1.5 text-xs font-bold text-white bg-fixlab-green hover:bg-opacity-90 rounded-lg flex items-center gap-1 ml-auto">
                        <CheckCircle size={14} /> Complete
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Complete Modal */}
      {modalOpen && selectedBooking && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm">
          <div className="bg-white p-6 rounded-3xl shadow-xl w-full max-w-sm">
            <h3 className="text-lg font-bold text-fixlab-charcoal mb-4">Enter Final Amount</h3>
            <input
              type="number"
              min="1"
              value={finalAmount}
              onChange={(e) => setFinalAmount(e.target.value)}
              className="w-full px-4 py-3 rounded-xl bg-fixlab-cream mb-4 outline-none focus:ring-2 focus:ring-fixlab-green/20"
            />
            <div className="flex gap-2">
              <button onClick={() => setModalOpen(false)} className="flex-1 py-3 bg-gray-100 text-fixlab-charcoal font-bold rounded-xl hover:bg-gray-200">Cancel</button>
              <button onClick={() => updateStatus(selectedBooking._id, "completed", Number(finalAmount))} className="flex-1 py-3 bg-fixlab-green text-white font-bold rounded-xl hover:bg-opacity-90">Confirm</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}