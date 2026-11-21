"use client";

import React, { Suspense, useEffect, useState, useCallback } from "react";
import { createPortal } from "react-dom";
import { useSearchParams } from "next/navigation";
import { loadStripe } from "@stripe/stripe-js";
import {
  Elements,
  PaymentElement,
  useStripe,
  useElements,
} from "@stripe/react-stripe-js";
import {
  Check,
  Crown,
  ShieldCheck,
  Sparkles,
  Zap,
  X,
  Lock,
  Loader2,
  User,
  Mail,
  Timer,
} from "lucide-react";
import { toast } from "@/components/ui/CustomToast";
import { fetchApi } from "@/lib/api";

type PaidPlanId = "pro_monthly" | "pro_yearly";
type PlanId = "free" | PaidPlanId;

interface PlanItem {
  id: PlanId;
  name: string;
  priceLabel: string;
  amount: number;
  durationDays: number;
  periodLabel: string;
  billingNote: string;
  badge?: string;
  highlighted?: boolean;
  termsTitle: string;
  terms: string[];
  features: string[];
}

interface CountdownParts {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
  expired: boolean;
}

interface StoredProState {
  planId: string;
  proExpiresAt: string;
  proUpgradedAt?: string;
  email: string;
}

const PRO_STORAGE_KEY = "fixlab_pro_subscription";
const publishableKey = process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY || "";
const stripePromise = publishableKey ? loadStripe(publishableKey) : null;

const PLANS: PlanItem[] = [
  {
    id: "free",
    name: "Starter Free",
    priceLabel: "$0",
    amount: 0,
    durationDays: 0,
    periodLabel: "/ forever",
    billingNote: "No card required • Ideal for getting started",
    termsTitle: "Starter Terms",
    terms: [
      "Maximum 3 active or listed services allowed",
      "Standard listing order in customer search",
    ],
    features: [
      "Up to 3 active/listed services",
      "Standard booking request queue",
      "Pay-after-service Stripe flow",
      "Basic technician dashboard",
    ],
  },
  {
    id: "pro_monthly",
    name: "Pro Monthly",
    priceLabel: "$19",
    amount: 19,
    durationDays: 30,
    periodLabel: "/ month",
    billingNote: "30 days access • Countdown timer tracks expiry",
    badge: "Most Popular",
    highlighted: true,
    termsTitle: "Monthly Terms",
    terms: [
      "Active for 30 days from activation",
      "Verified Pro badge stays active until expiry",
    ],
    features: [
      "Unlimited services (removes 3-service limit)",
      "Verified Pro badge on profile & services",
      "Priority visibility in customer searches",
      "Subscription & earnings history tracking",
    ],
  },
  {
    id: "pro_yearly",
    name: "Pro Yearly",
    priceLabel: "$149",
    amount: 149,
    durationDays: 365,
    periodLabel: "/ year",
    billingNote: "365 days access • Save $79/yr (~35% off)",
    badge: "Best Value",
    termsTitle: "Yearly Terms",
    terms: [
      "Active for 365 days (12 months) from activation",
      "Locked-in yearly rate with full-year Verified Pro badge",
    ],
    features: [
      "Everything in Pro Monthly",
      "Unlimited services & top priority placement",
      "Verified Pro badge year-round for 12 months",
      "Dedicated support & faster insights",
    ],
  },
];

function normalizeEmail(email?: string | null): string {
  return String(email || "").trim().toLowerCase();
}

function readStoredPro(email?: string | null): StoredProState | null {
  const targetEmail = normalizeEmail(email);
  if (typeof window === "undefined" || !targetEmail) return null;

  try {
    const raw = localStorage.getItem(PRO_STORAGE_KEY);
    if (!raw) return null;
    const parsed: StoredProState = JSON.parse(raw);
    const storedEmail = normalizeEmail(parsed?.email);

    if (!parsed?.proExpiresAt || !storedEmail) return null;
    if (storedEmail !== targetEmail) return null;

    if (new Date(parsed.proExpiresAt).getTime() <= Date.now()) {
      localStorage.removeItem(PRO_STORAGE_KEY);
      return null;
    }

    return { ...parsed, email: storedEmail };
  } catch {
    return null;
  }
}

function writeStoredPro(state: StoredProState) {
  const normalized = normalizeEmail(state.email);
  if (typeof window === "undefined" || !normalized) return;

  try {
    localStorage.setItem(
      PRO_STORAGE_KEY,
      JSON.stringify({
        ...state,
        email: normalized,
      })
    );
  } catch {
    // Ignore storage quota errors
  }
}

