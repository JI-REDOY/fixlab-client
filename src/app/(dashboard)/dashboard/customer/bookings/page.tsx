"use client";

import Image from "next/image";
import { toast } from "sonner";
import { CheckCircle, CreditCard, Loader2 } from "lucide-react";
import { useState, useEffect } from "react";
import { fetchApi } from "@/lib/api";

const statusColors: Record<string, string> = {
  requested: "bg-blue-100 text-blue-700",
  accepted: "bg-indigo-100 text-indigo-700",
  "in-progress": "bg-amber-100 text-amber-700",
  completed: "bg-green-100 text-green-700",
  cancelled: "bg-gray-100 text-gray-700",
  rejected: "bg-red-100 text-red-700",
};

export default function MyBookingsPage() {
  const [bookings, setBookings] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [processingId, setProcessingId] = useState<string | null>(null);

  const fetchBookings = () => {
    fetchApi("/api/bookings/my")
      .then((data) => setBookings(data))
      .catch((err) => toast.error(err.message))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchBookings();
  }, []);

  const handleCancel = async (id: string) => {
    if (!confirm("Are you sure you want to cancel this request?")) return;
    try {
      await fetchApi(`/api/bookings/${id}/cancel`, { method: "PATCH" });
      toast.success("Booking cancelled");
      fetchBookings();
    } catch (err: any) {
      toast.error(err.message);
    }
  };

  const handlePayNow = async (bookingId: string) => {
    setProcessingId(bookingId);
    try {
      const data = await fetchApi("/api/payments/create-checkout-session", {
        method: "POST",
        body: JSON.stringify({ bookingId }),
      });
      window.location.href = data.url; // Stripe Checkout এ রিডাইরেক্ট
    } catch (err: any) {
      toast.error(err.message);
      setProcessingId(null);
    }
  };

  if (loading) return <div className="flex justify-center py-20"><Loader2 className="animate-spin text-fixlab-green" size={40} /></div>;

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
                <th className="px-6 py-4 text-xs font-bold text-fixlab-gray uppercase">Service</th>
                <th className="px-6 py-4 text-xs font-bold text-fixlab-gray uppercase">Technician</th>
                <th className="px-6 py-4 text-xs font-bold text-fixlab-gray uppercase">Date</th>
                <th className="px-6 py-4 text-xs font-bold text-fixlab-gray uppercase">Status</th>
                <th className="px-6 py-4 text-xs font-bold text-fixlab-gray uppercase">Payment</th>
                <th className="px-6 py-4 text-xs font-bold text-fixlab-gray uppercase text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {bookings.length === 0 && (
                <tr><td colSpan={6} className="text-center py-10 text-fixlab-gray">No bookings found. Book a service now!</td></tr>
              )}
              {bookings.map((booking) => (
                <tr key={booking._id} className="hover:bg-gray-50/50 transition-colors">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="relative w-12 h-12 rounded-xl overflow-hidden shrink-0">
                        <Image src={booking.serviceImage} alt={booking.serviceTitle} fill sizes="48px" className="object-cover" />
                      </div>
                      <div>
                        <p className="font-bold text-sm text-fixlab-charcoal line-clamp-1">{booking.serviceTitle}</p>
                        <p className="text-xs text-fixlab-gray">${booking.finalAmount || booking.basePrice}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-sm font-medium">{booking.technicianName}</td>
                  <td className="px-6 py-4 text-sm text-fixlab-gray">{new Date(booking.preferredDate).toLocaleDateString()}</td>
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
                      <button onClick={() => handleCancel(booking._id)} className="px-4 py-2 text-xs font-bold text-red-500 bg-red-50 hover:bg-red-100 rounded-lg transition-colors">
                        Cancel
                      </button>
                    )}
                    {booking.status === "completed" && booking.paymentStatus === "unpaid" && (
                      <button 
                        onClick={() => handlePayNow(booking._id)} 
                        disabled={processingId === booking._id}
                        className="px-4 py-2 text-xs font-bold text-white bg-fixlab-green hover:bg-opacity-90 rounded-lg transition-colors flex items-center gap-1 ml-auto disabled:opacity-70"
                      >
                        {processingId === booking._id ? <Loader2 className="animate-spin" size={14} /> : <CreditCard size={14} />}
                        Pay Now
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