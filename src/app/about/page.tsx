import { Search, Send, Wrench, CreditCard, ShieldCheck, CheckCircle } from "lucide-react";

export default function AboutPage() {
  return (
    <div className="w-full bg-[#F8F9FA] pb-20">
      {/* Hero Section */}
      <div className="bg-fixlab-green py-20 px-4 text-center">
        <h1 className="text-4xl sm:text-5xl font-extrabold text-white mb-4">How FixLab Works</h1>
        <p className="text-fixlab-mint max-w-2xl mx-auto text-lg">
          Getting your device repaired has never been easier. We connect you with verified technicians who fix your devices at your doorstep.
        </p>
      </div>

      {/* Steps */}
      <div className="max-w-[1200px] mx-auto px-4 sm:px-6 lg:px-8 -mt-10">
        <div className="bg-white rounded-3xl shadow-lg p-8 sm:p-12 mb-16 relative z-10">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            {[
              { icon: Search, title: "1. Find a Service", desc: "Browse our wide range of repair services and find the one you need." },
              { icon: Send, title: "2. Send a Request", desc: "Describe your problem and set a preferred date for the technician to visit." },
              { icon: Wrench, title: "3. Get It Fixed", desc: "Our verified technician arrives and fixes your device on the spot." },
              { icon: CreditCard, title: "4. Pay After Service", desc: "Once you're satisfied, pay securely online through Stripe." },
            ].map((step, idx) => (
              <div key={idx} className="flex flex-col items-center text-center">
                <div className="w-16 h-16 rounded-2xl bg-fixlab-cream flex items-center justify-center mb-4">
                  <step.icon size={32} className="text-fixlab-green" />
                </div>
                <h3 className="text-lg font-bold text-fixlab-charcoal mb-2">{step.title}</h3>
                <p className="text-sm text-fixlab-gray">{step.desc}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Why Choose Us */}
        <div className="max-w-[1200px] mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-extrabold text-center text-fixlab-charcoal mb-10">Why Choose FixLab?</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-white p-8 rounded-3xl shadow-sm border border-gray-100 text-center">
              <ShieldCheck size={48} className="text-fixlab-green mx-auto mb-4" />
              <h3 className="text-xl font-bold text-fixlab-charcoal mb-2">Verified Technicians</h3>
              <p className="text-fixlab-gray">All our technicians are thoroughly vetted and background-checked.</p>
            </div>
            <div className="bg-white p-8 rounded-3xl shadow-sm border border-gray-100 text-center">
              <CheckCircle size={48} className="text-fixlab-green mx-auto mb-4" />
              <h3 className="text-xl font-bold text-fixlab-charcoal mb-2">Pay After Completion</h3>
              <p className="text-fixlab-gray">No upfront payment. You only pay when the job is done to your satisfaction.</p>
            </div>
            <div className="bg-white p-8 rounded-3xl shadow-sm border border-gray-100 text-center">
              <Wrench size={48} className="text-fixlab-green mx-auto mb-4" />
              <h3 className="text-xl font-bold text-fixlab-charcoal mb-2">Quality Guarantee</h3>
              <p className="text-fixlab-gray">We use premium parts and offer a warranty on all repair services.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}