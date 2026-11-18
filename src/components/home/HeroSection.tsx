import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight, Sparkles, ShieldCheck, ThumbsUp } from "lucide-react";

const trustBadges = [
  { icon: Sparkles, title: "100%", subtitle: "Satisfaction" },
  { icon: ShieldCheck, title: "Trusted", subtitle: "Professionals" },
  { icon: ThumbsUp, title: "Pay After", subtitle: "Service" },
];

export default function HeroSection() {
  return (
    <section className="relative mx-auto -mt-[66px] h-[calc(100svh-16px)] min-h-[640px] w-[calc(100%-16px)] max-w-[1800px] overflow-hidden rounded-[28px] bg-[#EDEAE2] lg:-mt-[98px] lg:rounded-[34px]">
      
      {/* Background Image - Local File */}
      <Image
        src="/Hero-section-banner.png"
        alt="Professional technician repairing an appliance"
        fill
        priority
        sizes="(min-width: 1900px) 1800px, 100vw"
        className="object-cover object-[75%_center] sm:object-center transition-transform duration-[3000ms] ease-out hover:scale-[1.02]"
      />

      {/* Left Gradient Wash - Keeps text readable */}
      <div className="absolute inset-0 bg-[linear-gradient(96deg,rgba(251,250,246,0.96)_0%,rgba(251,250,246,0.92)_26%,rgba(251,250,246,0.62)_42%,rgba(251,250,246,0.18)_56%,rgba(251,250,246,0)_68%)] z-10" />

      {/* Mobile Overlay Wash */}
      <div className="absolute inset-0 bg-[#FBFAF6]/60 sm:hidden z-10" />

      {/* Top Glass Gradient for Navbar Legibility */}
      <div className="absolute inset-x-0 top-0 h-[30%] bg-gradient-to-b from-white/90 via-white/40 to-transparent z-10" />

      {/* Inverse (Concave) Corners - To blend with Navbar */}
      <span
        aria-hidden="true"
        className="pointer-events-none absolute left-0 top-[98px] z-20 hidden h-[34px] w-[34px] lg:block"
        style={{
          background:
            "radial-gradient(circle at 100% 100%, transparent 33.5px, var(--page-bg, #F4F5F1) 34.5px)",
        }}
      />
      <span
        aria-hidden="true"
        className="pointer-events-none absolute right-0 top-[98px] z-20 hidden h-[34px] w-[34px] lg:block"
        style={{
          background:
            "radial-gradient(circle at 0 100%, transparent 33.5px, var(--page-bg, #F4F5F1) 34.5px)",
        }}
      />

      {/* Main Content Area */}
      <div className="relative z-30 flex h-full flex-col justify-center px-7 pb-24 pt-20 sm:px-10 lg:px-16 xl:px-24">
        
        {/* Eyebrow / Tagline with Smooth Fade-in Animation */}
        <div className="flex items-center gap-4 animate-in fade-in slide-in-from-bottom-4 duration-700 delay-100">
          <span className="text-[10px] font-semibold uppercase tracking-[0.3em] text-[#8C8A81] sm:text-[11px]">
            Professional Repair Services
          </span>
          <span className="hidden h-px w-14 bg-[#C6C3B8] sm:block" />
        </div>

        {/* Main Heading */}
        <h1 className="mt-4 text-[clamp(1.8rem,8.4vw,5.4rem)] font-extrabold leading-[0.95] tracking-[-0.035em] text-[#1F241D] sm:mt-5 animate-in fade-in slide-in-from-bottom-6 duration-700 delay-200">
          A Broken Device?
          <br />
          <span className="text-[#3E5C3A]">A Happier You.</span>
        </h1>

        {/* Subtitle */}
        <p className="mt-5 max-w-[470px] text-[15px] leading-[1.65] text-[#56564E] sm:mt-6 sm:text-[17px] animate-in fade-in slide-in-from-bottom-8 duration-700 delay-300">
          Trusted repair services for homes and offices. Verified technicians
          at your doorstep — pay only after the job is done.
        </p>

        {/* Call to Action Button (Premium Hover Effect) */}
        <div className="mt-7 sm:mt-9 animate-in fade-in slide-in-from-bottom-10 duration-700 delay-400">
          <Link
            href="/services"
            className="group inline-flex items-center gap-3 rounded-full bg-[#2C3620] py-2 pl-7 pr-2 text-[15px] font-medium text-white shadow-[0_18px_34px_-20px_rgba(24,32,16,0.9)] transition-all duration-300 hover:bg-[#212B18] hover:scale-[1.02] active:scale-[0.98] sm:text-[16px]"
          >
            Book a Repair
            <span className="flex h-11 w-11 items-center justify-center rounded-full bg-white text-[#2C3620] transition-transform duration-300 group-hover:rotate-45">
              <ArrowUpRight size={18} strokeWidth={2.5} />
            </span>
          </Link>
        </div>
      </div>

      {/* Trust Badges (Bottom Area with Glassmorphism) */}
      <div className="absolute inset-x-0 bottom-6 z-30 flex flex-col gap-y-6 px-7 sm:bottom-10 sm:flex-row sm:flex-wrap sm:items-center sm:gap-x-10 sm:px-10 lg:bottom-16 lg:px-16 xl:px-24 animate-in fade-in duration-1000 delay-500">
        {trustBadges.map(({ icon: Icon, title, subtitle }, idx) => (
          <div
            key={title}
            className={`flex items-center gap-2.5 sm:gap-3 sm:pr-10 ${
              idx !== trustBadges.length - 1 ? "sm:border-r sm:border-black/10" : ""
            }`}
          >
            <div className="flex h-10 w-10 sm:h-12 sm:w-12 items-center justify-center rounded-full bg-white/40 backdrop-blur-sm shadow-sm">
              <Icon size={20} strokeWidth={1.5} className="text-[#1F241D] sm:h-6 sm:w-6" />
            </div>
            <div>
              <p className="text-[13px] font-bold leading-tight text-[#1F241D] sm:text-[15px]">
                {title}
              </p>
              <p className="mt-0.5 text-[11px] leading-tight text-[#77766D] sm:text-[13px]">
                {subtitle}
              </p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}