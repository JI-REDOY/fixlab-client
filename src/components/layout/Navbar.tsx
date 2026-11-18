"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname, useRouter } from "next/navigation";
import { authClient } from "@/lib/auth-client";
import { useEffect, useState } from "react";
import { Menu, X, LogOut, LayoutDashboard, User, ArrowUpRight } from "lucide-react";
import { toast } from "sonner";

const LOBE_PATH =
  "M0 0 H400 V14 H394 C360 14 340 30 330 60 C320 92 306 112 272 112 H0 Z";

export default function Navbar() {
  const pathname = usePathname();
  const router = useRouter();
  const [isOpen, setIsOpen] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const { data: session } = authClient.useSession();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const closeMenus = () => {
    setIsOpen(false);
    setDropdownOpen(false);
  };

  const handleSignOut = async () => {
    await authClient.signOut();
    localStorage.removeItem("fixlab_token");
    closeMenus();
    toast.success("Signed out successfully");
    router.push("/");
  };

  const navLinks = [
    { name: "Home", href: "/" },
    { name: "Services", href: "/services" },
    { name: "How It Works", href: "/about" },
  ];

  return (
    <header className="sticky top-0 z-50 w-full">
      <div className="h-[80px] w-full lg:h-[112px]" aria-hidden="true" />

      {/* ------------------------------------------------ shapes ------------------------------------------------ */}
      <div className="pointer-events-none absolute inset-x-0 top-0">
        
        {/* Desktop: white arch (top of page) - Smooth Fade Out */}
        <div
          className={`hidden transition-all duration-500 ease-in-out lg:block ${
            scrolled ? "opacity-0 translate-y-[-10px]" : "opacity-100 translate-y-0"
          }`}
        >
          <div className="absolute inset-x-0 top-0 h-[14px] bg-white" />
          <div className="absolute left-0 top-0 h-[112px] w-[400px]">
            <svg viewBox="0 0 400 112" preserveAspectRatio="none" className="h-full w-full" aria-hidden="true">
              <path d={LOBE_PATH} fill="#ffffff" />
            </svg>
          </div>
          <div className="absolute right-0 top-0 h-[112px] w-[400px]">
            <svg viewBox="0 0 400 112" preserveAspectRatio="none" className="h-full w-full -scale-x-100" aria-hidden="true">
              <path d={LOBE_PATH} fill="#ffffff" />
            </svg>
          </div>
        </div>

        {/* Desktop: floating frosted-glass pill - Smooth Slide Down & Scale */}
        <div
          className={`absolute inset-x-0 top-3 mx-auto hidden h-[64px] w-[calc(100%-32px)] max-w-[1100px] rounded-full border border-white/70 bg-white/80 shadow-[0_20px_50px_-24px_rgba(15,20,10,0.45)] backdrop-blur-xl backdrop-saturate-150 transition-all duration-500 ease-[cubic-bezier(0.34,1.56,0.64,1)] lg:block ${
            scrolled 
              ? "visible translate-y-0 opacity-100 scale-100" 
              : "invisible -translate-y-4 opacity-0 scale-95"
          }`}
        />

        {/* Mobile / tablet bar */}
        <div
          className={`absolute inset-x-0 top-0 h-[80px] rounded-b-[26px] border-b border-black/[0.04] shadow-[0_18px_34px_-28px_rgba(15,20,10,0.5)] transition-all duration-500 ease-in-out lg:hidden ${
            scrolled ? "bg-white/90 backdrop-blur-xl" : "bg-white"
          }`}
        />
      </div>

      {/* ------------------------------------------------ content ------------------------------------------------ */}
      <div
        className={`absolute inset-x-0 top-0 mx-auto flex w-full items-center justify-between px-5 transition-all duration-500 ease-[cubic-bezier(0.34,1.56,0.64,1)] lg:px-10 ${
          scrolled
            ? "lg:top-3 lg:h-[64px] lg:w-[calc(100%-32px)] lg:max-w-[1100px] lg:px-7 h-[80px]"
            : "lg:h-[112px] h-[80px]"
        }`}
      >
        {/* Logo */}
        <Link
          href="/"
          onClick={closeMenus}
          className="relative flex shrink-0 items-center gap-2.5 sm:gap-3 transition-transform duration-500"
        >
          <Image
            src="/fixlab-icon.png"
            alt=""
            width={256}
            height={256}
            priority
            className={`rounded-[22%] object-contain mix-blend-multiply transition-all duration-500 ease-in-out ${
              scrolled ? "h-8 w-8 lg:h-9 lg:w-9" : "h-10 w-10 lg:h-12 lg:w-12"
            }`}
          />
          <Image
            src="/fixlab-logo.png"
            alt="FixLab"
            width={1000}
            height={329}
            priority
            className={`w-auto mix-blend-multiply transition-all duration-500 ease-in-out ${
              scrolled ? "h-[26px] lg:h-[30px]" : "h-[34px] lg:h-[42px]"
            }`}
          />
        </Link>

        {/* Center links */}
        <nav className="absolute left-1/2 top-1/2 hidden -translate-x-1/2 -translate-y-1/2 items-center gap-9 lg:flex xl:gap-12">
          {navLinks.map((link) => {
            const active = pathname === link.href;
            return (
              <Link
                key={link.name}
                href={link.href}
                onClick={closeMenus}
                className={`relative text-[15px] font-medium tracking-[-0.01em] transition-colors duration-300 ${
                  active ? "text-[#1F241D]" : "text-[#3C3C37] hover:text-[#3E5C3A]"
                }`}
              >
                {link.name}
                <span
                  className={`absolute -bottom-2.5 left-1/2 h-[3px] w-[3px] -translate-x-1/2 rounded-full bg-[#3E5C3A] transition-opacity duration-300 ${
                    active ? "opacity-100" : "opacity-0"
                  }`}
                />
              </Link>
            );
          })}
        </nav>

        {/* Right side */}
        <div className="relative z-10 hidden items-center gap-3 lg:flex">
          {!session ? (
            <>
              <Link
                href="/sign-in"
                className="mr-2 text-[15px] font-medium text-[#3C3C37] transition-colors hover:text-[#2C3620]"
              >
                Sign In
              </Link>

              <Link
                href="/sign-up"
                className={`rounded-full bg-[#2C3620] px-7 text-[14px] font-medium leading-[22px] text-white shadow-[0_16px_28px_-18px_rgba(24,32,16,0.85)] transition-all duration-500 ease-in-out hover:bg-[#212B18] ${
                  scrolled ? "py-[10px]" : "py-[15px]"
                }`}
              >
                Get a Quote
              </Link>

              <Link
                href="/services"
                aria-label="Browse services"
                className={`flex items-center justify-center rounded-full bg-[#2C3620] text-white shadow-[0_16px_28px_-18px_rgba(24,32,16,0.85)] transition-all duration-500 ease-in-out hover:rotate-45 hover:bg-[#212B18] ${
                  scrolled ? "h-10 w-10" : "h-[52px] w-[52px]"
                }`}
              >
                <ArrowUpRight size={18} strokeWidth={2} />
              </Link>
            </>
          ) : (
            <div className="relative">
              <button
                onClick={() => setDropdownOpen(!dropdownOpen)}
                className="flex items-center gap-2 rounded-full ring-1 ring-black/5 transition-all duration-300 hover:ring-black/10"
                aria-label="Account menu"
              >
                <Image
                  src={session.user.image || "/default-avatar.png"}
                  alt="User"
                  width={44}
                  height={44}
                  className={`rounded-full object-cover transition-all duration-500 ${
                    scrolled ? "h-9 w-9" : "h-11 w-11"
                  }`}
                />
              </button>

              {/* Dropdown */}
              {dropdownOpen && (
                <div className="absolute right-0 mt-3 flex w-60 flex-col rounded-2xl border border-black/5 bg-white p-2 shadow-[0_30px_60px_-30px_rgba(15,20,10,0.45)]">
                   {/* ... (dropdown items same as before) ... */}
                </div>
              )}
            </div>
          )}
        </div>

        {/* Mobile toggle */}
        <button
          onClick={() => setIsOpen(!isOpen)}
          aria-label="Toggle menu"
          className="relative z-10 flex h-11 w-11 items-center justify-center rounded-full text-[#1F241D] transition-colors hover:bg-[#F4F3EE] lg:hidden"
        >
          {isOpen ? <X size={22} /> : <Menu size={22} />}
        </button>
      </div>

      {/* Mobile menu (same as before) */}
      {isOpen && (
        <div className="absolute inset-x-0 top-[80px] z-10 px-4 lg:hidden animate-in fade-in slide-in-from-top-4 duration-300">
          <div className="rounded-[26px] border border-black/5 bg-white p-3 shadow-[0_30px_60px_-30px_rgba(15,20,10,0.45)]">
            {navLinks.map((link) => (
              <Link
                key={link.name}
                href={link.href}
                onClick={closeMenus}
                className={`block rounded-2xl px-4 py-3 text-[15px] font-medium transition-colors hover:bg-[#F4F3EE] ${
                  pathname === link.href ? "text-[#3E5C3A]" : "text-[#3C3C37]"
                }`}
              >
                {link.name}
              </Link>
            ))}
            <div className="mt-2 flex flex-col gap-2 border-t border-black/5 px-1 pt-3">
              {/* ... Auth buttons ... */}
            </div>
          </div>
        </div>
      )}
    </header>
  );
}