"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname, useRouter } from "next/navigation";
import { authClient } from "@/lib/auth-client";
import { 
  Menu, Home, LayoutDashboard, FileText, Settings, 
  LogOut, Users, Wrench, CreditCard, Briefcase
} from "lucide-react";
import { toast } from "sonner";

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const pathname = usePathname();
  const router = useRouter();
  const { data: session, isPending } = authClient.useSession();

  useEffect(() => {
    if (!isPending && !session) {
      router.push("/sign-in");
    }
  }, [isPending, session, router]);

  if (isPending) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#F8F9FA]">
        <div className="w-10 h-10 border-4 border-fixlab-green border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  if (!session) return null;

  const role = session.user.role || "customer";
  
  const avatarUrl = session.user.image || `https://ui-avatars.com/api/?name=${encodeURIComponent(session.user.name)}&background=1A432A&color=fff&bold=true`;

  const menuItems = {
    customer: [
      { name: "Overview", href: "/dashboard/customer", icon: LayoutDashboard },
      { name: "My Bookings", href: "/dashboard/customer/bookings", icon: FileText },
      { name: "Payments", href: "/dashboard/customer/payments", icon: CreditCard },
    ],
    technician: [
      { name: "Overview", href: "/dashboard/technician", icon: LayoutDashboard },
      { name: "Add Service", href: "/dashboard/technician/add-service", icon: Wrench },
      { name: "My Services", href: "/dashboard/technician/my-services", icon: Briefcase },
      { name: "Requests", href: "/dashboard/technician/requests", icon: FileText },
    ],
    admin: [
      { name: "Overview", href: "/dashboard/admin", icon: LayoutDashboard },
      { name: "Users", href: "/dashboard/admin/users", icon: Users },
      { name: "Services", href: "/dashboard/admin/services", icon: Wrench },
      { name: "Bookings", href: "/dashboard/admin/bookings", icon: FileText },
      { name: "Transactions", href: "/dashboard/admin/transactions", icon: CreditCard },
    ],
  };

  const activeMenu = menuItems[role as keyof typeof menuItems] || menuItems.customer;

  const handleSignOut = async () => {
    await authClient.signOut();
    localStorage.removeItem("fixlab_token");
    toast.success("Signed out");
    router.push("/");
  };

  return (
    <div className="min-h-screen bg-[#F8F9FA] flex">
      {isSidebarOpen && (
        <div 
          className="fixed inset-0 bg-black/20 z-40 lg:hidden backdrop-blur-sm"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}

      <aside className={`fixed lg:sticky top-0 left-0 z-50 h-screen w-[280px] bg-white border-r border-gray-100 flex flex-col transition-transform duration-300 ease-in-out ${isSidebarOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"}`}>
        
        <div className="h-20 flex items-center px-6 border-b border-gray-50">
          <Link href="/" className="flex items-center gap-2">
            <Image 
              src="/fixlab-icon.png" 
              alt="FixLab" 
              width={32} 
              height={32} 
              className="rounded-lg object-contain" 
              style={{ width: "auto", height: "auto" }}
            />
            <Image 
              src="/fixlab-logo.png" 
              alt="FixLab" 
              width={100} 
              height={32} 
              className="object-contain hidden sm:block" 
              style={{ width: "auto", height: "auto" }}
            />
          </Link>
        </div>

        <div className="flex-1 overflow-y-auto py-6 px-4 flex flex-col gap-2">
          <p className="px-4 text-xs font-bold text-fixlab-gray uppercase tracking-wider mb-2">Menu</p>
          {activeMenu.map((item) => {
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.name}
                href={item.href}
                onClick={() => setIsSidebarOpen(false)}
                className={`flex items-center gap-3 px-4 py-3 rounded-2xl text-sm font-bold transition-all duration-200 ${
                  isActive 
                    ? "bg-fixlab-green text-white shadow-md shadow-fixlab-green/20" 
                    : "text-fixlab-charcoal hover:bg-fixlab-cream"
                }`}
              >
                <item.icon size={20} className={isActive ? "text-white" : "text-fixlab-gray"} />
                {item.name}
              </Link>
            );
          })}

          <div className="mt-auto pt-6 border-t border-gray-100">
            <Link href="/dashboard/profile" className="flex items-center gap-3 px-4 py-3 rounded-2xl text-sm font-bold text-fixlab-charcoal hover:bg-fixlab-cream transition-all">
              <Settings size={20} className="text-fixlab-gray" /> Update Profile
            </Link>
            <button onClick={handleSignOut} className="w-full flex items-center gap-3 px-4 py-3 rounded-2xl text-sm font-bold text-red-500 hover:bg-red-50 transition-all mt-1">
              <LogOut size={20} /> Sign Out
            </button>
          </div>
        </div>
      </aside>

      <main className="flex-1 flex flex-col min-w-0">
        <header className="h-20 bg-white/80 backdrop-blur-md border-b border-gray-100 flex items-center justify-between px-4 sm:px-8 sticky top-0 z-30">
          <div className="flex items-center gap-4">
            <button onClick={() => setIsSidebarOpen(true)} className="lg:hidden p-2 -ml-2 text-fixlab-charcoal">
              <Menu size={24} />
            </button>
            <Link href="/" className="text-sm font-bold text-fixlab-gray hover:text-fixlab-green flex items-center gap-2">
              <Home size={16} /> Back to Home
            </Link>
          </div>

          <div className="flex items-center gap-3">
            <div className="text-right hidden sm:block">
              <p className="text-sm font-bold text-fixlab-charcoal">{session.user.name}</p>
              <p className="text-xs text-fixlab-gray capitalize">{role}</p>
            </div>
            {/* এখানেও next/image এর বদলে সাধারণ img ট্যাগ */}
            <img
              src={avatarUrl}
              alt="User"
              className="rounded-full border-2 border-fixlab-mint object-cover"
              style={{ width: "40px", height: "40px" }}
            />
          </div>
        </header>

        <div className="p-4 sm:p-8 flex-1">
          {children}
        </div>
      </main>
    </div>
  );
}