function clearStoredProForEmail(email?: string | null) {
  const targetEmail = normalizeEmail(email);
  if (typeof window === "undefined") return;

  try {
    const raw = localStorage.getItem(PRO_STORAGE_KEY);
    if (!raw) return;
    if (!targetEmail) {
      localStorage.removeItem(PRO_STORAGE_KEY);
      return;
    }
    const parsed: StoredProState = JSON.parse(raw);
    if (normalizeEmail(parsed?.email) === targetEmail) {
      localStorage.removeItem(PRO_STORAGE_KEY);
    }
  } catch {
    // Ignore storage errors
  }
}

function getCountdownParts(expiresAtIso: string | null): CountdownParts {
  if (!expiresAtIso) {
    return { days: 0, hours: 0, minutes: 0, seconds: 0, expired: true };
  }

  const target = new Date(expiresAtIso).getTime();
  if (Number.isNaN(target)) {
    return { days: 0, hours: 0, minutes: 0, seconds: 0, expired: true };
  }

  const diff = target - Date.now();
  if (diff <= 0) {
    return { days: 0, hours: 0, minutes: 0, seconds: 0, expired: true };
  }

  const totalSeconds = Math.floor(diff / 1000);
  const days = Math.floor(totalSeconds / 86400);
  const hours = Math.floor((totalSeconds % 86400) / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = totalSeconds % 60;

  return { days, hours, minutes, seconds, expired: false };
}

function padTwo(num: number): string {
  return String(num).padStart(2, "0");
}

interface ProCheckoutFormProps {
  plan: PlanItem;
  paymentIntentId?: string;
  defaultName: string;
  defaultEmail: string;
  submitting: boolean;
  setSubmitting: React.Dispatch<React.SetStateAction<boolean>>;
  onSuccess: (payload?: {
    planId?: string;
    proExpiresAt?: string | null;
    proUpgradedAt?: string | null;
    billingEmail?: string;
  }) => void;
  onClose: () => void;
}

function ProStripeCheckoutForm({
  plan,
  paymentIntentId,
  defaultName,
  defaultEmail,
  submitting,
  setSubmitting,
  onSuccess,
  onClose,
}: ProCheckoutFormProps) {
  const stripe = useStripe();
  const elements = useElements();

  const [billingName, setBillingName] = useState(defaultName);
  const [billingEmail, setBillingEmail] = useState(defaultEmail);

  useEffect(() => {
    setBillingName(defaultName);
  }, [defaultName]);

  useEffect(() => {
    setBillingEmail(defaultEmail);
  }, [defaultEmail]);

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
              name: billingName.trim() || "Technician",
              email: billingEmail.trim() || undefined,
            },
          },
        },
        redirect: "if_required",
      });

      if (error) {
        toast.error(error.message || "Pro payment failed");
        setSubmitting(false);
        return;
      }

      if (paymentIntent?.status === "succeeded") {
        const resolvedEmail = billingEmail.trim() || defaultEmail || undefined;
        const verifyRes = await fetchApi("/api/payments/subscription/verify", {
          method: "POST",
          body: JSON.stringify({
            planId: plan.id,
            paymentIntentId: paymentIntent.id || paymentIntentId,
            billingName: billingName.trim() || "Technician",
            billingEmail: resolvedEmail,
          }),
        });

        toast.success(`${plan.name} activated! You are now Verified Pro.`);
        setSubmitting(false);
        onSuccess({
          planId: verifyRes?.proPlanId || plan.id,
          proExpiresAt: verifyRes?.proExpiresAt || null,
          proUpgradedAt: verifyRes?.proUpgradedAt || new Date().toISOString(),
          billingEmail: resolvedEmail,
        });
      } else {
        setSubmitting(false);
      }
    } catch (err: any) {
      toast.error(err?.message || "Failed to activate Pro plan");
      setSubmitting(false);
    }
  };

  return (
    <form onSubmit={handlePay} className="space-y-4">
      <div className="rounded-2xl bg-slate-50 border border-slate-200 p-3.5 space-y-1.5 text-xs">
        <div className="flex justify-between">
          <span className="font-semibold text-gray-500">Selected Plan</span>
          <span className="font-extrabold text-gray-900">{plan.name}</span>
        </div>
        <div className="flex justify-between gap-2">
          <span className="font-semibold text-gray-500 shrink-0">
            Billing Cycle
          </span>
          <span className="font-bold text-gray-900 text-right">
            {plan.billingNote}
          </span>
        </div>
        <div className="flex justify-between">
          <span className="font-semibold text-gray-500">Service Cap</span>
          <span className="font-bold text-emerald-700">
            Unlimited + Verified Pro Badge
          </span>
        </div>
        <div className="pt-1.5 border-t border-slate-200 flex items-center justify-between">
          <span className="font-extrabold text-gray-800">Total Due Today</span>
          <span className="text-base font-black text-[#ff5722]">
            ${plan.amount}
          </span>
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
        <span>
          Secured by Stripe. Instant Verified Pro activation upon payment.
        </span>
      </div>

      <div className="flex gap-2.5 pt-1">
        <button
          type="button"
          disabled={submitting}
          onClick={onClose}
          className="flex-1 py-2.5 rounded-full bg-slate-100 hover:bg-slate-200 text-gray-800 text-xs font-extrabold transition-colors cursor-pointer disabled:opacity-60"
        >
          Close
        </button>
        <button
          type="submit"
          disabled={!stripe || submitting}
          className="flex-1 py-2.5 rounded-full bg-gradient-to-r from-[#ff5722] to-[#ff6d3f] hover:from-[#e64a19] hover:to-[#ff5722] text-white text-xs font-extrabold shadow-[6px_6px_15px_rgba(255,87,34,0.34)] inline-flex items-center justify-center gap-1.5 transition-all cursor-pointer disabled:opacity-60"
        >
          {submitting ? (
            <>
              <Loader2 size={15} className="animate-spin" />
              <span>Processing...</span>
            </>
          ) : (
            <>
              <Lock size={14} />
              <span>Pay ${plan.amount}</span>
            </>
          )}
        </button>
      </div>
    </form>
  );
}

