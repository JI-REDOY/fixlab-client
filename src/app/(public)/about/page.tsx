import Link from "next/link";
import {
  Search,
  Send,
  Wrench,
  CreditCard,
  ShieldCheck,
  CheckCircle,
  Sparkles,
  ArrowRight,
} from "lucide-react";

export default function AboutPage() {
  const steps = [
    {
      icon: Search,
      title: "1. Find a Service",
      desc: "Browse our wide range of repair services and find the one you need.",
    },
    {
      icon: Send,
      title: "2. Send a Request",
      desc: "Describe your problem and set a preferred date for the technician to visit.",
    },
    {
      icon: Wrench,
      title: "3. Get It Fixed",
      desc: "Our verified technician arrives and fixes your device on the spot.",
    },
    {
      icon: CreditCard,
      title: "4. Pay After Service",
      desc: "Once you're satisfied, pay securely online through Stripe.",
    },
  ];

  const reasons = [
    {
      icon: ShieldCheck,
      badge: "Trusted Pros",
      title: "Verified Technicians",
      desc: "All our technicians are thoroughly vetted and background-checked.",
    },
    {
      icon: CheckCircle,
      badge: "Zero Upfront Risk",
      title: "Pay After Completion",
      desc: "No upfront payment. You only pay when the job is done to your satisfaction.",
    },
    {
      icon: Wrench,
      badge: "Genuine Parts",
      title: "Quality Guarantee",
      desc: "We use premium parts and offer a warranty on all repair services.",
    },
  ];

  return (
    <div className="w-full bg-transparent min-h-screen pb-24 relative overflow-hidden">
      {/* Subtle Orange Ambient Glows */}
      <div className="absolute top-12 right-0 w-[580px] h-[580px] bg-[#ff5722]/15 blur-[150px] rounded-full -translate-y-1/3 translate-x-1/3 z-0 pointer-events-none" />
      <div className="absolute bottom-16 left-0 w-[500px] h-[500px] bg-[#ff7043]/10 blur-[150px] rounded-full translate-y-1/3 -translate-x-1/3 z-0 pointer-events-none" />

      {/* Hero Section */}
      <section className="pt-32 pb-24 px-4 sm:px-6 lg:px-8 text-center relative z-10">
        <div className="max-w-[900px] mx-auto">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#ff5722]/10 border border-[#ff5722]/25 text-[#ff5722] text-xs font-extrabold uppercase tracking-wider mb-5">
            <Sparkles size={14} /> About FixLab
          </div>

          <h1 className="text-4xl sm:text-5xl font-extrabold text-gray-900 tracking-tight mb-5">
            How <span className="text-[#ff5722]">FixLab</span> Works
          </h1>

          <p className="text-gray-700 max-w-2xl mx-auto text-base sm:text-lg font-medium leading-relaxed">
            Getting your device repaired has never been easier. We connect you with
            verified technicians who fix your devices at your doorstep.
          </p>
        </div>
      </section>

      {/* Steps + Why Choose Us Container */}
      <div className="max-w-[1200px] mx-auto px-4 sm:px-6 lg:px-8 -mt-8 relative z-10 space-y-20">
        {/* 4 Steps Glass Card */}
        <div className="bg-white/10 backdrop-blur-xs rounded-[3rem] shadow-[0_16px_40px_rgba(0,0,0,0.04),inset_0_1px_0_rgba(255,255,255,0.65)] border border-white/50 p-8 sm:p-12">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-7">
            {steps.map((step, idx) => {
              const Icon = step.icon;
              return (
                <div
                  key={idx}
                  className="bg-white/10 backdrop-blur-xs rounded-[2.2rem] p-6 border border-white/50 shadow-[0_10px_24px_rgba(0,0,0,0.03)] flex flex-col items-center text-center transition-all duration-300 hover:-translate-y-1 hover:border-[#ff5722]/35"
                >
                  <div className="w-16 h-16 rounded-2xl bg-[#ff5722]/12 border border-[#ff5722]/25 flex items-center justify-center mb-5 shadow-2xs">
                    <Icon size={30} className="text-[#ff5722]" />
                  </div>
                  <h3 className="text-lg font-extrabold text-gray-900 mb-2">
                    {step.title}
                  </h3>
                  <p className="text-sm text-gray-700 font-medium leading-relaxed">
                    {step.desc}
                  </p>
                </div>
              );
            })}
          </div>
        </div>

        {/* Why Choose Us Section */}
        <div>
          <div className="text-center mb-10">
            <h2 className="text-3xl sm:text-4xl font-extrabold text-gray-900 tracking-tight">
              Why Choose <span className="text-[#ff5722]">FixLab</span>?
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-7">
            {reasons.map((item, idx) => {
              const Icon = item.icon;
              return (
                <div
                  key={idx}
                  className="bg-white/10 backdrop-blur-xs p-8 sm:p-9 rounded-[2.8rem] shadow-[0_16px_40px_rgba(0,0,0,0.04),inset_0_1px_0_rgba(255,255,255,0.65)] border border-white/50 text-center flex flex-col items-center justify-between transition-all duration-300 hover:-translate-y-1 hover:border-[#ff5722]/35"
                >
                  <div className="flex flex-col items-center">
                    <span className="inline-flex items-center px-3.5 py-1 rounded-full bg-[#ff5722]/10 border border-[#ff5722]/20 text-[#ff5722] text-[11px] font-extrabold uppercase tracking-wider mb-5">
                      {item.badge}
                    </span>

                    <div className="w-16 h-16 rounded-2xl bg-[#ff5722]/12 border border-[#ff5722]/25 flex items-center justify-center mb-5">
                      <Icon size={34} className="text-[#ff5722]" />
                    </div>

                    <h3 className="text-xl font-extrabold text-gray-900 mb-2.5">
                      {item.title}
                    </h3>
                    <p className="text-sm sm:text-base text-gray-700 font-medium leading-relaxed">
                      {item.desc}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Bottom CTA */}
          <div className="mt-12 text-center">
            <Link
              href="/services"
              className="inline-flex items-center gap-2.5 py-4 px-8 rounded-full font-extrabold text-sm sm:text-base bg-gradient-to-r from-[#ff5722] to-[#ff6d3f] text-white hover:from-[#e64a19] hover:to-[#ff5722] hover:-translate-y-0.5 shadow-[0_12px_28px_rgba(255,87,34,0.35)] transition-all duration-300"
            >
              <span>Explore Repair Services</span>
              <ArrowRight size={18} />
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}