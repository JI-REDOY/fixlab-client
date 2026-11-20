"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname, useRouter } from "next/navigation";
import { authClient } from "@/lib/auth-client";
import {
  ArrowRight,
  Menu,
  X,
  LayoutDashboard,
  User,
  LogOut,
  ChevronDown,
  Sparkles,
} from "lucide-react";
import { useState, useRef, useEffect } from "react";
import { toast } from "sonner";

export default function Navbar() {
  const pathname = usePathname();
  const router = useRouter();
  const { data: session } = authClient.useSession();

  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsDropdownOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);

    const handleScroll = () => {
      if (window.scrollY > 20) {
        setScrolled(true);
      } else {
        setScrolled(false);
      }
    };
    window.addEventListener("scroll", handleScroll);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  const handleSignOut = async () => {
    await authClient.signOut();
    localStorage.removeItem("fixlab_token");
    toast.success("Signed out successfully");
    router.push("/");
  };

  const navItems = [
    { name: "Home", href: "/" },
    { name: "Services", href: "/services" },
    { name: "How It Works", href: "/about" },
  ];

  const dashboardLink = session ? `/dashboard/${session.user.role || "customer"}` : "#";
  const avatarUrl =
    session?.user?.image ||
    `https://ui-avatars.com/api/?name=${encodeURIComponent(
      session?.user?.name || "User"
    )}&background=ff5722&color=fff&bold=true`;

  return (
    <header className="fixed top-0 left-0 w-full z-50 bg-transparent pt-3 sm:pt-4 transition-all duration-300">
      <div className="max-w-[1500px] mx-auto px-3 sm:px-6 lg:px-8">
        {/* Always Light Transparent Glass Pill */}
        <div
          className={`h-18 sm:h-20 flex items-center justify-between gap-2 sm:gap-4 px-3.5 sm:px-6 lg:px-7 rounded-full border transition-all duration-500 relative ${
            scrolled
              ? "bg-[#111111]/45 backdrop-blur-md border-[#ff5722]/30 shadow-[0_10px_30px_rgba(0,0,0,0.22),0_0_20px_rgba(255,87,34,0.12)]"
              : "bg-[#111111]/25 backdrop-blur-xs border-white/20 shadow-[0_8px_24px_rgba(0,0,0,0.14),inset_0_1px_0_rgba(255,255,255,0.16)]"
          }`}
        >
          {/* Icon + Logo Side by Side Without Box */}
          <Link
            href="/"
            className="flex items-center gap-2 sm:gap-2.5 shrink-0 group transition-transform duration-300 hover:scale-[1.02]"
          >
            <Image
              src="/icon-whiteTheme.png"
              alt="FixLab Icon"
              width={36}
              height={36}
              className="object-contain w-7 h-7 sm:w-8 sm:h-8 shrink-0"
            />
            <Image
              src="/fixlab-logo-white-transparent.png"
              alt="FixLab Logo"
              width={118}
              height={40}
              className="object-contain h-6 sm:h-8 w-auto shrink-0"
            />
          </Link>

          {/* Desktop Center Menu */}
          <nav className="hidden md:flex items-center gap-1 lg:gap-2 bg-white/10 backdrop-blur-xs px-2.5 py-1.5 rounded-full border border-white/20 xl:absolute xl:left-1/2 xl:-translate-x-1/2 shrink-0">
            {navItems.map((item) => {
              const isActive = pathname === item.href;
              return (
                <Link
                  key={item.name}
                  href={item.href}
                  className={`group relative overflow-hidden px-4 lg:px-5 py-2.5 rounded-full text-sm font-bold transition-all duration-300 whitespace-nowrap ${
                    isActive
                      ? "bg-[#ff5722] text-white shadow-lg shadow-[#ff5722]/30"
                      : "text-gray-200 hover:text-white"
                  }`}
                >
                  <span className="relative z-10">{item.name}</span>

                  {/* Left-to-Right Loading Bar Underline on Hover (Non-Active Items) */}
                  {!isActive && (
                    <span className="absolute left-0 bottom-0 h-[2.5px] w-0 group-hover:w-full bg-gradient-to-r from-[#ff5722] via-[#ff7043] to-[#ff8a65] shadow-[0_0_10px_rgba(255,87,34,0.9)] transition-all duration-300 ease-out" />
                  )}
                </Link>
              );
            })}
          </nav>

          {/* Desktop Auth / Profile */}
          <div className="hidden md:flex items-center gap-2.5 lg:gap-3 shrink-0">
            {!session ? (
              <>
                <Link
                  href="/sign-in"
                  className="text-sm font-bold text-gray-200 hover:text-white transition-colors px-3.5 lg:px-4 py-2.5 rounded-full bg-white/5 hover:bg-white/15 border border-white/15 whitespace-nowrap"
                >
                  Sign In
                </Link>
                <Link
                  href="/sign-up"
                  className="bg-gradient-to-r from-[#ff5722] to-[#ff6d3f] hover:from-[#e64a19] hover:to-[#ff5722] text-white px-5 lg:px-6 py-2.5 rounded-full text-sm font-bold flex items-center gap-2 transition-all duration-300 hover:-translate-y-0.5 shadow-[0_8px_22px_rgba(255,87,34,0.38)] whitespace-nowrap"
                >
                  Sign Up <ArrowRight size={16} />
                </Link>
              </>
            ) : (
              <div className="relative" ref={dropdownRef}>
                <button
                  onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                  className="flex items-center gap-2.5 bg-white/10 border border-white/20 hover:border-[#ff5722]/45 py-1.5 px-2 pr-3.5 rounded-full hover:bg-white/15 transition-all duration-300 backdrop-blur-xs cursor-pointer"
                >
                  <img
                    src={avatarUrl}
                    alt="User"
                    className="w-8 h-8 rounded-full object-cover border border-[#ff5722]/50 shrink-0"
                  />
                  <span className="text-sm font-bold text-white truncate max-w-[150px] lg:max-w-[190px]">
                    {session.user.name}
                  </span>
                  <ChevronDown
                    size={14}
                    className={`text-gray-200 transition-transform duration-300 shrink-0 ${
                      isDropdownOpen ? "rotate-180 text-[#ff5722]" : ""
                    }`}
                  />
                </button>

                {/* Dropdown Menu */}
                {isDropdownOpen && (
                  <div className="absolute right-0 mt-3 w-68 bg-[#161616]/85 backdrop-blur-xl rounded-3xl shadow-[0_20px_50px_rgba(0,0,0,0.5)] border border-white/20 overflow-hidden animate-in fade-in slide-in-from-top-2">
                    <div className="p-4 border-b border-white/15 bg-gradient-to-r from-[#ff5722]/20 via-white/[0.04] to-transparent">
                      <p className="font-extrabold text-white truncate">
                        {session.user.name}
                      </p>
                      <p className="text-xs text-gray-300 truncate mb-2.5">
                        {session.user.email}
                      </p>
                      <span className="inline-flex items-center gap-1 px-2.5 py-1 bg-[#ff5722]/25 text-[#ff8a65] text-[10px] font-extrabold uppercase rounded-full tracking-wider border border-[#ff5722]/35">
                        <Sparkles size={10} /> {session.user.role}
                      </span>
                    </div>
                    <div className="p-2 flex flex-col gap-1">
                      <Link
                        href={dashboardLink}
                        onClick={() => setIsDropdownOpen(false)}
                        className="flex items-center gap-3 px-3.5 py-2.5 text-sm font-bold text-gray-200 hover:bg-white/10 hover:text-white rounded-2xl transition-colors"
                      >
                        <LayoutDashboard size={18} className="text-[#ff5722]" /> Dashboard
                      </Link>
                      <Link
                        href="/dashboard/profile"
                        onClick={() => setIsDropdownOpen(false)}
                        className="flex items-center gap-3 px-3.5 py-2.5 text-sm font-bold text-gray-200 hover:bg-white/10 hover:text-white rounded-2xl transition-colors"
                      >
                        <User size={18} className="text-[#ff5722]" /> Update Profile
                      </Link>
                      <div className="h-px bg-white/15 my-1" />
                      <button
                        onClick={handleSignOut}
                        className="flex items-center gap-3 px-3.5 py-2.5 text-sm font-bold text-red-300 hover:bg-red-500/15 hover:text-red-200 rounded-2xl transition-colors w-full text-left cursor-pointer"
                      >
                        <LogOut size={18} /> Sign Out
                      </button>
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Mobile Menu Toggle Button */}
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="md:hidden p-2 text-white bg-white/10 hover:bg-white/20 rounded-full border border-white/20 transition-colors cursor-pointer shrink-0"
            aria-label="Toggle Menu"
          >
            {isMobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>

        {/* Mobile Menu Dropdown */}
        {isMobileMenuOpen && (
          <div className="md:hidden mt-3 bg-[#161616]/85 backdrop-blur-xl rounded-3xl shadow-[0_20px_50px_rgba(0,0,0,0.45)] border border-white/20 overflow-hidden animate-in fade-in slide-in-from-top-4">
            <nav className="flex flex-col p-4 gap-2">
              {navItems.map((item) => {
                const isActive = pathname === item.href;
                return (
                  <Link
                    key={item.name}
                    href={item.href}
                    onClick={() => setIsMobileMenuOpen(false)}
                    className={`relative px-4 py-3 rounded-2xl text-sm font-bold transition-colors ${
                      isActive
                        ? "bg-gradient-to-r from-[#ff5722] to-[#ff6d3f] text-white shadow-md shadow-[#ff5722]/25"
                        : "text-gray-200 hover:bg-white/10 hover:text-white"
                    }`}
                  >
                    {item.name}
                  </Link>
                );
              })}

              <hr className="my-2 border-white/15" />

              {!session ? (
                <div className="flex flex-col gap-2.5">
                  <Link
                    href="/sign-in"
                    onClick={() => setIsMobileMenuOpen(false)}
                    className="px-4 py-3 text-center text-sm font-bold text-white bg-white/5 border border-white/20 rounded-2xl hover:bg-white/15 transition-colors"
                  >
                    Sign In
                  </Link>
                  <Link
                    href="/sign-up"
                    onClick={() => setIsMobileMenuOpen(false)}
                    className="px-4 py-3 text-center text-sm font-bold bg-gradient-to-r from-[#ff5722] to-[#ff6d3f] text-white rounded-2xl shadow-md shadow-[#ff5722]/30"
                  >
                    Sign Up
                  </Link>
                </div>
              ) : (
                <div className="flex flex-col gap-1.5">
                  <div className="flex items-center gap-3 px-4 py-3 rounded-2xl bg-white/10 border border-white/15 mb-1">
                    <img
                      src={avatarUrl}
                      alt="User"
                      className="w-10 h-10 rounded-full border border-[#ff5722]/40 shrink-0"
                    />
                    <div className="min-w-0">
                      <p className="font-bold text-sm text-white truncate">
                        {session.user.name}
                      </p>
                      <p className="text-[10px] uppercase font-extrabold text-[#ff8a65] tracking-wider">
                        {session.user.role}
                      </p>
                    </div>
                  </div>
                  <Link
                    href={dashboardLink}
                    onClick={() => setIsMobileMenuOpen(false)}
                    className="px-4 py-3 text-sm font-bold text-gray-200 hover:bg-white/10 hover:text-white rounded-2xl flex items-center gap-3 transition-colors"
                  >
                    <LayoutDashboard size={18} className="text-[#ff5722]" /> Dashboard
                  </Link>
                  <Link
                    href="/dashboard/profile"
                    onClick={() => setIsMobileMenuOpen(false)}
                    className="px-4 py-3 text-sm font-bold text-gray-200 hover:bg-white/10 hover:text-white rounded-2xl flex items-center gap-3 transition-colors"
                  >
                    <User size={18} className="text-[#ff5722]" /> Profile
                  </Link>
                  <button
                    onClick={() => {
                      setIsMobileMenuOpen(false);
                      handleSignOut();
                    }}
                    className="px-4 py-3 text-sm font-bold text-red-300 hover:bg-red-500/15 hover:text-red-200 rounded-2xl flex items-center gap-3 text-left transition-colors cursor-pointer"
                  >
                    <LogOut size={18} /> Sign Out
                  </button>
                </div>
              )}
            </nav>
          </div>
        )}
      </div>
    </header>
  );
}