function TechnicianProPlansContent() {
  const searchParams = useSearchParams();

  const [mounted, setMounted] = useState(false);
  const [loadingPlan, setLoadingPlan] = useState<PlanId | null>(null);
  const [submittingPayment, setSubmittingPayment] = useState(false);
  const [message, setMessage] = useState<string | null>(null);

  const [techName, setTechName] = useState("");
  const [techEmail, setTechEmail] = useState("");
  const [currentPlan, setCurrentPlan] = useState<"free" | "pro">("free");
  const [activePlanId, setActivePlanId] = useState<string | null>(null);
  const [proExpiresAt, setProExpiresAt] = useState<string | null>(null);
  const [countdown, setCountdown] = useState<CountdownParts>({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
    expired: true,
  });

  const [checkoutModal, setCheckoutModal] = useState<{
    open: boolean;
    plan: PlanItem | null;
    clientSecret: string | null;
    paymentIntentId?: string;
  }>({
    open: false,
    plan: null,
    clientSecret: null,
  });

  const loadTechProfile = useCallback(async () => {
    setCurrentPlan("free");
    setActivePlanId(null);
    setProExpiresAt(null);

    let resolvedEmail = "";
    try {
      const data = await fetchApi("/api/auth/me");
      const u = data?.user || data?.data || data;
      if (u) {
        resolvedEmail = normalizeEmail(u.email);
        setTechName(u.name || "");
        setTechEmail(u.email || "");

        const rawPro =
          String(u.plan || "").toLowerCase() === "pro" ||
          Boolean(u.isVerifiedPro);
        const planCode = u.proPlanId || "pro_monthly";
        const days = planCode === "pro_yearly" ? 365 : 30;
        const baseTime = u.proUpgradedAt
          ? new Date(u.proUpgradedAt).getTime()
          : Date.now();
        const computedExpiry =
          u.proExpiresAt ||
          (rawPro
            ? new Date(baseTime + days * 24 * 60 * 60 * 1000).toISOString()
            : null);

        if (
          rawPro &&
          computedExpiry &&
          new Date(computedExpiry).getTime() > Date.now()
        ) {
          setCurrentPlan("pro");
          setActivePlanId(planCode);
          setProExpiresAt(computedExpiry);
          if (resolvedEmail) {
            writeStoredPro({
              planId: planCode,
              proExpiresAt: computedExpiry,
              proUpgradedAt: u.proUpgradedAt || new Date().toISOString(),
              email: resolvedEmail,
            });
          }
          return;
        }

        clearStoredProForEmail(resolvedEmail);
        return;
      }
    } catch {
      // Fallback to email-matched stored Pro state if API is unreachable
    }

    if (resolvedEmail) {
      const stored = readStoredPro(resolvedEmail);
      if (stored) {
        setCurrentPlan("pro");
        setActivePlanId(stored.planId || "pro_monthly");
        setProExpiresAt(stored.proExpiresAt);
      }
    }
  }, []);

  useEffect(() => {
    setMounted(true);
    loadTechProfile();
  }, [loadTechProfile]);

  useEffect(() => {
    if (!proExpiresAt) {
      setCountdown({
        days: 0,
        hours: 0,
        minutes: 0,
        seconds: 0,
        expired: true,
      });
      return;
    }

    const updateTick = () => {
      const parts = getCountdownParts(proExpiresAt);
      setCountdown(parts);
      if (parts.expired) {
        setCurrentPlan("free");
        setActivePlanId(null);
        setProExpiresAt(null);
        clearStoredProForEmail(techEmail);
      }
    };

    updateTick();
    const timer = setInterval(updateTick, 1000);
    return () => clearInterval(timer);
  }, [proExpiresAt, techEmail]);

  useEffect(() => {
    const canceled = searchParams.get("canceled");
    if (canceled === "true") {
      setMessage("Payment was canceled. Your plan was not changed.");
    }
  }, [searchParams]);

  useEffect(() => {
    if (!checkoutModal.open || submittingPayment) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setCheckoutModal({ open: false, plan: null, clientSecret: null });
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [checkoutModal.open, submittingPayment]);

  const isProActive = currentPlan === "pro" && !countdown.expired;

  const handleSelectPlan = async (plan: PlanItem) => {
    setMessage(null);

    if (plan.id === "free") {
      setMessage(
        isProActive
          ? "You currently have an active Pro subscription. Starter Free caps listings at 3 services."
          : "Starter Free allows up to 3 active/listed services at $0/month."
      );
      return;
    }

    if (isProActive) {
      setMessage(
        "Your Pro plan is already active. Countdown timer above shows your remaining subscription time."
      );
      return;
    }

    try {
      setLoadingPlan(plan.id);
      const data = await fetchApi("/api/payments/subscription/checkout", {
        method: "POST",
        body: JSON.stringify({ planId: plan.id }),
      });

      if (data?.clientSecret) {
        setCheckoutModal({
          open: true,
          plan,
          clientSecret: data.clientSecret,
          paymentIntentId: data.paymentIntentId,
        });
      } else {
        setMessage("Checkout initialized, but clientSecret was missing.");
      }
    } catch (err: any) {
      setMessage(
        err?.message ||
          "Failed to initialize Pro checkout. Make sure you are signed in as a technician."
      );
    } finally {
      setLoadingPlan(null);
    }
  };

  const closeCheckoutModal = () => {
    if (!submittingPayment) {
      setCheckoutModal({ open: false, plan: null, clientSecret: null });
    }
  };

  const handlePaymentSuccess = (payload?: {
    planId?: string;
    proExpiresAt?: string | null;
    proUpgradedAt?: string | null;
    billingEmail?: string;
  }) => {
    const chosenPlan =
      payload?.planId || checkoutModal.plan?.id || "pro_monthly";
    const days = chosenPlan === "pro_yearly" ? 365 : 30;
    const resolvedExpiry =
      payload?.proExpiresAt ||
      new Date(Date.now() + days * 24 * 60 * 60 * 1000).toISOString();
    const resolvedEmail = normalizeEmail(payload?.billingEmail || techEmail);

    setCurrentPlan("pro");
    setActivePlanId(chosenPlan);
    setProExpiresAt(resolvedExpiry);
    setCheckoutModal({ open: false, plan: null, clientSecret: null });
    setMessage(
      "Pro plan activated! Your subscription countdown timer is now live at the top."
    );

    if (resolvedEmail) {
      writeStoredPro({
        planId: chosenPlan,
        proExpiresAt: resolvedExpiry,
        proUpgradedAt: payload?.proUpgradedAt || new Date().toISOString(),
        email: resolvedEmail,
      });
    }
  };

  const formattedExpiry = proExpiresAt
    ? new Date(proExpiresAt).toLocaleString(undefined, {
        dateStyle: "medium",
        timeStyle: "short",
      })
    : null;

  return (
    <div className="max-w-6xl mx-auto py-3 px-3 sm:px-4 space-y-3">
      {isProActive && proExpiresAt && (
        <div className="rounded-2xl bg-white border border-[#ff5722]/30 px-4 py-3 shadow-xs flex flex-col md:flex-row md:items-center md:justify-between gap-3">
          <div className="flex flex-wrap items-center gap-x-3 gap-y-1">
            <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-700 px-2.5 py-0.5 text-[10px] font-extrabold uppercase tracking-wider">
              <Timer size={12} />
              <span>
                {activePlanId === "pro_yearly"
                  ? "Pro Yearly (365d)"
                  : "Pro Monthly (30d)"}
              </span>
            </span>
            <h2 className="text-sm sm:text-base font-extrabold text-gray-900">
              Subscription Ends In
            </h2>
            <span className="text-xs font-medium text-gray-500">
- Expires:{" "}
              <strong className="font-bold text-gray-800">
                {formattedExpiry}
              </strong>
            </span>
          </div>

          <div className="grid grid-cols-4 gap-1.5 sm:gap-2 shrink-0">
            {[
              { label: "Days", value: padTwo(countdown.days) },
              { label: "Hrs", value: padTwo(countdown.hours) },
              { label: "Min", value: padTwo(countdown.minutes) },
              { label: "Sec", value: padTwo(countdown.seconds) },
            ].map((unit) => (
              <div
                key={unit.label}
                className="min-w-[54px] sm:min-w-[60px] rounded-xl bg-slate-50 border border-slate-200 px-2 py-1.5 text-center"
              >
                <p className="text-sm sm:text-base font-black text-[#ff5722] tabular-nums leading-tight">
                  {unit.value}
                </p>
                <p className="text-[9px] font-extrabold uppercase tracking-wider text-gray-500">
                  {unit.label}
                </p>
              </div>
            ))}
          </div>
        </div>
      )}

      <div className="text-center max-w-2xl mx-auto">
        <div className="inline-flex items-center gap-1.5 rounded-full bg-[#ff5722]/10 text-[#ff5722] px-3 py-0.5 text-[11px] font-bold mb-1.5">
          <Crown className="w-3.5 h-3.5" />
          <span>Technician Pro Plans</span>
        </div>
        <h1 className="text-xl sm:text-2xl font-extrabold text-slate-900 leading-tight">
          Choose the Right Plan for Your Repair Business
        </h1>
        <p className="text-xs sm:text-[13px] text-slate-600 mt-1">
          Starter Free is capped at 3 services. Upgrade to Monthly ($19/mo) or
          Yearly ($149/yr) for unlimited services and a Verified Pro badge.
        </p>
      </div>

      {message && (
        <div className="rounded-xl border border-amber-200 bg-amber-50 px-3.5 py-2 text-xs font-semibold text-amber-900 text-center">
          {message}
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {PLANS.map((plan) => {
          const isLoading = loadingPlan === plan.id;
          const isPaidPlan = plan.id !== "free";
          const isCurrentActivePlan =
            isPaidPlan && isProActive && activePlanId === plan.id;
          const isButtonDisabled = isLoading || (isPaidPlan && isProActive);

          return (
            <div
              key={plan.id}
              className={`rounded-2xl p-4 sm:p-5 flex flex-col justify-between border transition ${
                isCurrentActivePlan
                  ? "border-emerald-500 bg-white shadow-md ring-1 ring-emerald-500/25"
                  : plan.highlighted
                  ? "border-[#ff5722] bg-white shadow-md ring-1 ring-[#ff5722]/25"
                  : "border-slate-200 bg-white shadow-2xs"
              }`}
            >
              <div>
                <div className="flex items-center justify-between gap-2 mb-1.5">
                  <h2 className="text-base font-bold text-slate-900">
                    {plan.name}
                  </h2>
                  {isCurrentActivePlan ? (
                    <span className="rounded-full bg-emerald-100 text-emerald-700 px-2.5 py-0.5 text-[11px] font-extrabold">
                      Active Plan
                    </span>
                  ) : (
                    plan.badge && (
                      <span className="rounded-full bg-[#ff5722]/12 text-[#ff5722] px-2.5 py-0.5 text-[11px] font-bold">
                        {plan.badge}
                      </span>
                    )
                  )}
                </div>

                <div className="mb-1 flex items-baseline gap-1">
                  <span className="text-2xl sm:text-3xl font-extrabold text-slate-900">
                    {plan.priceLabel}
                  </span>
                  <span className="text-xs font-bold text-slate-500">
                    {plan.periodLabel}
                  </span>
                </div>
                <p className="text-[11px] text-slate-500 mb-3">
                  {plan.billingNote}
                </p>

                <div className="rounded-xl bg-slate-50 border border-slate-200/80 px-3 py-2 mb-3">
                  <p className="text-[10px] font-extrabold uppercase tracking-wider text-slate-700 mb-1">
                    {plan.termsTitle}
                  </p>
                  <ul className="space-y-0.5">
                    {plan.terms.map((t, tIdx) => (
                      <li
                        key={tIdx}
                        className="text-[11px] font-medium text-slate-600 leading-snug"
                      >
- {t}
                      </li>
                    ))}
                  </ul>
                </div>

                <ul className="space-y-1.5 mb-4">
                  {plan.features.map((feat, idx) => (
                    <li
                      key={idx}
                      className="flex items-start gap-2 text-xs text-slate-700 leading-snug"
                    >
                      <Check className="w-3.5 h-3.5 text-emerald-600 shrink-0 mt-0.5" />
                      <span>{feat}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <button
                type="button"
                disabled={isButtonDisabled}
                onClick={() => handleSelectPlan(plan)}
                className={`w-full flex items-center justify-center gap-2 rounded-xl py-2 px-3.5 text-xs sm:text-sm font-semibold transition ${
                  isPaidPlan && isProActive
                    ? "bg-emerald-600 text-white cursor-not-allowed opacity-85"
                    : plan.id === "free"
                    ? "border border-slate-300 text-slate-700 hover:bg-slate-50 cursor-pointer disabled:opacity-60"
                    : "bg-[#ff5722] text-white hover:bg-[#e64a19] cursor-pointer disabled:opacity-60"
                }`}
              >
                {isLoading ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : isPaidPlan && isProActive ? (
                  <Check className="w-4 h-4" />
                ) : plan.id === "free" ? (
                  <ShieldCheck className="w-4 h-4" />
                ) : plan.id === "pro_monthly" ? (
                  <Sparkles className="w-4 h-4" />
                ) : (
                  <Zap className="w-4 h-4" />
                )}
                <span>
                  {isLoading
                    ? "Preparing Checkout..."
                    : isCurrentActivePlan
                    ? "Active Plan"
                    : isPaidPlan && isProActive
                    ? "Pro Already Active"
                    : plan.id === "free"
                    ? "Starter Plan (Max 3 Services)"
                    : `Pay ${plan.priceLabel} • ${plan.name}`}
                </span>
              </button>
            </div>
          );
        })}
      </div>

      {mounted &&
        typeof document !== "undefined" &&
        checkoutModal.open &&
        checkoutModal.plan &&
        checkoutModal.clientSecret &&
        createPortal(
          <div
            onClick={closeCheckoutModal}
            className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/50 p-4"
          >
            <div
              onClick={(e) => e.stopPropagation()}
              className="w-full max-w-lg rounded-[2rem] bg-white border border-slate-200 ring-1 ring-slate-900/15 p-5 sm:p-6 shadow-[0_24px_60px_rgba(15,23,42,0.35)]"
            >
              <div className="flex items-center justify-between mb-3">
                <div>
                  <h3 className="text-base font-extrabold text-gray-900">
                    Upgrade to <span className="text-[#ff5722]">Pro</span>
                  </h3>
                  <p className="text-[11px] font-semibold text-gray-500">
                    Stripe checkout inside your modal
                  </p>
                </div>
                <button
                  type="button"
                  disabled={submittingPayment}
                  onClick={closeCheckoutModal}
                  aria-label="Close modal"
                  className="w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 text-gray-700 hover:text-[#ff5722] flex items-center justify-center transition-colors cursor-pointer disabled:opacity-60"
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
                  key={checkoutModal.clientSecret}
                  stripe={stripePromise}
                  options={{
                    clientSecret: checkoutModal.clientSecret,
                    appearance: {
                      theme: "stripe",
                      variables: {
                        colorPrimary: "#ff5722",
                        borderRadius: "12px",
                      },
                    },
                  }}
                >
                  <ProStripeCheckoutForm
                    plan={checkoutModal.plan}
                    paymentIntentId={checkoutModal.paymentIntentId}
                    defaultName={techName}
                    defaultEmail={techEmail}
                    submitting={submittingPayment}
                    setSubmitting={setSubmittingPayment}
                    onSuccess={handlePaymentSuccess}
                    onClose={closeCheckoutModal}
                  />
                </Elements>
              )}
            </div>
          </div>,
          document.body
        )}
    </div>
  );
}

export default function TechnicianProPlansPage() {
  return (
    <Suspense
      fallback={
        <div className="max-w-6xl mx-auto py-12 px-4 text-center text-sm font-medium text-slate-600">
          Loading Pro plans...
        </div>
      }
    >
      <TechnicianProPlansContent />
    </Suspense>
  );
}