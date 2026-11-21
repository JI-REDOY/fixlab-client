import Link from "next/link";
import Image from "next/image";
import { MapPin, Phone, Mail, ArrowRight } from "lucide-react";
import { FaFacebookF, FaLinkedinIn, FaInstagram } from "react-icons/fa";
import { FaXTwitter } from "react-icons/fa6";

export default function Footer() {
  const currentYear = new Date().getFullYear();

  const quickLinks = [
    { name: "Home", href: "/" },
    { name: "Services", href: "/services" },
    { name: "How It Works", href: "/about" },
    { name: "Sign In", href: "/sign-in" },
    { name: "Sign Up", href: "/sign-up" },
  ];

  const categories = [
    "Smartphone Repair",
    "Laptop & PC",
    "AC Servicing",
    "Refrigerator",
    "TV Screen Repair",
    "Washing Machine",
  ];

  const socials = [
    { icon: FaFacebookF, label: "Facebook", href: "#" },
    { icon: FaXTwitter, label: "X", href: "#" },
    { icon: FaLinkedinIn, label: "LinkedIn", href: "#" },
    { icon: FaInstagram, label: "Instagram", href: "#" },
  ];

  return (
    <footer className="relative w-full mt-20 overflow-hidden bg-white/10 border-t border-white/60 shadow-[0_-10px_30px_rgba(0,0,0,0.03)]">
      {/* Subtle Orange Ambient Glows */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-4xl h-64 bg-[#ff5722]/10 blur-[120px] rounded-full pointer-events-none -z-10" />
      <div className="absolute bottom-0 right-0 w-96 h-96 bg-[#ff7043]/5 blur-[130px] rounded-full pointer-events-none -z-10" />

      {/* Top Accent Line */}
      <div className="h-[2px] w-full bg-gradient-to-r from-transparent via-[#ff5722]/50 to-transparent" />

      <div className="container mx-auto px-4 md:px-8 pt-16 pb-8 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-12 mb-12">
          {/* Brand Section */}
          <div className="lg:col-span-4">
            <Link
              href="/"
              className="inline-flex items-center gap-2.5 mb-6 group transition-transform duration-300 hover:scale-[1.02]"
            >
              <Image
                src="/icon-whiteTheme.png"
                alt="FixLab Icon"
                width={38}
                height={38}
                className="object-contain w-8 h-8 sm:w-9 sm:h-9 shrink-0"
              />
              <Image
                src="/fixlab-logo-black-transparent-4x.png"
                alt="FixLab Logo"
                width={118}
                height={40}
                className="object-contain h-6 sm:h-8 w-auto shrink-0"
              />
            </Link>

            <p className="text-sm text-gray-700 leading-relaxed mb-7 pr-2 font-medium">
              Your trusted partner for smart device and home appliance repairs. Book
              verified technicians, track your job, and pay only after the work is
              done.
            </p>

            {/* Social Icons */}
            <div className="flex items-center gap-3">
              {socials.map((item, idx) => {
                const Icon = item.icon;
                return (
                  <a
                    key={idx}
                    href={item.href}
                    aria-label={item.label}
                    className="w-10 h-10 rounded-xl bg-white/35 border border-white/70 flex items-center justify-center text-gray-600 hover:text-white hover:bg-gradient-to-r hover:from-[#ff5722] hover:to-[#ff6d3f] hover:border-[#ff5722] hover:-translate-y-0.5 transition-all duration-300 shadow-xs"
                  >
                    <Icon size={16} />
                  </a>
                );
              })}
            </div>
          </div>

          {/* Quick Links */}
          <div className="lg:col-span-2">
            <h3 className="text-gray-900 font-extrabold text-base mb-5 tracking-wide flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-[#ff5722]" />
              Quick Links
            </h3>
            <ul className="space-y-3">
              {quickLinks.map((link, idx) => (
                <li key={idx}>
                  <Link
                    href={link.href}
                    className="text-sm font-semibold text-gray-700 hover:text-[#ff5722] transition-colors flex items-center gap-2 group"
                  >
                    <ArrowRight
                      size={14}
                      className="opacity-0 -ml-4 group-hover:opacity-100 group-hover:ml-0 transition-all duration-300 text-[#ff5722]"
                    />
                    <span>{link.name}</span>
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Categories */}
          <div className="lg:col-span-3">
            <h3 className="text-gray-900 font-extrabold text-base mb-5 tracking-wide flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-[#ff5722]" />
              Categories
            </h3>
            <ul className="space-y-3">
              {categories.map((cat, idx) => (
                <li key={idx}>
                  <Link
                    href={`/services?category=${encodeURIComponent(cat)}`}
                    className="text-sm font-semibold text-gray-700 hover:text-[#ff5722] transition-colors flex items-center gap-2 group"
                  >
                    <ArrowRight
                      size={14}
                      className="opacity-0 -ml-4 group-hover:opacity-100 group-hover:ml-0 transition-all duration-300 text-[#ff5722]"
                    />
                    <span>{cat}</span>
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact Info */}
          <div className="lg:col-span-3">
            <h3 className="text-gray-900 font-extrabold text-base mb-5 tracking-wide flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-[#ff5722]" />
              Get in Touch
            </h3>
            <ul className="space-y-3.5">
              <li className="flex items-start gap-3 p-3.5 rounded-2xl bg-white/25 border border-white/65 shadow-2xs hover:border-[#ff5722]/35 hover:bg-white/35 transition-all duration-300">
                <div className="w-9 h-9 rounded-xl bg-[#ff5722]/12 border border-[#ff5722]/20 flex items-center justify-center shrink-0 mt-0.5">
                  <MapPin size={16} className="text-[#ff5722]" />
                </div>
                <span className="text-sm font-semibold text-gray-800 leading-snug">
                  Mirpur, Dhaka
                  <br />
                  <span className="text-xs font-medium text-gray-600">Bangladesh</span>
                </span>
              </li>

              <li className="flex items-center gap-3 p-3.5 rounded-2xl bg-white/25 border border-white/65 shadow-2xs hover:border-[#ff5722]/35 hover:bg-white/35 transition-all duration-300">
                <div className="w-9 h-9 rounded-xl bg-[#ff5722]/12 border border-[#ff5722]/20 flex items-center justify-center shrink-0">
                  <Phone size={16} className="text-[#ff5722]" />
                </div>
                <span className="text-sm font-semibold text-gray-800">
                  +880 1234 567890
                </span>
              </li>

              <li className="flex items-center gap-3 p-3.5 rounded-2xl bg-white/25 border border-white/65 shadow-2xs hover:border-[#ff5722]/35 hover:bg-white/35 transition-all duration-300">
                <div className="w-9 h-9 rounded-xl bg-[#ff5722]/12 border border-[#ff5722]/20 flex items-center justify-center shrink-0">
                  <Mail size={16} className="text-[#ff5722]" />
                </div>
                <span className="text-sm font-semibold text-gray-800 break-all">
                  support@fixlab.com
                </span>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Copyright Bar */}
        <div className="pt-8 border-t border-gray-300/50 flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-sm font-semibold text-gray-600">
            © {currentYear} <span className="text-gray-900 font-extrabold">FixLab</span>.
            All rights reserved.
          </p>
          <div className="flex items-center gap-6">
            <Link
              href="#"
              className="text-sm font-semibold text-gray-600 hover:text-[#ff5722] transition-colors"
            >
              Privacy Policy
            </Link>
            <Link
              href="#"
              className="text-sm font-semibold text-gray-600 hover:text-[#ff5722] transition-colors"
            >
              Terms of Service
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}