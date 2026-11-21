"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import {
  User,
  Hash,
  Wrench,
  DollarSign,
  CreditCard,
  ArrowLeft,
  Loader2,
  Sparkles,
  CheckCircle2,
} from "lucide-react";
import { fetchApi } from "@/lib/api";
import { toast } from "@/components/ui/CustomToast";
import CardPaymentModal from "@/components/payment/CardPaymentModal";

interface BookingDetails {
  _id: string;
  serviceTitle?: string;
  technicianName?: string;
  technician?: { name?: string };
  finalAmount?: number;
  basePrice?: number;
  status?: string;
  paymentStatus?: string;
}

export default function BookingPaymentPage() {
  const params = useParams<{ bookingId: string }>();
  const router = useRouter();
  const bookingId = params?.bookingId || "";

  const [booking, setBooking] = useState<BookingDetails | null>(null);
  const [loading, setLoading] = useState(true);
  const [creatingIntent, setCreatingIntent] = useState(false);
  const [clientSecret, setClientSecret] = useState<string | null>(null);
  const [modalOpen, setModalOpen] = useState(false);

  useEffect(() => {
    if (!bookingId) {
      setLoading(false);
      return;
    }

    let active = true;
    setLoading(true);

    fetchApi("/api/bookings/my")
      .then((data) => {
        if (!active) return;
        const list = Array.isArray(data)
          ? data
          : Array.isArray(data?.bookings)
          ? data.bookings
          : Array.isArray(data?.data)
          ? data.data
          : [];
        const found = list.find(
          (item: BookingDetails) => String(item._id) === String(bookingId)
        );
        setBooking(found || null);
      })
      .catch((err: any) => {
        if (active) {
          toast.error(err?.message || "Failed to load booking details");
          setBooking(null);
        }
      })
      .finally(() => {
        if (active) setLoading(false);
      });

    return () => {
      active = false;
    };
  }, [bookingId]);

  const handleOpenCardModal = async () => {
    if (!booking?._id) return;
    setCreatingIntent(true);
    try {
      const res = await fetchApi("/api/payments/create-intent", {
        method: "POST",
        body: JSON.stringify({ bookingId: booking._id }),
      });

      if (!res?.clientSecret) {
        throw new Error("Payment intent could not be initialized");
      }

      setClientSecret(res.clientSecret);
      setModalOpen(true);
    } catch (err: any) {
      toast.error(err?.message || "Failed to start payment");
    } finally {
      setCreatingIntent(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-[65vh] flex items-center justify-center">
        <Loader2 className="animate-spin text-[#ff5722]" size={42} />
      </div>
    );
  }

  if (!booking) {
    return (
      <div className="max-w-lg mx-auto py-16 px-4 text-center space-y-4">
        <p className="text-base font-extrabold text-gray-900">
          Booking not found.
        </p>
        <Link
          href="/dashboard/customer/bookings"
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-[#ff5722] text-white text-xs font-extrabold"
        >
          <ArrowLeft size={14} /> Back to Bookings
        </Link>
      </div>
    );
  }

  const technicianName =
    booking.technicianName || booking.technician?.name || "Assigned Technician";
  const payableAmount = Number(booking.finalAmount ?? booking.basePrice ?? 0);
  const isPaid = booking.paymentStatus === "paid";
  const isCompleted = booking.status === "completed";

  return (
    <div className="max-w-2xl mx-auto space-y-6 relative z-10 min-w-0">
      <Link
        href="/dashboard/customer/bookings"
        className="inline-flex items-center gap-1.5 text-xs font-extrabold text-gray-700 hover:text-[#ff5722] transition-colors"
      >
        <ArrowLeft size={14} />
        <span>Back to My Bookings</span>
      </Link>

      <div className="relative overflow-hidden rounded-[2rem] bg-white/15 backdrop-blur-md border border-white/85 ring-1 ring-slate-900/12 p-5 sm:p-8 shadow-[14px_14px_30px_rgba(15,23,42,0.14),-10px_-10px_24px_rgba(255,255,255,0.92)] space-y-6">
        <div className="min-w-0">
          <span className="inline-flex items-center gap-1.5 py-1 px-3.5 rounded-full bg-white/25 border border-white/90 ring-1 ring-[#ff5722]/25 text-[#ff5722] font-extrabold tracking-wider uppercase text-[11px] mb-3">
            <Sparkles size={12} /> Checkout Summary
          </span>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-gray-900 tracking-tight">
            Complete <span className="text-[#ff5722]">Payment</span>
          </h1>
          <p className="text-xs sm:text-sm font-medium text-gray-700 mt-1">
            Review job & technician details before entering your card.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="rounded-2xl bg-white/25 border border-white/85 p-4 min-w-0">
            <p className="text-[11px] font-extrabold uppercase tracking-wider text-gray-500 flex items-center gap-1.5">
              <User size={13} className="text-[#ff5722] shrink-0" /> Technician
            </p>
            <p className="text-sm font-extrabold text-gray-900 mt-1 break-words">
              {technicianName}
            </p>
          </div>

          <div className="rounded-2xl bg-white/25 border border-white/85 p-4 min-w-0">
            <p className="text-[11px] font-extrabold uppercase tracking-wider text-gray-500 flex items-center gap-1.5">
              <Hash size={13} className="text-[#ff5722] shrink-0" /> Job / Booking ID
            </p>
            <p className="text-xs sm:text-sm font-mono font-extrabold text-gray-900 mt-1 break-all">
              {booking._id}
            </p>
          </div>

          <div className="rounded-2xl bg-white/25 border border-white/85 p-4 min-w-0">
            <p className="text-[11px] font-extrabold uppercase tracking-wider text-gray-500 flex items-center gap-1.5">
              <Wrench size={13} className="text-[#ff5722] shrink-0" /> Service
            </p>
            <p className="text-sm font-extrabold text-gray-900 mt-1 break-words">
              {booking.serviceTitle || "Repair Service"}
            </p>
          </div>

          <div className="rounded-2xl bg-white/25 border border-white/85 p-4 min-w-0">
            <p className="text-[11px] font-extrabold uppercase tracking-wider text-gray-500 flex items-center gap-1.5">
              <DollarSign size={13} className="text-[#ff5722] shrink-0" /> Amount Due
            </p>
            <p className="text-lg font-black text-[#ff5722] mt-0.5 break-words">
              ${payableAmount}
            </p>
          </div>
        </div>

        {isPaid ? (
          <div className="rounded-2xl bg-emerald-500/15 border border-emerald-500/30 p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div className="flex items-center gap-2.5 text-emerald-800 text-xs sm:text-sm font-extrabold">
              <CheckCircle2 size={18} className="shrink-0" />
              <span>This job is already paid.</span>
            </div>
            <Link
              href="/dashboard/customer/payments"
              className="px-4 py-2 rounded-full bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-extrabold text-center shrink-0 transition-colors"
            >
              View Receipts
            </Link>
          </div>
        ) : !isCompleted ? (
          <div className="rounded-2xl bg-amber-500/15 border border-amber-500/30 p-4 text-xs sm:text-sm font-bold text-amber-900">
            Payment unlocks once the technician marks this job as{" "}
            <span className="font-extrabold uppercase">completed</span>.
          </div>
        ) : (
          <button
            type="button"
            disabled={creatingIntent || payableAmount <= 0}
            onClick={handleOpenCardModal}
            className="w-full py-3.5 px-6 rounded-full bg-gradient-to-r from-[#ff5722] to-[#ff6d3f] hover:from-[#e64a19] hover:to-[#ff5722] text-white text-xs sm:text-sm font-extrabold shadow-[6px_6px_16px_rgba(255,87,34,0.34)] inline-flex items-center justify-center gap-2 transition-all cursor-pointer disabled:opacity-60"
          >
            {creatingIntent ? (
              <>
                <Loader2 size={16} className="animate-spin" />
                <span>Preparing Card Form...</span>
              </>
            ) : (
              <>
                <CreditCard size={16} />
                <span>Payment (${payableAmount})</span>
              </>
            )}
          </button>
        )}
      </div>

      <CardPaymentModal
        open={modalOpen}
        bookingId={booking._id}
        technicianName={technicianName}
        serviceTitle={booking.serviceTitle || "Repair Service"}
        amount={payableAmount}
        clientSecret={clientSecret}
        onClose={() => {
          setModalOpen(false);
          setClientSecret(null);
        }}
        onSuccess={() => {
          setModalOpen(false);
          setClientSecret(null);
          setBooking((prev) =>
            prev ? { ...prev, paymentStatus: "paid" } : prev
          );
          router.push("/dashboard/customer/payments");
        }}
      />
    </div>
  );
}