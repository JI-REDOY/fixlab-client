"use client";

import { useEffect, useRef, useState } from "react";
import {
  Search,
  Send,
  Wrench,
  CreditCard,
  ChevronRight,
  Sparkles,
} from "lucide-react";

const steps = [
  {
    stepNumber: "01",
    icon: Search,
    title: "Find a Service",
    description:
      "Browse our wide range of repair services and find the exact fix you need.",
  },
  {
    stepNumber: "02",
    icon: Send,
    title: "Send a Request",
    description:
      "Describe your device issue and choose a convenient time for your technician.",
  },
  {
    stepNumber: "03",
    icon: Wrench,
    title: "Technician Fixes It",
    description:
      "A verified specialist arrives at your doorstep or service point and repairs it.",
  },
  {
    stepNumber: "04",
    icon: CreditCard,
    title: "Pay After Service",
    description:
      "Once you are completely satisfied with the work, pay securely via Stripe.",
  },
];

export default function HowItWorks() {
  const [isVisible, setIsVisible] = useState(false);
  const sectionRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) setIsVisible(true);
      },
      { threshold: 0.1 }
    );
    if (sectionRef.current) observer.observe(sectionRef.current);
    return () => {
      if (sectionRef.current) observer.unobserve(sectionRef.current);
    };
  }, []);

  return (
    <section
      id="how-it-works"
      ref={sectionRef}
      className="py-24 relative overflow-hidden"
    >
      {/* Subtle Orange Ambient Glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[780px] h-[340px] bg-[#ff5722]/10 blur-[140px] rounded-full pointer-events-none -z-10" />

      <style>{`
        @keyframes runArrows {
          0% {
            left: 8%;
            opacity: 0;
            transform: translateX(-16px);
          }
          12% {
            opacity: 1;
          }
          82% {
            opacity: 1;
          }
          100% {
            left: 86%;
            opacity: 0;
            transform: translateX(16px);
          }
        }
        .animate-arrows {
          animation: runArrows 3.6s linear infinite;
        }
      `}</style>

      <div className="container mx-auto px-4 md:px-8 relative z-10">
        {/* Section Header */}
        <div
          className={`text-center mb-20 transition-all duration-1000 ease-out ${
            isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"
          }`}
        >
          <span className="inline-flex items-center gap-1.5 py-1.5 px-4 rounded-full bg-[#ff5722]/10 border border-[#ff5722]/20 text-[#ff5722] font-extrabold tracking-wider uppercase text-xs mb-4 shadow-2xs">
            <Sparkles size={13} /> How It Works
          </span>
          <h2 className="text-3xl md:text-5xl font-extrabold text-gray-900 mb-4 tracking-tight leading-tight">
            From browse to fix <br /> in{" "}
            <span className="text-[#ff5722]">four steps.</span>
          </h2>
          <p className="text-gray-700 max-w-2xl mx-auto text-base md:text-lg font-medium leading-relaxed">
            Simple booking, upfront clarity, and payment protection after completion.
          </p>
        </div>

        {/* Steps Grid */}
        <div className="relative mt-16">
          {/* Connector Line (Desktop) */}
          <div className="hidden lg:block absolute top-[40px] left-[12%] right-[12%] h-px border-t-2 border-dashed border-[#ff5722]/35 -z-10" />

          {/* Moving Chevron Arrows */}
          <div className="hidden lg:flex absolute top-[29px] animate-arrows z-0 items-center -space-x-3 pointer-events-none">
            <ChevronRight className="h-6 w-6 text-[#ff5722]/40" />
            <ChevronRight className="h-6 w-6 text-[#ff5722]/70" />
            <ChevronRight className="h-6 w-6 text-[#ff5722]" />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8">
            {steps.map((step, index) => {
              const IconComponent = step.icon;

              return (
                <div
                  key={step.stepNumber}
                  style={{ transitionDelay: `${index * 120}ms` }}
                  className={`group relative flex flex-col items-center text-center p-6 pt-4 bg-white/15 backdrop-blur-xs border border-white/55 rounded-[2.25rem] shadow-[0_10px_28px_rgba(0,0,0,0.03),inset_0_1px_0_rgba(255,255,255,0.65)] hover:shadow-[0_16px_34px_rgba(255,87,34,0.12)] transition-all duration-400 hover:-translate-y-1.5 hover:border-[#ff5722]/40 hover:bg-white/20 ${
                    isVisible
                      ? "opacity-100 translate-y-0"
                      : "opacity-0 translate-y-12"
                  }`}
                >
                  {/* Subdued Hover Shine */}
                  <div className="absolute inset-0 z-20 bg-gradient-to-tr from-transparent via-white/8 to-transparent -translate-x-[150%] group-hover:translate-x-[150%] transition-transform duration-[1.1s] ease-in-out pointer-events-none rounded-[2.25rem]" />

                  {/* Floating Icon Badge */}
                  <div className="relative -mt-12 mb-5 z-10">
                    <div className="w-20 h-20 rounded-full p-1 bg-gradient-to-tr from-[#ff5722] to-[#ff8a65] shadow-md group-hover:scale-105 transition-transform duration-300">
                      <div className="w-full h-full rounded-full bg-white/95 flex items-center justify-center border-2 border-white">
                        <IconComponent className="h-8 w-8 text-[#ff5722] transition-transform duration-300 group-hover:scale-110" />
                      </div>
                    </div>

                    <div className="absolute -top-1.5 -right-1.5 bg-gradient-to-r from-[#ff5722] to-[#ff6d3f] text-white w-8 h-8 rounded-full flex items-center justify-center text-xs font-extrabold border-2 border-white shadow-sm">
                      {index + 1}
                    </div>
                  </div>

                  <span className="text-[11px] font-extrabold uppercase tracking-widest text-[#ff5722] mb-1">
                    Step {step.stepNumber}
                  </span>

                  <h3 className="text-xl font-extrabold mb-3 text-gray-900 tracking-tight group-hover:text-[#ff5722] transition-colors duration-300">
                    {step.title}
                  </h3>

                  <p className="text-gray-700 text-sm leading-relaxed font-medium mb-4">
                    {step.description}
                  </p>

                  {/* Sliding Orange Accent Bar */}
                  <div className="w-12 h-[2px] bg-black/10 rounded-full overflow-hidden mt-auto">
                    <div className="h-full w-0 bg-[#ff5722] transition-all duration-300 group-hover:w-full" />
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}