"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { toast } from "@/components/ui/CustomToast";
import { XCircle, ArrowLeft, Sparkles } from "lucide-react";

export default function PaymentCancelPage() {
  const router = useRouter();
  const [countdown, setCountdown] = useState(3);
  const notifiedRef = useRef(false);

  useEffect(() => {
    if (!notifiedRef.current) {
      notifiedRef.current = true;
      toast.warning("Payment was cancelled.");
    }

    const interval = window.setInterval(() => {
      setCountdown((prev) => (prev > 1 ? prev - 1 : 0));
    }, 900);

    const timer = window.setTimeout(() => {
      router.replace("/dashboard/customer/bookings");
    }, 2500);

    return () => {
      clearInterval(interval);
      clearTimeout(timer);
    };
  }, [router]);

  return (
    <div className="min-h-screen flex items-center justify-center px-4 py-12 relative z-10">
      <div className="relative w-full max-w-md overflow-hidden rounded-[2rem] bg-white/20 backdrop-blur-md border border-white/85 ring-1 ring-slate-900/12 p-8 sm:p-10 text-center shadow-[14px_14px_30px_rgba(15,23,42,0.14),-10px_-10px_24px_rgba(255,255,255,0.92),inset_0_1px_0_rgba(255,255,255,0.85)]">
        <div className="absolute -right-12 -top-12 w-44 h-44 rounded-full bg-red-500/15 blur-2xl pointer-events-none" />

        <div className="relative z-10 flex flex-col items-center">
          <span className="inline-flex items-center gap-1.5 py-1 px-3.5 rounded-full bg-white/40 border border-white/90 text-red-600 font-extrabold tracking-wider uppercase text-[11px] mb-5 shadow-2xs">
            <Sparkles size={12} /> Checkout Cancelled
          </span>

          <div className="w-20 h-20 rounded-3xl bg-white/40 border border-white/90 ring-1 ring-red-500/25 flex items-center justify-center text-red-500 mb-5 shadow-[8px_8px_18px_rgba(15,23,42,0.1),-6px_-6px_14px_rgba(255,255,255,0.95)]">
            <XCircle size={40} />
          </div>

          <h1 className="text-2xl font-extrabold text-gray-900 tracking-tight">
            Payment <span className="text-red-600">Cancelled</span>
          </h1>

          <p className="text-sm font-medium text-gray-700 mt-2 leading-relaxed">
            You have cancelled the payment. No charges were made to your card.
          </p>

          <p className="mt-4 inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-white/40 border border-white/80 text-xs font-bold text-gray-700">
            Returning to bookings in{" "}
            <span className="font-extrabold text-[#ff5722]">
              {countdown}s
            </span>
            ...
          </p>

          <Link
            href="/dashboard/customer/bookings"
            className="mt-6 w-full inline-flex items-center justify-center gap-2 py-3.5 px-6 bg-gradient-to-r from-[#ff5722] to-[#ff6d3f] hover:from-[#e64a19] hover:to-[#ff5722] text-white text-xs sm:text-sm font-extrabold rounded-full shadow-[6px_6px_16px_rgba(255,87,34,0.34)] transition-all"
          >
            <ArrowLeft size={15} />
            <span>Back to My Bookings</span>
          </Link>
        </div>
      </div>
    </div>
  );
}