import { Search, Send, Wrench, CreditCard } from "lucide-react";

const steps = [
  { icon: Search, title: "Find a Service", desc: "Browse and search for the repair service you need." },
  { icon: Send, title: "Send a Request", desc: "Describe your problem and set a preferred date." },
  { icon: Wrench, title: "Technician Fixes It", desc: "Our verified professional completes the job." },
  { icon: CreditCard, title: "Pay After Completion", desc: "Pay securely online only after the job is done." },
];

export default function HowItWorks() {
  return (
    <section className="w-full bg-fixlab-green py-20 px-4 sm:px-6 lg:px-8">
      <div className="max-w-[1400px] mx-auto text-center">
        <h2 className="text-3xl sm:text-4xl font-extrabold text-white mb-4">How FixLab Works</h2>
        <p className="text-fixlab-mint max-w-2xl mx-auto mb-16">
          Getting your device repaired is as easy as 1-2-3-4. No hassle, no hidden fees.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 relative">
          {/* Connecting Line (Desktop) */}
          <div className="hidden md:block absolute top-1/2 left-[10%] right-[10%] h-[2px] bg-white/20 -translate-y-1/2 z-0" />

          {steps.map((step, idx) => (
            <div key={idx} className="relative z-10 flex flex-col items-center">
              <div className="w-20 h-20 bg-white rounded-full flex items-center justify-center mb-6 shadow-[0_0_30px_rgba(0,0,0,0.1)]">
                <step.icon size={32} className="text-fixlab-green" />
              </div>
              <h3 className="text-xl font-bold text-white mb-2">{step.title}</h3>
              <p className="text-sm text-fixlab-mint/80 max-w-[200px]">{step.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}