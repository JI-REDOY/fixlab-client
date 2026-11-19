"use client";

import Image from "next/image";
import { toast } from "sonner";
import { CheckCircle, CreditCard, Loader2, Star } from "lucide-react";
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

const steps = ["requested", "accepted", "in-progress", "completed", "paid"];

export default function MyBookingsPage() {
  const [bookings, setBookings] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [processingId, setProcessingId] = useState<string | null>(null);
  
  // Review Modal State
  const [reviewModalOpen, setReviewModalOpen] = useState(false);
  const [selectedBooking, setSelectedBooking] = useState<any>(null);
  const [rating, setRating] = useState(5);
  const [review, setReview] = useState("");

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
      window.location.href = data.url;
    } catch (err: any) {
      toast.error(err.message);
      setProcessingId(null);
    }
  };

  const handleReviewSubmit = async () => {
    try {
      await fetchApi(`/api/bookings/${selectedBooking._id}/review`, {
        method: "PATCH",
        body: JSON.stringify({ rating, review }),
      });
      toast.success("Review submitted!");
      setReviewModalOpen(false);
      fetchBookings();
    } catch (err: any) {
      toast.error(err.message);
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
                <th className="px-6 py-4 text-xs font-bold text-fixlab-gray uppercase">Timeline</th>
                <th className="px-6 py-4 text-xs font-bold text-fixlab-gray uppercase text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {bookings.length === 0 && (
                <tr><td colSpan={5} className="text-center py-10 text-fixlab-gray">No bookings found. Book a service now!</td></tr>
              )}
              {bookings.map((booking) => {
                const currentStep = booking.paymentStatus === 'paid' ? 4 : steps.indexOf(booking.status);
                return (
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
                    
                    {/* Timeline */}
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-1">
                        {steps.map((step, idx) => (
                          <div key={step} className="flex items-center">
                            <div className={`w-3 h-3 rounded-full ${idx <= currentStep ? 'bg-fixlab-green' : 'bg-gray-200'}`} />
                            {idx < steps.length - 1 && <div className={`w-6 h-0.5 ${idx < currentStep ? 'bg-fixlab-green' : 'bg-gray-200'}`} />}
                          </div>
                        ))}
                      </div>
                      <p className="text-xs text-fixlab-gray mt-1 capitalize">{booking.status.replace("-", " ")}</p>
                    </td>

                    <td className="px-6 py-4 text-right">
                      {booking.status === "requested" && (
                        <button onClick={() => handleCancel(booking._id)} className="px-4 py-2 text-xs font-bold text-red-500 bg-red-50 hover:bg-red-100 rounded-lg transition-colors">
                          Cancel
                        </button>
                      )}
                      {booking.status === "completed" && booking.paymentStatus === "unpaid" && (
                        <button onClick={() => handlePayNow(booking._id)} disabled={processingId === booking._id} className="px-4 py-2 text-xs font-bold text-white bg-fixlab-green hover:bg-opacity-90 rounded-lg transition-colors flex items-center gap-1 ml-auto disabled:opacity-70">
                          {processingId === booking._id ? <Loader2 className="animate-spin" size={14} /> : <CreditCard size={14} />} Pay Now
                        </button>
                      )}
                      {booking.paymentStatus === "paid" && !booking.rating && (
                        <button onClick={() => { setSelectedBooking(booking); setReviewModalOpen(true); }} className="px-4 py-2 text-xs font-bold text-fixlab-green bg-fixlab-mint/30 hover:bg-fixlab-mint/50 rounded-lg transition-colors flex items-center gap-1 ml-auto">
                          <Star size={14} /> Rate Service
                        </button>
                      )}
                      {booking.paymentStatus === "paid" && booking.rating && (
                        <div className="flex items-center justify-end gap-1 text-xs font-bold text-green-600">
                          <Star size={14} fill="currentColor" /> {booking.rating}.0 / 5
                        </div>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Review Modal */}
      {reviewModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4">
          <div className="bg-white p-6 rounded-3xl shadow-xl w-full max-w-md">
            <h3 className="text-lg font-bold text-fixlab-charcoal mb-4">Rate your experience</h3>
            <div className="flex justify-center gap-2 mb-6">
              {[1, 2, 3, 4, 5].map((star) => (
                <button key={star} onClick={() => setRating(star)}>
                  <Star size={32} className={star <= rating ? "text-amber-400 fill-amber-400" : "text-gray-300"} />
                </button>
              ))}
            </div>
            <textarea
              rows={3}
              placeholder="Write a short review..."
              value={review}
              onChange={(e) => setReview(e.target.value)}
              className="w-full px-4 py-3 bg-fixlab-cream rounded-xl outline-none focus:ring-2 focus:ring-fixlab-green/20 resize-none mb-4"
            />
            <div className="flex gap-2">
              <button onClick={() => setReviewModalOpen(false)} className="flex-1 py-3 bg-gray-100 text-fixlab-charcoal font-bold rounded-xl hover:bg-gray-200">Cancel</button>
              <button onClick={handleReviewSubmit} className="flex-1 py-3 bg-fixlab-green text-white font-bold rounded-xl hover:bg-opacity-90">Submit</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}