import { Loader2, Sparkles } from "lucide-react";

export default function Loading() {
  return (
    <div className="min-h-screen flex items-center justify-center px-4 py-12 relative z-10">
      <div className="relative overflow-hidden rounded-[2rem] bg-white/15 backdrop-blur-md border border-white/85 ring-1 ring-slate-900/12 px-8 py-9 text-center shadow-[14px_14px_30px_rgba(15,23,42,0.14),-10px_-10px_24px_rgba(255,255,255,0.92),inset_0_1px_0_rgba(255,255,255,0.85)]">
        {/* Soft Ambient Glow */}
        <div className="absolute -right-10 -top-10 w-36 h-36 rounded-full bg-[#ff5722]/15 blur-2xl pointer-events-none" />

        <div className="relative z-10 flex flex-col items-center gap-3.5">
          {/* Spinner Box */}
          <div className="w-16 h-16 rounded-2xl bg-white/25 border border-white/90 ring-1 ring-[#ff5722]/25 flex items-center justify-center text-[#ff5722] shadow-[6px_6px_14px_rgba(15,23,42,0.1),-5px_-5px_12px_rgba(255,255,255,0.95)]">
            <Loader2 size={32} className="animate-spin text-[#ff5722]" />
          </div>

          {/* Label */}
          <div className="space-y-1">
            <span className="inline-flex items-center gap-1 text-[11px] font-extrabold uppercase tracking-wider text-[#ff5722]">
              <Sparkles size={12} /> Loading
            </span>
            <p className="text-sm font-extrabold text-gray-900">
              Preparing your workspace...
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}