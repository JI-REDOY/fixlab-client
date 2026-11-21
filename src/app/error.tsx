"use client";

import { useEffect } from "react";
import Link from "next/link";
import { AlertTriangle, RotateCcw, Home, Sparkles } from "lucide-react";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error("Application error:", error);
  }, [error]);

  return (
    <div className="min-h-screen flex items-center justify-center px-4 py-12 relative z-10">
      <div className="relative w-full max-w-xl overflow-hidden rounded-[2rem] bg-white/15 hover:bg-white/20 backdrop-blur-md border border-white/85 ring-1 ring-slate-900/12 p-8 sm:p-10 text-center shadow-[14px_14px_30px_rgba(15,23,42,0.14),-10px_-10px_24px_rgba(255,255,255,0.92),inset_0_1px_0_rgba(255,255,255,0.85)] transition-all duration-300">
        {/* Soft Ambient Glow */}
        <div className="absolute -right-14 -top-14 w-48 h-48 rounded-full bg-[#ff5722]/15 blur-2xl pointer-events-none" />
        <div className="absolute -left-14 -bottom-14 w-48 h-48 rounded-full bg-red-500/10 blur-2xl pointer-events-none" />

        <div className="relative z-10 flex flex-col items-center">
          {/* Badge */}
          <span className="inline-flex items-center gap-1.5 py-1 px-3.5 rounded-full bg-white/25 border border-white/90 ring-1 ring-[#ff5722]/25 text-[#ff5722] font-extrabold tracking-wider uppercase text-[11px] mb-5 shadow-[5px_5px_12px_rgba(15,23,42,0.08),-4px_-4px_10px_rgba(255,255,255,0.92)]">
            <Sparkles size={12} /> Unexpected Error
          </span>

          {/* Icon Box */}
          <div className="w-20 h-20 rounded-3xl bg-white/25 border border-white/90 ring-1 ring-red-500/25 flex items-center justify-center text-red-500 mb-5 shadow-[8px_8px_18px_rgba(15,23,42,0.1),-6px_-6px_14px_rgba(255,255,255,0.95)]">
            <AlertTriangle size={38} />
          </div>

          <h1 className="text-2xl sm:text-3xl font-extrabold text-gray-900 tracking-tight">
            Oops! Something <span className="text-[#ff5722]">went wrong</span>
          </h1>

          <p className="text-sm font-medium text-gray-700 max-w-md mt-2 leading-relaxed">
            {error?.message ||
              "We couldn't load this page properly. Please try again or return to the home page."}
          </p>

          {error?.digest && (
            <p className="mt-2 text-[11px] font-mono font-semibold text-gray-500">
              Error ID: {error.digest}
            </p>
          )}

          {/* Actions */}
          <div className="flex flex-wrap items-center justify-center gap-3 mt-7">
            <button
              type="button"
              onClick={() => reset()}
              className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-gradient-to-r from-[#ff5722] to-[#ff6d3f] hover:from-[#e64a19] hover:to-[#ff5722] text-white text-xs sm:text-sm font-extrabold border border-[#ff5722]/40 shadow-[6px_6px_16px_rgba(255,87,34,0.34),-4px_-4px_10px_rgba(255,255,255,0.85)] transition-all cursor-pointer"
            >
              <RotateCcw size={15} />
              <span>Try Again</span>
            </button>

            <Link
              href="/"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-white/25 hover:bg-white/40 border border-white/90 ring-1 ring-slate-900/12 text-gray-900 text-xs sm:text-sm font-extrabold shadow-[6px_6px_14px_rgba(15,23,42,0.09),-4px_-4px_10px_rgba(255,255,255,0.92)] transition-all"
            >
              <Home size={15} />
              <span>Back to Home</span>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}