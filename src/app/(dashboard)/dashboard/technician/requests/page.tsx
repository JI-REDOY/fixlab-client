"use client";

import { toast } from "sonner";
import { Check, X, Play, CheckCircle, DollarSign } from "lucide-react";
import { useState } from "react";

const initialRequests = [
  { _id: "b1", customer: "Arpa", phone: "+880 1234", address: "Dhanmondi", date: "2024-10-20", problem: "Screen broken", service: "iPhone Screen Replacement", status: "requested", basePrice: 49 },
  { _id: "b2", customer: "Rahim", phone: "+880 5678", address: "Gulshan", date: "2024-10-18", problem: "Battery draining fast", service: "MacBook Battery", status: "accepted", basePrice: 89 },
  { _id: "b3", customer: "Sajid", phone: "+880 9012", address: "Mirpur", date: "2024-10-15", problem: "AC not cooling", service: "AC Servicing", status: "in-progress", basePrice: 35 },
];

export default function RequestsPage() {
  const [requests, setRequests] = useState(initialRequests);
  const [filter, setFilter] = useState("all");

  const updateStatus = (id: string, newStatus: string) => {
    setRequests(requests.map(r => r._id === id ? { ...r, status: newStatus } : r));
    toast.success(`Request ${newStatus}`);
  };

  const filteredRequests = filter === "all" 
    ? requests 
    : requests.filter(r => r.status === filter);

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-fixlab-charcoal">Manage Requests</h1>
          <p className="text-fixlab-gray text-sm">Review and update job statuses for incoming requests.</p>
        </div>
        
        {/* Status Filter */}
        <div className="flex gap-2 bg-white p-1 rounded-xl shadow-sm border border-gray-100 overflow-x-auto">
          {["all", "requested", "accepted", "in-progress", "completed"].map((s) => (
            <button
              key={s}
              onClick={() => setFilter(s)}
              className={`px-4 py-2 rounded-lg text-xs font-bold capitalize whitespace-nowrap transition-all ${
                filter === s ? "bg-fixlab-green text-white" : "text-fixlab-gray hover:bg-fixlab-cream"
              }`}
            >
              {s}
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
              {filteredRequests.length > 0 ? filteredRequests.map((req) => (
                <tr key={req._id} className="hover:bg-gray-50/50">
                  <td className="px-6 py-4">
                    <p className="font-bold text-sm text-fixlab-charcoal">{req.customer}</p>
                    <p className="text-xs text-fixlab-gray">{req.phone}</p>
                    <p className="text-xs text-fixlab-gray truncate max-w-[150px]">{req.address}</p>
                  </td>
                  <td className="px-6 py-4">
                    <p className="font-bold text-sm text-fixlab-charcoal">{req.service}</p>
                    <p className="text-xs text-fixlab-gray truncate max-w-[200px]">{req.problem}</p>
                  </td>
                  <td className="px-6 py-4 text-sm text-fixlab-gray">{req.date}</td>
                  <td className="px-6 py-4">
                    <span className={`px-3 py-1 text-xs font-bold rounded-full capitalize ${
                      req.status === "requested" ? "bg-blue-100 text-blue-700" :
                      req.status === "accepted" ? "bg-indigo-100 text-indigo-700" :
                      req.status === "in-progress" ? "bg-amber-100 text-amber-700" :
                      "bg-green-100 text-green-700"
                    }`}>
                      {req.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-right space-x-2">
                    {req.status === "requested" && (
                      <>
                        <button onClick={() => updateStatus(req._id, "accepted")} className="p-2 text-green-600 bg-green-50 hover:bg-green-100 rounded-lg transition-colors" title="Accept"><Check size={16} /></button>
                        <button onClick={() => updateStatus(req._id, "rejected")} className="p-2 text-red-600 bg-red-50 hover:bg-red-100 rounded-lg transition-colors" title="Reject"><X size={16} /></button>
                      </>
                    )}
                    {req.status === "accepted" && (
                      <button onClick={() => updateStatus(req._id, "in-progress")} className="px-3 py-1.5 text-xs font-bold text-white bg-amber-500 hover:bg-amber-600 rounded-lg flex items-center gap-1 ml-auto">
                        <Play size={14} /> Start Work
                      </button>
                    )}
                    {req.status === "in-progress" && (
                      <button onClick={() => toast.info("Final amount modal coming soon")} className="px-3 py-1.5 text-xs font-bold text-white bg-fixlab-green hover:bg-opacity-90 rounded-lg flex items-center gap-1 ml-auto">
                        <CheckCircle size={14} /> Mark Completed
                      </button>
                    )}
                    {req.status === "completed" && (
                      <span className="text-xs font-bold text-green-600 flex items-center justify-end gap-1">
                        <DollarSign size={14} /> Completed
                      </span>
                    )}
                  </td>
                </tr>
              )) : (
                <tr>
                  <td colSpan={5} className="px-6 py-10 text-center text-fixlab-gray">
                    No requests found for this filter.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}