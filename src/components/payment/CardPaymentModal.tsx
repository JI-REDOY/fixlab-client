"use client";

import React, { useState, useEffect } from "react";
import { createPortal } from "react-dom";
import { loadStripe } from "@stripe/stripe-js";
import {
  Elements,
  PaymentElement,
  useStripe,
  useElements,
} from "@stripe/react-stripe-js";
import { X, Lock, ShieldCheck, Loader2, User, Mail } from "lucide-react";
import { toast } from "@/components/ui/CustomToast";
import { fetchApi } from "@/lib/api";

const publishableKey = process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY || "";
const stripePromise = publishableKey ? loadStripe(publishableKey) : null;

interface CheckoutFormProps {
  bookingId: string;
  technicianName: string;
  serviceTitle: string;
  amount: number;
  defaultCustomerName: string;
  defaultCustomerEmail: string;
  submitting: boolean;
  setSubmitting: React.Dispatch<React.SetStateAction<boolean>>;
  onSuccess: () => void;
  onClose: () => void;
}

function StripeCustomCheckoutForm({
  bookingId,
  technicianName,
  serviceTitle,
  amount,
  defaultCustomerName,
  defaultCustomerEmail,
  submitting,
  setSubmitting,
  onSuccess,
  onClose,
}: CheckoutFormProps) {
  const stripe = useStripe();
  const elements = useElements();

  const [billingName, setBillingName] = useState(defaultCustomerName);
  const [billingEmail, setBillingEmail] = useState(defaultCustomerEmail);

  useEffect(() => {
    setBillingName(defaultCustomerName);
  }, [defaultCustomerName]);

  useEffect(() => {
    setBillingEmail(defaultCustomerEmail);
  }, [defaultCustomerEmail]);

  const handlePay = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!stripe || !elements || submitting) return;

    setSubmitting(true);
    try {
      const { error, paymentIntent } = await stripe.confirmPayment({
        elements,
        confirmParams: {
          payment_method_data: {
            billing_details: {
              name: billingName.trim() || "Customer",
              email: billingEmail.trim() || undefined,
            },
          },
        },
        redirect: "if_required",
      });

      if (error) {
        toast.error(error.message || "Payment failed");
        setSubmitting(false);
        return;
      }

      if (paymentIntent?.status === "succeeded") {
        await fetchApi("/api/payments/confirm", {
          method: "POST",
          body: JSON.stringify({
            bookingId,
            paymentIntentId: paymentIntent.id,
          }),
        });

        toast.success(`Payment of $${amount} completed!`);
        setSubmitting(false);
        onSuccess();
      } else {
        setSubmitting(false);
      }
    } catch (err: any) {
      toast.error(err?.message || "Payment confirmation error");
      setSubmitting(false);
    }
  };

  return (
    <form onSubmit={handlePay} className="space-y-4">
      <div className="rounded-2xl bg-slate-50 border border-slate-200 p-3.5 space-y-1.5 text-xs">
        <div className="flex justify-between">
          <span className="font-semibold text-gray-500">Technician</span>
          <span className="font-extrabold text-gray-900">
            {technicianName || "Verified Tech"}
          </span>
        </div>
        <div className="flex justify-between">
          <span className="font-semibold text-gray-500">Job ID</span>
          <span className="font-mono font-bold text-gray-900">
            #{bookingId.slice(-8).toUpperCase()}
          </span>
        </div>
        <div className="flex justify-between">
          <span className="font-semibold text-gray-500">Service</span>
          <span className="font-bold text-gray-900 truncate max-w-[190px]">
            {serviceTitle || "Repair Service"}
          </span>
        </div>
        <div className="pt-1.5 border-t border-slate-200 flex items-center justify-between">
          <span className="font-extrabold text-gray-800">Total Amount</span>
          <span className="text-base font-black text-[#ff5722]">${amount}</span>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <div>
          <label className="flex items-center gap-1 text-[11px] font-extrabold text-gray-800 mb-1">
            <User size={12} className="text-[#ff5722]" />
            <span>Billing Name</span>
          </label>
          <input
            type="text"
            required
            disabled={submitting}
            value={billingName}
            onChange={(e) => setBillingName(e.target.value)}
            placeholder="Full name"
            className="w-full px-3.5 py-2 rounded-xl bg-slate-50 border border-slate-200 text-xs font-bold text-gray-900 outline-none focus:border-[#ff5722] focus:bg-white disabled:opacity-60"
          />
        </div>

        <div>
          <label className="flex items-center gap-1 text-[11px] font-extrabold text-gray-800 mb-1">
            <Mail size={12} className="text-[#ff5722]" />
            <span>Billing Email</span>
          </label>
          <input
            type="email"
            required
            disabled={submitting}
            value={billingEmail}
            onChange={(e) => setBillingEmail(e.target.value)}
            placeholder="email@example.com"
            className="w-full px-3.5 py-2 rounded-xl bg-slate-50 border border-slate-200 text-xs font-bold text-gray-900 outline-none focus:border-[#ff5722] focus:bg-white disabled:opacity-60"
          />
        </div>
      </div>

      <div className="rounded-2xl bg-slate-50 border border-slate-200 p-3.5 max-h-[240px] overflow-y-auto">
        <PaymentElement
          options={{
            layout: "tabs",
            fields: {
              billingDetails: {
                name: "never",
                email: "never",
              },
            },
          }}
        />
      </div>

      <div className="flex items-center gap-2 text-[11px] font-semibold text-gray-600">
        <ShieldCheck size={14} className="text-emerald-600 shrink-0" />
        <span>All Stripe fields & billing details sync to your receipt.</span>
      </div>

      <div className="flex gap-2.5 pt-1">
        <button
          type="button"
          disabled={submitting}
          onClick={onClose}
          className="flex-1 py-2.5 rounded-full bg-slate-100 hover:bg-slate-200 text-gray-800 text-xs font-extrabold cursor-pointer disabled:opacity-60"
        >
          Close
        </button>
        <button
          type="submit"
          disabled={!stripe || submitting}
          className="flex-1 py-2.5 rounded-full bg-gradient-to-r from-[#ff5722] to-[#ff6d3f] hover:from-[#e64a19] hover:to-[#ff5722] text-white text-xs font-extrabold shadow-[6px_6px_15px_rgba(255,87,34,0.34)] inline-flex items-center justify-center gap-1.5 cursor-pointer disabled:opacity-60"
        >
          {submitting ? (
            <>
              <Loader2 size={15} className="animate-spin" />
              <span>Processing...</span>
            </>
          ) : (
            <>
              <Lock size={14} />
              <span>Pay ${amount}</span>
            </>
          )}
        </button>
      </div>
    </form>
  );
}

