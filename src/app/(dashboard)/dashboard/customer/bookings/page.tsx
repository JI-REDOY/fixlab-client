"use client";

import Image from "next/image";
import { toast } from "@/components/ui/CustomToast";
import Pagination from "@/components/ui/Pagination";
import CardPaymentModal from "@/components/payment/CardPaymentModal";
import ThermalReceiptModal, {
  ReceiptPayload,
} from "@/components/receipt/ThermalReceiptModal";
import { bookingToReceipt } from "@/components/receipt/receiptMapper";
import {
  CreditCard,
  Loader2,
  Star,
  Sparkles,
  Calendar,
  Wrench,
  UserCheck,
  X,
  Lock,
  Printer,
} from "lucide-react";
import { useState, useEffect, useCallback } from "react";
import { fetchApi } from "@/lib/api";

const PAGE_SIZE = 6;
const steps = ["requested", "accepted", "in-progress", "completed", "paid"];

interface BookingItem {
  _id: string;
  serviceTitle?: string;
  serviceImage?: string;
  technicianName?: string;
  technicianEmail?: string;
  customerName?: string;
  customerEmail?: string;
  customerPhone?: string;
  address?: string;
  preferredDate?: string;
  status: string;
  paymentStatus?: string;
  basePrice?: number | string;
  finalAmount?: number | string;
  rating?: number;
}

