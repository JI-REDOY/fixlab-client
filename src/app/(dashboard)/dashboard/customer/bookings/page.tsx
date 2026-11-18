"use client";

import Image from "next/image";
import { toast } from "sonner";
import { Clock, MapPin, CheckCircle, XCircle, CreditCard } from "lucide-react";

// ডামি ডেটা
const bookings = [
  { _id: "b1", title: "iPhone Screen Replacement", image: "https://images.unsplash.com/photo-1595152772835-219674b2a8a6?q=80&w=200", technician: "Rahim Uddin", date: "2024-10-20", status: "requested", paymentStatus: "unpaid", amount: 49 },
  { _id: "b2", title: "AC Servicing", image: "https://images.unsplash.com/photo-1621905251189-08b45d6a269e?q=80&w=200", technician: "Karim Ahmed", date: "2024-10-15", status: "completed", paymentStatus: "paid", amount: 35 },
];

const statusColors: Record<string, string> = {
  requested: "bg-blue-100 text-blue-700",
  accepted: "bg-indigo-100 text-indigo-700",
  "in-progress": "bg-amber-100 text-amber-700",
  completed: "bg-green-100 text-green-700",
  cancelled: "bg-gray-100 text-gray-700",
  rejected: "bg-red-100 text-red-700",
};

export default function MyBookingsPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-extrabold text-fixlab-charcoal">My Bookings</h1>
        <p className="text-fixlab-gray text-sm">Track and manage your repair requests.</p>
      </div>

      <div className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-fixlab-cream border-b border-gray-100">
                <th className="px-6 py-4 text-xs font-bold text-fixlab-gray uppercase tracking-wider">Service</th>
                <th className="px-6 py-4 text-xs font-bold text-fixlab-gray uppercase tracking-wider">Technician</th>
                <th className="px-6 py-4 text-xs font-bold text-fixlab-gray uppercase tracking-wider">Date</th>
                <th className="px-6 py-4 text-xs font-bold text-fixlab-gray uppercase tracking-wider">Status</th>
                <th className="px-6 py-4 text-xs font-bold text-fixlab-gray uppercase tracking-wider">Payment</th>
                <th className="px-6 py-4 text-xs font-bold text-fixlab-gray uppercase tracking-wider text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {bookings.map((booking) => (
                <tr key={booking._id} className="hover:bg-gray-50/50 transition-colors">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="relative w-12 h-12 rounded-xl overflow-hidden shrink-0">
                        <Image src={booking.image} alt={booking.title} fill className="object-cover" />
                      </div>
                      <div>
                        <p className="font-bold text-sm text-fixlab-charcoal line-clamp-1">{booking.title}</p>
                        <p className="text-xs text-fixlab-gray">${booking.amount}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-sm font-medium">{booking.technician}</td>
                  <td className="px-6 py-4 text-sm text-fixlab-gray">{booking.date}</td>
                  <td className="px-6 py-4">
                    <span className={`px-3 py-1 text-xs font-bold rounded-full capitalize ${statusColors[booking.status]}`}>
                      {booking.status.replace("-", " ")}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`px-3 py-1 text-xs font-bold rounded-full capitalize ${booking.paymentStatus === 'paid' ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-600'}`}>
                      {booking.paymentStatus}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-right">
                    {booking.status === "requested" && (
                      <button onClick={() => toast.success("Cancel modal coming soon")} className="px-4 py-2 text-xs font-bold text-red-500 bg-red-50 hover:bg-red-100 rounded-lg transition-colors">
                        Cancel
                      </button>
                    )}
                    {booking.status === "completed" && booking.paymentStatus === "unpaid" && (
                      <button onClick={() => toast.success("Stripe checkout coming soon")} className="px-4 py-2 text-xs font-bold text-white bg-fixlab-green hover:bg-opacity-90 rounded-lg transition-colors flex items-center gap-1 ml-auto">
                        <CreditCard size={14} /> Pay Now
                      </button>
                    )}
                    {booking.paymentStatus === "paid" && (
                      <span className="text-xs font-bold text-green-600 flex items-center justify-end gap-1">
                        <CheckCircle size={14} /> Paid
                      </span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}