export default function CardPaymentModal({
  open,
  bookingId,
  technicianName,
  serviceTitle,
  amount,
  customerName = "",
  customerEmail = "",
  clientSecret,
  onSuccess,
  onClose,
}: {
  open: boolean;
  bookingId: string;
  technicianName: string;
  serviceTitle: string;
  amount: number;
  customerName?: string;
  customerEmail?: string;
  clientSecret: string | null;
  onSuccess: () => void;
  onClose: () => void;
}) {
  const [mounted, setMounted] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!open || submitting) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [open, submitting, onClose]);

  if (!mounted || typeof document === "undefined" || !open || !clientSecret) {
    return null;
  }

  const safeClose = () => {
    if (!submitting) onClose();
  };

  return createPortal(
    <div
      onClick={safeClose}
      className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/50 p-4"
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="w-full max-w-lg rounded-[2rem] bg-white border border-slate-200 ring-1 ring-slate-900/15 p-5 sm:p-6 shadow-[0_24px_60px_rgba(15,23,42,0.35)]"
      >
        <div className="flex items-center justify-between mb-3">
          <div>
            <h3 className="text-base font-extrabold text-gray-900">
              Complete <span className="text-[#ff5722]">Payment</span>
            </h3>
            <p className="text-[11px] font-semibold text-gray-500">
              Stripe checkout inside your modal
            </p>
          </div>
          <button
            type="button"
            disabled={submitting}
            onClick={safeClose}
            aria-label="Close modal"
            className="w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 text-gray-700 flex items-center justify-center cursor-pointer disabled:opacity-60"
          >
            <X size={15} />
          </button>
        </div>

        {!stripePromise ? (
          <div className="rounded-2xl bg-red-50 border border-red-200 p-4 text-xs font-bold text-red-700">
            Stripe publishable key is missing (`NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY`).
          </div>
        ) : (
          <Elements
            key={clientSecret}
            stripe={stripePromise}
            options={{
              clientSecret,
              appearance: {
                theme: "stripe",
                variables: {
                  colorPrimary: "#ff5722",
                  borderRadius: "12px",
                },
              },
            }}
          >
            <StripeCustomCheckoutForm
              bookingId={bookingId}
              technicianName={technicianName}
              serviceTitle={serviceTitle}
              amount={amount}
              defaultCustomerName={customerName}
              defaultCustomerEmail={customerEmail}
              submitting={submitting}
              setSubmitting={setSubmitting}
              onSuccess={onSuccess}
              onClose={safeClose}
            />
          </Elements>
        )}
      </div>
    </div>,
    document.body
  );
}