export default function MyBookingsPage() {
  const [bookings, setBookings] = useState<BookingItem[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [submittingReview, setSubmittingReview] = useState(false);
  const [cancellingId, setCancellingId] = useState<string | null>(null);
  const [bookingToCancel, setBookingToCancel] = useState<BookingItem | null>(
    null
  );

  // Thermal Receipt Modal State
  const [activeReceipt, setActiveReceipt] = useState<ReceiptPayload | null>(
    null
  );

  // Step 1: Summary Modal (Technician Name + Job ID + Amount)
  const [paymentSummaryBooking, setPaymentSummaryBooking] =
    useState<BookingItem | null>(null);
  const [creatingIntent, setCreatingIntent] = useState(false);

  // Step 2: Stripe Card Modal (Inside FixLab UI)
  const [cardModalOpen, setCardModalOpen] = useState(false);
  const [clientSecret, setClientSecret] = useState<string | null>(null);
  const [activePaymentBooking, setActivePaymentBooking] =
    useState<BookingItem | null>(null);
  const [customerBilling, setCustomerBilling] = useState<{
    name: string;
    email: string;
  }>({ name: "", email: "" });

  // Review Modal State
  const [reviewModalOpen, setReviewModalOpen] = useState(false);
  const [selectedBooking, setSelectedBooking] = useState<BookingItem | null>(
    null
  );
  const [rating, setRating] = useState(5);
  const [review, setReview] = useState("");

  const fetchBookings = useCallback((showSpinner = false) => {
    if (showSpinner) setLoading(true);
    fetchApi("/api/bookings/my")
      .then((data) => {
        const list = Array.isArray(data)
          ? data
          : Array.isArray(data?.bookings)
          ? data.bookings
          : Array.isArray(data?.data)
          ? data.data
          : [];
        setBookings(list);
      })
      .catch((err: any) => {
        toast.error(err?.message || "Failed to load bookings");
        setBookings([]);
      })
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    fetchBookings(true);
  }, [fetchBookings]);

  useEffect(() => {
    if (creatingIntent || submittingReview || cancellingId) return;
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        if (paymentSummaryBooking) setPaymentSummaryBooking(null);
        else if (bookingToCancel) setBookingToCancel(null);
        else if (reviewModalOpen) setReviewModalOpen(false);
      }
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [
    paymentSummaryBooking,
    bookingToCancel,
    reviewModalOpen,
    creatingIntent,
    submittingReview,
    cancellingId,
  ]);

  const confirmCancelBooking = async () => {
    if (!bookingToCancel?._id) return;
    setCancellingId(bookingToCancel._id);
    try {
      await fetchApi(`/api/bookings/${bookingToCancel._id}/cancel`, {
        method: "PATCH",
      });
      toast.success("Booking cancelled");
      setBookingToCancel(null);
      fetchBookings(false);
    } catch (err: any) {
      toast.error(err?.message || "Could not cancel booking");
    } finally {
      setCancellingId(null);
    }
  };

  const handlePayNow = (booking: BookingItem) => {
    setPaymentSummaryBooking(booking);
  };

  const handleProceedToCardModal = async () => {
    if (!paymentSummaryBooking?._id) return;
    setCreatingIntent(true);
    try {
      const data = await fetchApi("/api/payments/create-intent", {
        method: "POST",
        body: JSON.stringify({ bookingId: paymentSummaryBooking._id }),
      });

      if (!data?.clientSecret) {
        throw new Error("Could not initialize card payment");
      }

      setCustomerBilling({
        name: data?.customerName || paymentSummaryBooking.customerName || "",
        email: data?.customerEmail || paymentSummaryBooking.customerEmail || "",
      });
      setActivePaymentBooking(paymentSummaryBooking);
      setClientSecret(data.clientSecret);
      setPaymentSummaryBooking(null);
      setCardModalOpen(true);
    } catch (err: any) {
      toast.error(err?.message || "Failed to start payment");
    } finally {
      setCreatingIntent(false);
    }
  };

  const openReviewModal = (booking: BookingItem) => {
    setSelectedBooking(booking);
    setRating(5);
    setReview("");
    setReviewModalOpen(true);
  };

  const handleReviewSubmit = async () => {
    if (!selectedBooking?._id) return;
    setSubmittingReview(true);
    try {
      await fetchApi(`/api/bookings/${selectedBooking._id}/review`, {
        method: "PATCH",
        body: JSON.stringify({ rating, review }),
      });
      toast.success("Review submitted!");
      setReviewModalOpen(false);
      setSelectedBooking(null);
      fetchBookings(false);
    } catch (err: any) {
      toast.error(err?.message || "Failed to submit review");
    } finally {
      setSubmittingReview(false);
    }
  };

  const totalPages = Math.max(1, Math.ceil(bookings.length / PAGE_SIZE));
  const safePage = Math.min(currentPage, totalPages);
  const paginatedBookings = bookings.slice(
    (safePage - 1) * PAGE_SIZE,
    safePage * PAGE_SIZE
  );

  if (loading) {
    return (
      <div className="flex justify-center py-24">
        <Loader2 className="animate-spin text-[#ff5722]" size={42} />
      </div>
    );
  }

  const summaryAmount = Number(
    paymentSummaryBooking?.finalAmount ?? paymentSummaryBooking?.basePrice ?? 0
  );

  return (
    <div className="space-y-8 relative z-10">
      <div className="relative overflow-hidden rounded-[2rem] bg-transparent hover:bg-white/5 backdrop-blur-[1px] border border-white/85 ring-1 ring-slate-900/12 p-6 sm:p-8 shadow-[14px_14px_28px_rgba(15,23,42,0.13),-10px_-10px_24px_rgba(255,255,255,0.92),inset_0_1px_0_rgba(255,255,255,0.85)] transition-all duration-300">
        <div className="relative z-10 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <span className="inline-flex items-center gap-1.5 py-1 px-3.5 rounded-full bg-white/15 backdrop-blur-[1px] border border-white/90 ring-1 ring-[#ff5722]/25 text-[#ff5722] font-extrabold tracking-wider uppercase text-[11px] mb-3 shadow-[5px_5px_12px_rgba(15,23,42,0.09),-4px_-4px_10px_rgba(255,255,255,0.92)]">
              <Sparkles size={12} /> Repair Tracker
            </span>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-gray-900 tracking-tight">
              My <span className="text-[#ff5722]">Bookings</span>
            </h1>
            <p className="text-gray-700 text-sm font-medium mt-1">
              Track and manage your repair requests.
            </p>
          </div>

          <div className="px-5 py-3 rounded-2xl bg-white/10 backdrop-blur-[1px] border border-white/90 ring-1 ring-slate-900/12 shadow-[7px_7px_16px_rgba(15,23,42,0.1),-5px_-5px_12px_rgba(255,255,255,0.92)] self-start sm:self-center">
            <p className="text-[10px] font-extrabold uppercase tracking-wider text-gray-600">
              Total Bookings
            </p>
            <p className="text-lg font-extrabold text-gray-900 mt-0.5">
              {bookings.length}
            </p>
          </div>
        </div>
      </div>

      <div className="relative overflow-hidden bg-transparent backdrop-blur-[1px] rounded-[2rem] border border-white/85 ring-1 ring-slate-900/12 p-2 sm:p-4 shadow-[14px_14px_30px_rgba(15,23,42,0.14),-10px_-10px_24px_rgba(255,255,255,0.92),inset_0_1px_0_rgba(255,255,255,0.85)]">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-white/10 border-b border-white/80">
                <th className="px-6 py-4 text-[11px] font-extrabold text-gray-800 uppercase tracking-wider">
                  <span className="inline-flex items-center gap-1.5">
                    <Wrench size={13} className="text-[#ff5722]" />
                    Service
                  </span>
                </th>
                <th className="px-6 py-4 text-[11px] font-extrabold text-gray-800 uppercase tracking-wider">
                  <span className="inline-flex items-center gap-1.5">
                    <UserCheck size={13} className="text-[#ff5722]" />
                    Technician
                  </span>
                </th>
                <th className="px-6 py-4 text-[11px] font-extrabold text-gray-800 uppercase tracking-wider">
                  <span className="inline-flex items-center gap-1.5">
                    <Calendar size={13} className="text-[#ff5722]" />
                    Date
                  </span>
                </th>
                <th className="px-6 py-4 text-[11px] font-extrabold text-gray-800 uppercase tracking-wider">
                  Timeline
                </th>
                <th className="px-6 py-4 text-[11px] font-extrabold text-gray-800 uppercase tracking-wider text-right">
                  Action
                </th>
              </tr>
            </thead>

            <tbody className="divide-y divide-white/65">
              {paginatedBookings.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-6 py-16 text-center">
                    <div className="inline-flex flex-col items-center justify-center p-6 rounded-[1.75rem] bg-white/10 backdrop-blur-[1px] border border-white/85 ring-1 ring-slate-900/12 shadow-[10px_10px_22px_rgba(15,23,42,0.1),-8px_-8px_18px_rgba(255,255,255,0.92)]">
                      <div className="w-14 h-14 rounded-2xl bg-white/15 border border-white/90 ring-1 ring-[#ff5722]/25 flex items-center justify-center text-[#ff5722] mb-3 shadow-[5px_5px_12px_rgba(15,23,42,0.09),-4px_-4px_10px_rgba(255,255,255,0.92)]">
                        <Wrench size={24} />
                      </div>
                      <p className="text-sm font-extrabold text-gray-900">
                        No bookings found.
                      </p>
                      <p className="text-xs font-medium text-gray-700 mt-1">
                        Book a repair service to track its progress here.
                      </p>
                    </div>
                  </td>
                </tr>
              ) : (
                paginatedBookings.map((booking) => {
                  const isClosed = ["rejected", "cancelled"].includes(
                    booking.status
                  );
                  const currentStep = isClosed
                    ? -1
                    : booking.paymentStatus === "paid"
                    ? 4
                    : Math.max(0, steps.indexOf(booking.status));
                  const price = booking.finalAmount ?? booking.basePrice ?? 0;
                  const formattedDate = booking.preferredDate
                    ? new Date(booking.preferredDate).toLocaleDateString()
                    : "—";

                  const canPrintBookingReceipt = [
                    "accepted",
                    "in-progress",
                    "completed",
                  ].includes(booking.status);

                  return (
                    <tr
                      key={booking._id}
                      className="group hover:bg-white/10 transition-all duration-200"
                    >
                      <td className="px-6 py-3.5">
                        <div className="flex items-center gap-3.5">
                          <div className="relative w-12 h-12 rounded-2xl overflow-hidden shrink-0 border border-white/90 ring-1 ring-slate-900/12 bg-white/10 shadow-[5px_5px_12px_rgba(15,23,42,0.1),-4px_-4px_10px_rgba(255,255,255,0.92)]">
                            <Image
                              src={booking.serviceImage || "/icon-whiteTheme.png"}
                              alt={booking.serviceTitle || "Service"}
                              fill
                              sizes="48px"
                              className="object-cover"
                            />
                          </div>
                          <div className="min-w-0">
                            <p className="font-extrabold text-sm text-gray-900 group-hover:text-[#ff5722] transition-colors truncate max-w-[200px]">
                              {booking.serviceTitle || "Repair Service"}
                            </p>
                            <span className="inline-block mt-1 px-2.5 py-0.5 rounded-full bg-white/15 backdrop-blur-[1px] border border-white/90 ring-1 ring-[#ff5722]/25 text-xs font-extrabold text-[#ff5722] shadow-[3px_3px_8px_rgba(15,23,42,0.08),-3px_-3px_8px_rgba(255,255,255,0.92)]">
                              ${price}
                            </span>
                          </div>
                        </div>
                      </td>

                      <td className="px-6 py-3.5 text-sm font-bold text-gray-800 whitespace-nowrap">
                        <span className="px-3 py-1.5 rounded-xl bg-white/10 backdrop-blur-[1px] border border-white/85 ring-1 ring-slate-900/10 shadow-[4px_4px_10px_rgba(15,23,42,0.08),-4px_-4px_10px_rgba(255,255,255,0.92)]">
                          {booking.technicianName || "Verified Tech"}
                        </span>
                      </td>

                      <td className="px-6 py-3.5 text-sm font-semibold text-gray-800 whitespace-nowrap">
                        {formattedDate}
                      </td>

                      <td className="px-6 py-3.5">
                        <div className="inline-flex flex-col px-3.5 py-2 rounded-2xl bg-white/10 backdrop-blur-[1px] border border-white/85 ring-1 ring-slate-900/10 shadow-[inset_1px_1px_3px_rgba(15,23,42,0.08),4px_4px_10px_rgba(15,23,42,0.08),-4px_-4px_10px_rgba(255,255,255,0.92)]">
                          <div className="flex items-center gap-1">
                            {steps.map((step, idx) => (
                              <div key={step} className="flex items-center">
                                <div
                                  title={step.replace("-", " ")}
                                  className={`w-3 h-3 rounded-full transition-colors ${
                                    idx <= currentStep
                                      ? "bg-[#ff5722] shadow-[0_0_8px_rgba(255,87,34,0.5)]"
                                      : isClosed && idx === 0
                                      ? "bg-red-500"
                                      : "bg-slate-300/80"
                                  }`}
                                />
                                {idx < steps.length - 1 && (
                                  <div
                                    className={`w-5 sm:w-6 h-0.5 transition-colors ${
                                      idx < currentStep
                                        ? "bg-[#ff5722]"
                                        : "bg-slate-300/80"
                                    }`}
                                  />
                                )}
                              </div>
                            ))}
                          </div>
                          <p
                            className={`text-[11px] font-extrabold mt-1.5 capitalize ${
                              isClosed ? "text-red-600" : "text-gray-800"
                            }`}
                          >
                            {booking.paymentStatus === "paid"
                              ? "Paid & Completed"
                              : booking.status.replace("-", " ")}
                          </p>
                        </div>
                      </td>

                      <td className="px-6 py-3.5 text-right whitespace-nowrap">
                        <div className="inline-flex items-center justify-end gap-2">
                          {booking.status === "requested" && (
                            <button
                              type="button"
                              onClick={() => setBookingToCancel(booking)}
                              className="px-4 py-2 text-xs font-extrabold text-red-600 bg-white/15 hover:bg-red-500/15 backdrop-blur-[1px] border border-white/90 ring-1 ring-red-500/30 rounded-full shadow-[5px_5px_12px_rgba(15,23,42,0.09),-4px_-4px_10px_rgba(255,255,255,0.92)] transition-all cursor-pointer"
                            >
                              Cancel
                            </button>
                          )}

                          {canPrintBookingReceipt && (
                            <button
                              type="button"
                              onClick={() =>
                                setActiveReceipt(bookingToReceipt(booking))
                              }
                              className="px-3.5 py-2 text-xs font-extrabold text-gray-900 bg-white/25 hover:bg-white/45 backdrop-blur-[1px] border border-white/90 ring-1 ring-slate-900/15 rounded-full shadow-[5px_5px_12px_rgba(15,23,42,0.09),-4px_-4px_10px_rgba(255,255,255,0.92)] transition-all inline-flex items-center gap-1.5 cursor-pointer"
                            >
                              <Printer size={13} className="text-[#ff5722]" />
                              <span>Receipt</span>
                            </button>
                          )}

                          {booking.status === "completed" &&
                            booking.paymentStatus === "unpaid" && (
                              <button
                                type="button"
                                onClick={() => handlePayNow(booking)}
                                className="px-4 py-2 text-xs font-extrabold text-white bg-gradient-to-r from-[#ff5722] to-[#ff6d3f] hover:from-[#e64a19] hover:to-[#ff5722] rounded-full transition-all inline-flex items-center gap-1.5 shadow-[6px_6px_15px_rgba(255,87,34,0.34),-4px_-4px_10px_rgba(255,255,255,0.85)] cursor-pointer"
                              >
                                <CreditCard size={14} />
                                <span>Pay Now</span>
                              </button>
                            )}

                          {booking.paymentStatus === "paid" &&
                            !booking.rating && (
                              <button
                                type="button"
                                onClick={() => openReviewModal(booking)}
                                className="px-4 py-2 text-xs font-extrabold text-[#ff5722] bg-white/15 hover:bg-[#ff5722]/15 backdrop-blur-[1px] border border-white/90 ring-1 ring-[#ff5722]/35 rounded-full shadow-[5px_5px_12px_rgba(15,23,42,0.09),-4px_-4px_10px_rgba(255,255,255,0.92)] transition-all inline-flex items-center gap-1.5 cursor-pointer"
                              >
                                <Star size={14} />
                                <span>Rate Service</span>
                              </button>
                            )}

                          {booking.paymentStatus === "paid" &&
                            Boolean(booking.rating) && (
                              <div className="inline-flex items-center justify-end gap-1 px-3.5 py-1.5 rounded-full bg-white/15 backdrop-blur-[1px] border border-white/90 ring-1 ring-amber-500/30 shadow-[5px_5px_12px_rgba(15,23,42,0.09),-4px_-4px_10px_rgba(255,255,255,0.92)] text-xs font-extrabold text-amber-700">
                                <Star
                                  size={13}
                                  className="text-amber-500 fill-amber-500"
                                />
                                <span>{booking.rating}.0 / 5</span>
                              </div>
                            )}
                        </div>
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
            totalItems={bookings.length}
            pageSize={PAGE_SIZE}
            onPageChange={setCurrentPage}
            itemLabel="bookings"
          />
        </div>
      </div>

      {/* 50mm x 75mm Thermal Receipt Modal */}
      <ThermalReceiptModal
        receipt={activeReceipt}
        onClose={() => setActiveReceipt(null)}
      />

      {/* Job & Technician Summary Modal before Card Modal */}
      {paymentSummaryBooking && (
        <div
          onClick={() => {
            if (!creatingIntent) setPaymentSummaryBooking(null);
          }}
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/35 backdrop-blur-[2px] p-4"
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="relative w-full max-w-md rounded-[2rem] bg-white/85 backdrop-blur-xl border border-white ring-1 ring-slate-900/15 p-6 sm:p-7 shadow-[16px_16px_36px_rgba(15,23,42,0.22),-10px_-10px_24px_rgba(255,255,255,0.95)]"
          >
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="text-lg font-extrabold text-gray-900">
                  Job & <span className="text-[#ff5722]">Technician</span>
                </h3>
                <p className="text-xs font-medium text-gray-600">
                  Confirm details before opening card form
                </p>
              </div>
              <button
                type="button"
                disabled={creatingIntent}
                onClick={() => setPaymentSummaryBooking(null)}
                aria-label="Close modal"
                className="w-8 h-8 rounded-full bg-white/70 hover:bg-white text-gray-700 hover:text-[#ff5722] border border-white flex items-center justify-center transition-all cursor-pointer disabled:opacity-60"
              >
                <X size={16} />
              </button>
            </div>

            <div className="rounded-2xl bg-white/80 border border-white ring-1 ring-slate-900/10 p-4 space-y-2.5 text-xs">
              <div className="flex items-center justify-between">
                <span className="font-bold text-gray-500">Technician</span>
                <span className="font-extrabold text-gray-900">
                  {paymentSummaryBooking.technicianName || "Verified Tech"}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="font-bold text-gray-500">Job / Booking ID</span>
                <span className="font-mono font-bold text-gray-900">
                  {paymentSummaryBooking._id}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="font-bold text-gray-500">Service</span>
                <span className="font-extrabold text-gray-900 truncate max-w-[200px]">
                  {paymentSummaryBooking.serviceTitle || "Repair Service"}
                </span>
              </div>
              <div className="pt-2.5 border-t border-slate-200/80 flex items-center justify-between">
                <span className="font-extrabold text-gray-800">Total Amount</span>
                <span className="text-lg font-black text-[#ff5722]">
                  ${summaryAmount}
                </span>
              </div>
            </div>

            <div className="flex gap-2.5 mt-6">
              <button
                type="button"
                disabled={creatingIntent}
                onClick={() => setPaymentSummaryBooking(null)}
                className="flex-1 py-3 bg-white/70 hover:bg-white border border-white text-gray-800 text-xs sm:text-sm font-extrabold rounded-full transition-all cursor-pointer disabled:opacity-60"
              >
                Cancel
              </button>
              <button
                type="button"
                disabled={creatingIntent || summaryAmount <= 0}
                onClick={handleProceedToCardModal}
                className="flex-1 py-3 bg-gradient-to-r from-[#ff5722] to-[#ff6d3f] hover:from-[#e64a19] hover:to-[#ff5722] text-white text-xs sm:text-sm font-extrabold rounded-full shadow-[6px_6px_16px_rgba(255,87,34,0.34)] inline-flex items-center justify-center gap-2 transition-all cursor-pointer disabled:opacity-60"
              >
                {creatingIntent ? (
                  <>
                    <Loader2 size={15} className="animate-spin" />
                    <span>Loading...</span>
                  </>
                ) : (
                  <>
                    <Lock size={14} />
                    <span>Payment</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* In-App Stripe Card Modal */}
      <CardPaymentModal
        open={cardModalOpen}
        bookingId={activePaymentBooking?._id || ""}
        technicianName={activePaymentBooking?.technicianName || "Verified Tech"}
        serviceTitle={activePaymentBooking?.serviceTitle || "Repair Service"}
        amount={Number(
          activePaymentBooking?.finalAmount ??
            activePaymentBooking?.basePrice ??
            0
        )}
        customerName={customerBilling.name}
        customerEmail={customerBilling.email}
        clientSecret={clientSecret}
        onClose={() => {
          setCardModalOpen(false);
          setClientSecret(null);
        }}
        onSuccess={() => {
          setCardModalOpen(false);
          setClientSecret(null);
          setActivePaymentBooking(null);
          fetchBookings(false);
        }}
      />

      {/* Cancel Confirmation Modal */}
      {bookingToCancel && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 backdrop-blur-[2px] p-4">
          <div className="relative w-full max-w-sm rounded-[2rem] bg-white/85 backdrop-blur-xl border border-white ring-1 ring-slate-900/15 p-6 shadow-[16px_16px_34px_rgba(15,23,42,0.22),-10px_-10px_24px_rgba(255,255,255,0.92)]">
            <h3 className="text-lg font-extrabold text-gray-900">
              Cancel <span className="text-red-600">Booking?</span>
            </h3>
            <p className="text-xs font-medium text-gray-600 mt-1.5">
              Are you sure you want to cancel{" "}
              <span className="font-bold text-gray-900">
                {bookingToCancel.serviceTitle || "this service request"}
              </span>
              ?
            </p>

            <div className="flex gap-2.5 mt-6">
              <button
                type="button"
                disabled={Boolean(cancellingId)}
                onClick={() => setBookingToCancel(null)}
                className="flex-1 py-2.5 bg-white hover:bg-slate-50 border border-slate-200 text-gray-800 text-xs font-extrabold rounded-full transition-all cursor-pointer"
              >
                Keep It
              </button>
              <button
                type="button"
                disabled={Boolean(cancellingId)}
                onClick={confirmCancelBooking}
                className="flex-1 py-2.5 bg-red-600 hover:bg-red-700 text-white text-xs font-extrabold rounded-full shadow-xs transition-all inline-flex items-center justify-center gap-1.5 disabled:opacity-60 cursor-pointer"
              >
                {cancellingId ? (
                  <Loader2 size={14} className="animate-spin" />
                ) : null}
                <span>{cancellingId ? "Cancelling..." : "Yes, Cancel"}</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Review Modal */}
      {reviewModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 backdrop-blur-[2px] p-4">
          <div className="relative w-full max-w-md rounded-[2rem] bg-white/25 backdrop-blur-[4px] border border-white/90 ring-1 ring-slate-900/15 p-6 sm:p-7 shadow-[16px_16px_34px_rgba(15,23,42,0.22),-10px_-10px_24px_rgba(255,255,255,0.92),inset_0_1px_0_rgba(255,255,255,0.9)]">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-extrabold text-gray-900">
                Rate your <span className="text-[#ff5722]">experience</span>
              </h3>
              <button
                type="button"
                onClick={() => setReviewModalOpen(false)}
                aria-label="Close modal"
                className="p-2 rounded-full bg-white/20 border border-white/90 text-gray-700 hover:text-[#ff5722] shadow-[4px_4px_10px_rgba(15,23,42,0.09),-3px_-3px_8px_rgba(255,255,255,0.92)] transition-all cursor-pointer"
              >
                <X size={16} />
              </button>
            </div>

            {selectedBooking?.serviceTitle && (
              <p className="text-xs font-bold text-gray-700 mb-5">
                Service:{" "}
                <span className="text-gray-900">
                  {selectedBooking.serviceTitle}
                </span>
              </p>
            )}

            <div className="flex justify-center gap-2 mb-6 p-3 rounded-2xl bg-white/15 border border-white/85 shadow-[inset_1px_1px_3px_rgba(15,23,42,0.08)]">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  key={star}
                  type="button"
                  onClick={() => setRating(star)}
                  className="p-1 transition-transform hover:scale-110 cursor-pointer"
                >
                  <Star
                    size={30}
                    className={
                      star <= rating
                        ? "text-amber-400 fill-amber-400"
                        : "text-gray-300"
                    }
                  />
                </button>
              ))}
            </div>

            <textarea
              rows={3}
              placeholder="Write a short review..."
              value={review}
              onChange={(e) => setReview(e.target.value)}
              className="w-full px-4 py-3 bg-white/20 border border-white/90 ring-1 ring-slate-900/12 rounded-2xl outline-none focus:ring-2 focus:ring-[#ff5722]/35 focus:border-[#ff5722]/45 resize-none mb-5 text-sm font-medium text-gray-900 placeholder-gray-600 shadow-[inset_1px_1px_3px_rgba(15,23,42,0.07)]"
            />

            <div className="flex gap-2.5">
              <button
                type="button"
                onClick={() => setReviewModalOpen(false)}
                className="flex-1 py-3 bg-white/20 hover:bg-white/35 border border-white/90 text-gray-900 text-xs sm:text-sm font-extrabold rounded-full shadow-[5px_5px_12px_rgba(15,23,42,0.09),-4px_-4px_10px_rgba(255,255,255,0.92)] transition-all cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleReviewSubmit}
                disabled={submittingReview}
                className="flex-1 py-3 bg-gradient-to-r from-[#ff5722] to-[#ff6d3f] hover:from-[#e64a19] hover:to-[#ff5722] text-white text-xs sm:text-sm font-extrabold rounded-full shadow-[6px_6px_15px_rgba(255,87,34,0.34),-4px_-4px_10px_rgba(255,255,255,0.85)] transition-all disabled:opacity-60 cursor-pointer"
              >
                {submittingReview ? "Submitting..." : "Submit"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}