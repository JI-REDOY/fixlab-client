import { Loader2, Sparkles } from "lucide-react";

export default function Loading() {
  return (
    <div className="min-h-screen flex items-center justify-center px-4 py-12 relative z-10 overflow-hidden">
      {/* Subtle Ambient Accent Orbs */}
      <div className="absolute w-72 h-72 rounded-full bg-[#ff5722]/10 blur-3xl -translate-x-16 -translate-y-12 pointer-events-none" />
      <div className="absolute w-64 h-64 rounded-full bg-amber-400/10 blur-3xl translate-x-16 translate-y-12 pointer-events-none" />

      <div className="relative overflow-hidden rounded-[2.25rem] bg-white/12 hover:bg-white/18 backdrop-blur-[2px] border border-white/85 ring-1 ring-slate-900/12 px-8 sm:px-10 py-9 text-center shadow-[16px_16px_34px_rgba(15,23,42,0.14),-10px_-10px_24px_rgba(255,255,255,0.92),inset_0_1px_0_rgba(255,255,255,0.9)] transition-all duration-300 max-w-xs w-full">
        {/* Top Highlight Sheen */}
        <div className="absolute inset-x-6 top-0 h-[1px] bg-gradient-to-r from-transparent via-white to-transparent pointer-events-none" />

        <div className="relative z-10 flex flex-col items-center gap-4">
          {/* Layered Premium Spinner */}
          <div className="relative flex items-center justify-center">
            <span className="absolute w-20 h-20 rounded-3xl border border-[#ff5722]/25 animate-ping [animation-duration:2.2s] pointer-events-none" />
            <span className="absolute w-18 h-18 rounded-2xl border border-dashed border-[#ff5722]/40 animate-spin [animation-duration:6s] pointer-events-none" />

            <div className="relative w-16 h-16 rounded-2xl bg-gradient-to-br from-white/35 to-white/15 border border-white/95 ring-1 ring-[#ff5722]/25 flex items-center justify-center text-[#ff5722] shadow-[8px_8px_18px_rgba(15,23,42,0.12),-6px_-6px_14px_rgba(255,255,255,0.95)]">
              <Loader2 size={30} className="animate-spin text-[#ff5722]" />
            </div>
          </div>

          {/* Badge + Title */}
          <div className="space-y-1.5">
            <span className="inline-flex items-center gap-1.5 px-3 py-0.5 rounded-full bg-white/20 border border-white/85 text-[10px] font-extrabold uppercase tracking-[0.14em] text-[#ff5722] shadow-[3px_3px_8px_rgba(15,23,42,0.07)]">
              <Sparkles size={11} className="animate-pulse" />
              <span>FixLab</span>
            </span>

            <p className="text-sm sm:text-[15px] font-extrabold text-gray-900 tracking-tight">
              Preparing your workspace...
            </p>
            <p className="text-[11px] font-medium text-gray-600 animate-pulse">
              Syncing your latest data
            </p>
          </div>

          {/* Sleek Indeterminate Progress Track */}
          <div className="w-36 h-1.5 rounded-full bg-slate-900/10 overflow-hidden p-[1px] shadow-[inset_1px_1px_3px_rgba(15,23,42,0.12)]">
            <div className="h-full w-1/2 rounded-full bg-gradient-to-r from-[#ff5722] via-[#ff784e] to-[#ff5722] animate-bounce [animation-duration:1.4s]" />
          </div>
        </div>
      </div>
    </div>
  );
}