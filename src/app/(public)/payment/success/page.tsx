"use client";

import { useEffect, useState, useRef, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { toast } from "@/components/ui/CustomToast";
import Link from "next/link";
import {
  CheckCircle2,
  XCircle,
  Loader2,
  Sparkles,
  ArrowRight,
  CreditCard,
} from "lucide-react";
import { fetchApi, syncToken } from "@/lib/api";

function SuccessContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const session_id = searchParams.get("session_id");

  const [loading, setLoading] = useState(true);
  const [status, setStatus] = useState<"verifying" | "success" | "error">(
    "verifying"
  );
  const [errorMessage, setErrorMessage] = useState("");
  const [countdown, setCountdown] = useState(3);
  const verifiedSessionRef = useRef<string | null>(null);

  useEffect(() => {
    if (!session_id) {
      setStatus("error");
      setErrorMessage("Invalid or missing payment session ID.");
      setLoading(false);
      return;
    }

    if (verifiedSessionRef.current === session_id) return;
    verifiedSessionRef.current = session_id;

    let active = true;
    setLoading(true);
    setStatus("verifying");
    setErrorMessage("");
    setCountdown(3);

    const verify = async () => {
      try {
        await syncToken();
        await fetchApi(
          `/api/payments/verify?session_id=${encodeURIComponent(session_id)}`
        );
        if (!active) return;
        setStatus("success");
        toast.success("Payment verified & completed!");
      } catch (err: any) {
        if (!active) return;
        const msg = err?.message || "Payment verification failed.";
        setStatus("error");
        setErrorMessage(msg);
        toast.error(msg);
      } finally {
        if (active) setLoading(false);
      }
    };

    verify();

    return () => {
      active = false;
    };
  }, [session_id]);

  useEffect(() => {
    if (loading) return;

    const targetRoute =
      status === "success"
        ? "/dashboard/customer/payments"
        : "/dashboard/customer/bookings";

    const interval = window.setInterval(() => {
      setCountdown((prev) => (prev > 1 ? prev - 1 : 0));
    }, 900);

    const timer = window.setTimeout(() => {
      router.replace(targetRoute);
    }, 2500);

    return () => {
      clearInterval(interval);
      clearTimeout(timer);
    };
  }, [loading, status, router]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center px-4 py-12 relative z-10">
        <div className="relative overflow-hidden rounded-[2rem] bg-white/20 backdrop-blur-md border border-white/85 ring-1 ring-slate-900/12 px-8 py-9 text-center shadow-[14px_14px_30px_rgba(15,23,42,0.14),-10px_-10px_24px_rgba(255,255,255,0.92)]">
          <div className="w-16 h-16 rounded-2xl bg-white/30 border border-white/90 ring-1 ring-[#ff5722]/25 flex items-center justify-center text-[#ff5722] mx-auto mb-4 shadow-[6px_6px_14px_rgba(15,23,42,0.1),-5px_-5px_12px_rgba(255,255,255,0.95)]">
            <Loader2 size={32} className="animate-spin text-[#ff5722]" />
          </div>
          <p className="text-sm font-extrabold text-gray-900">
            Verifying your payment...
          </p>
          <p className="text-xs font-medium text-gray-600 mt-1">
            Please wait a moment while we confirm with Stripe.
          </p>
        </div>
      </div>
    );
  }

  const isSuccess = status === "success";
  const redirectPath = isSuccess
    ? "/dashboard/customer/payments"
    : "/dashboard/customer/bookings";

  return (
    <div className="min-h-screen flex items-center justify-center px-4 py-12 relative z-10">
      <div className="relative w-full max-w-md overflow-hidden rounded-[2rem] bg-white/20 backdrop-blur-md border border-white/85 ring-1 ring-slate-900/12 p-8 sm:p-10 text-center shadow-[14px_14px_30px_rgba(15,23,42,0.14),-10px_-10px_24px_rgba(255,255,255,0.92),inset_0_1px_0_rgba(255,255,255,0.85)]">
        <div
          className={`absolute -right-12 -top-12 w-44 h-44 rounded-full blur-2xl pointer-events-none ${
            isSuccess ? "bg-emerald-500/15" : "bg-red-500/15"
          }`}
        />

        <div className="relative z-10 flex flex-col items-center">
          <span
            className={`inline-flex items-center gap-1.5 py-1 px-3.5 rounded-full bg-white/40 border border-white/90 font-extrabold tracking-wider uppercase text-[11px] mb-5 shadow-2xs ${
              isSuccess ? "text-emerald-700" : "text-red-600"
            }`}
          >
            <Sparkles size={12} />
            {isSuccess ? "Payment Confirmed" : "Verification Failed"}
          </span>

          <div
            className={`w-20 h-20 rounded-3xl bg-white/40 border border-white/90 flex items-center justify-center mb-5 shadow-[8px_8px_18px_rgba(15,23,42,0.1),-6px_-6px_14px_rgba(255,255,255,0.95)] ${
              isSuccess
                ? "text-emerald-600 ring-1 ring-emerald-500/25"
                : "text-red-500 ring-1 ring-red-500/25"
            }`}
          >
            {isSuccess ? <CheckCircle2 size={40} /> : <XCircle size={40} />}
          </div>

          <h1 className="text-2xl font-extrabold text-gray-900 tracking-tight">
            {isSuccess ? (
              <>
                Payment <span className="text-emerald-600">Successful!</span>
              </>
            ) : (
              <>
                Payment <span className="text-red-600">Failed</span>
              </>
            )}
          </h1>

          <p className="text-sm font-medium text-gray-700 mt-2 leading-relaxed">
            {isSuccess
              ? "Your transaction has been verified and recorded."
              : errorMessage || "We could not confirm your payment."}
          </p>

          <p className="mt-4 inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-white/40 border border-white/80 text-xs font-bold text-gray-700">
            Redirecting in{" "}
            <span className="font-extrabold text-[#ff5722]">
              {countdown}s
            </span>
            ...
          </p>

          <div className="w-full flex flex-col sm:flex-row gap-2.5 mt-6">
            <Link
              href={redirectPath}
              className="flex-1 inline-flex items-center justify-center gap-2 py-3.5 px-5 bg-gradient-to-r from-[#ff5722] to-[#ff6d3f] hover:from-[#e64a19] hover:to-[#ff5722] text-white text-xs sm:text-sm font-extrabold rounded-full shadow-[6px_6px_16px_rgba(255,87,34,0.34)] transition-all"
            >
              {isSuccess ? (
                <>
                  <CreditCard size={15} />
                  <span>View Payments</span>
                </>
              ) : (
                <>
                  <span>Back to Bookings</span>
                  <ArrowRight size={15} />
                </>
              )}
            </Link>

            {isSuccess && (
              <Link
                href="/dashboard/customer/bookings"
                className="flex-1 inline-flex items-center justify-center gap-1.5 py-3.5 px-5 bg-white/50 hover:bg-white/80 border border-white/90 text-gray-900 text-xs sm:text-sm font-extrabold rounded-full transition-all"
              >
                <span>My Bookings</span>
              </Link>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default function PaymentSuccessPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen flex items-center justify-center">
          <Loader2 className="animate-spin text-[#ff5722]" size={42} />
        </div>
      }
    >
      <SuccessContent />
    </Suspense>
  );
}