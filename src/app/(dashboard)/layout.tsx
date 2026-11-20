"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname, useRouter } from "next/navigation";
import { authClient } from "@/lib/auth-client";
import { syncToken } from "@/lib/auth-token";
import FloatingIcons from "@/components/ui/FloatingIcons";
import {
  Menu,
  Home,
  LayoutDashboard,
  FileText,
  Settings,
  LogOut,
  Users,
  Wrench,
  CreditCard,
  Briefcase,
  ChevronRight,
  Sparkles,
} from "lucide-react";
import { toast } from "sonner";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const pathname = usePathname();
  const router = useRouter();
  const { data: session, isPending } = authClient.useSession();

  // ✅ সেশন থাকলে এবং টোকেন না থাকলে সিঙ্ক করবে
  useEffect(() => {
    if (session && !localStorage.getItem("fixlab_token")) {
      syncToken();
    }
  }, [session]);

  useEffect(() => {
    if (!isPending && !session) {
      router.push("/sign-in");
    }
  }, [isPending, session, router]);

  if (isPending) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#f8f9fa]">
        <div className="w-10 h-10 border-4 border-[#ff5722] border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (!session) return null;

  const role = session.user.role || "customer";
  const displayName = session.user.name || "User";
  const avatarUrl =
    session.user.image ||
    `https://ui-avatars.com/api/?name=${encodeURIComponent(
      displayName
    )}&background=ff5722&color=fff&bold=true`;

  const menuItems = {
    customer: [
      { name: "Overview", href: "/dashboard/customer", icon: LayoutDashboard },
      {
        name: "My Bookings",
        href: "/dashboard/customer/bookings",
        icon: FileText,
      },
      {
        name: "Payments",
        href: "/dashboard/customer/payments",
        icon: CreditCard,
      },
    ],
    technician: [
      { name: "Overview", href: "/dashboard/technician", icon: LayoutDashboard },
      {
        name: "Add Service",
        href: "/dashboard/technician/add-service",
        icon: Wrench,
      },
      {
        name: "My Services",
        href: "/dashboard/technician/my-services",
        icon: Briefcase,
      },
      {
        name: "Requests",
        href: "/dashboard/technician/requests",
        icon: FileText,
      },
    ],
    admin: [
      { name: "Overview", href: "/dashboard/admin", icon: LayoutDashboard },
      { name: "Users", href: "/dashboard/admin/users", icon: Users },
      { name: "Services", href: "/dashboard/admin/services", icon: Wrench },
      { name: "Bookings", href: "/dashboard/admin/bookings", icon: FileText },
      {
        name: "Transactions",
        href: "/dashboard/admin/transactions",
        icon: CreditCard,
      },
    ],
  };

  const activeMenu =
    menuItems[role as keyof typeof menuItems] || menuItems.customer;

  const overviewRoutes = [
    "/dashboard/customer",
    "/dashboard/technician",
    "/dashboard/admin",
  ];

  const isMenuActive = (href: string) => {
    if (pathname === href) return true;
    if (!overviewRoutes.includes(href) && pathname.startsWith(`${href}/`)) {
      return true;
    }
    return false;
  };

  const currentPageLabel =
    pathname === "/dashboard/profile"
      ? "Update Profile"
      : activeMenu.find((m) => isMenuActive(m.href))?.name || "Dashboard";

  const handleSignOut = async () => {
    await authClient.signOut();
    localStorage.removeItem("fixlab_token");
    toast.success("Signed out");
    router.push("/");
  };

  return (
    <div className="min-h-screen bg-[#f8f9fa] flex relative overflow-hidden">
      {/* Floating Background Icons */}
      <FloatingIcons />

      {/* Ambient Orange Glows */}
      <div className="absolute top-0 left-0 w-[520px] h-[520px] bg-[#ff5722]/10 blur-[130px] rounded-full -translate-x-1/2 -translate-y-1/2 z-0 pointer-events-none" />
      <div className="absolute bottom-0 right-0 w-[520px] h-[520px] bg-[#ff5722]/8 blur-[130px] rounded-full translate-x-1/3 translate-y-1/3 z-0 pointer-events-none" />

      {/* Mobile Sidebar Backdrop */}
      {isSidebarOpen && (
        <div
          className="fixed inset-0 bg-black/25 z-40 lg:hidden backdrop-blur-xs transition-opacity"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}

      {/* Sidebar - Glassmorphism */}
      <aside
        className={`fixed lg:sticky top-0 left-0 z-50 h-screen w-[280px] bg-white/65 backdrop-blur-xl border-r border-white/80 shadow-[4px_0_24px_rgba(0,0,0,0.03)] flex flex-col transition-transform duration-300 ease-in-out ${
          isSidebarOpen
            ? "translate-x-0"
            : "-translate-x-full lg:translate-x-0"
        }`}
      >
        {/* Logo */}
        <div className="h-20 flex items-center px-6 border-b border-white/50">
          <Link
            href="/"
            onClick={() => setIsSidebarOpen(false)}
            className="flex items-center gap-2.5 group"
          >
            <div className="p-1.5 bg-white/85 rounded-xl border border-white/70 shadow-2xs group-hover:border-[#ff5722]/30 transition-all">
              <Image
                src="/icon-whiteTheme.png"
                alt="FixLab"
                width={28}
                height={28}
                className="object-contain"
              />
            </div>
            <Image
              src="/fixlab-logo-black-transparent-4x.png"
              alt="FixLab"
              width={92}
              height={28}
              className="object-contain"
            />
          </Link>
        </div>

        {/* Menu Items */}
        <div className="flex-1 overflow-y-auto py-6 px-4 flex flex-col gap-1.5">
          <p className="px-4 text-[10px] font-extrabold text-gray-500 uppercase tracking-wider mb-2">
            Menu
          </p>

          {activeMenu.map((item) => {
            const isActive = isMenuActive(item.href);
            const IconComponent = item.icon;

            return (
              <Link
                key={item.name}
                href={item.href}
                onClick={() => setIsSidebarOpen(false)}
                className={`flex items-center justify-between px-4 py-3 rounded-2xl text-sm font-bold transition-all duration-300 ${
                  isActive
                    ? "bg-gradient-to-r from-[#ff5722] to-[#ff6d3f] text-white shadow-[0_6px_18px_rgba(255,87,34,0.28)]"
                    : "text-gray-700 hover:bg-white/80 hover:text-[#ff5722] border border-transparent hover:border-white/60"
                }`}
              >
                <div className="flex items-center gap-3">
                  <IconComponent
                    size={19}
                    className={isActive ? "text-white" : "text-gray-500"}
                  />
                  <span>{item.name}</span>
                </div>
                {isActive && (
                  <ChevronRight size={16} className="text-white/80 shrink-0" />
                )}
              </Link>
            );
          })}

          {/* Bottom Actions */}
          <div className="mt-auto pt-6 border-t border-white/50 flex flex-col gap-1">
            <Link
              href="/dashboard/profile"
              onClick={() => setIsSidebarOpen(false)}
              className={`flex items-center gap-3 px-4 py-3 rounded-2xl text-sm font-bold transition-all ${
                pathname === "/dashboard/profile"
                  ? "bg-gradient-to-r from-[#ff5722] to-[#ff6d3f] text-white shadow-[0_6px_18px_rgba(255,87,34,0.28)]"
                  : "text-gray-700 hover:bg-white/80 hover:text-[#ff5722]"
              }`}
            >
              <Settings
                size={19}
                className={
                  pathname === "/dashboard/profile"
                    ? "text-white"
                    : "text-gray-500"
                }
              />
              <span>Update Profile</span>
            </Link>

            <button
              type="button"
              onClick={handleSignOut}
              className="w-full flex items-center gap-3 px-4 py-3 rounded-2xl text-sm font-bold text-red-600 hover:bg-red-50/90 transition-all cursor-pointer"
            >
              <LogOut size={19} />
              <span>Sign Out</span>
            </button>
          </div>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 flex flex-col min-w-0 relative z-10">
        {/* Topbar - Glassmorphism */}
        <header className="h-20 bg-white/50 backdrop-blur-xl border-b border-white/70 flex items-center justify-between px-4 sm:px-8 sticky top-0 z-30">
          <div className="flex items-center gap-3 sm:gap-5 min-w-0">
            <button
              type="button"
              onClick={() => setIsSidebarOpen(true)}
              aria-label="Open menu"
              className="lg:hidden p-2 -ml-2 text-gray-700 hover:bg-white/80 rounded-xl transition-colors cursor-pointer"
            >
              <Menu size={22} />
            </button>

            <Link
              href="/"
              className="text-xs sm:text-sm font-bold text-gray-600 hover:text-[#ff5722] flex items-center gap-1.5 transition-colors shrink-0"
            >
              <Home size={16} className="text-[#ff5722]" />
              <span>Back to Home</span>
            </Link>

            <span className="hidden sm:inline text-gray-300">/</span>

            <span className="hidden sm:inline-flex items-center gap-1.5 text-sm font-extrabold text-gray-900 truncate">
              <Sparkles size={14} className="text-[#ff5722]" />
              {currentPageLabel}
            </span>
          </div>

          <div className="flex items-center gap-3 shrink-0">
            <div className="text-right hidden sm:block">
              <p className="text-sm font-extrabold text-gray-900 leading-tight">
                {displayName}
              </p>
              <p className="text-[10px] font-extrabold text-[#ff5722] uppercase tracking-wider mt-0.5">
                {role}
              </p>
            </div>
            <img
              src={avatarUrl}
              alt={displayName}
              className="w-10 h-10 rounded-full border-2 border-white shadow-xs object-cover"
            />
          </div>
        </header>

        {/* Page Content */}
        <div className="p-4 sm:p-8 flex-1">{children}</div>
      </main>
    </div>
  );
}