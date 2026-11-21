"use client";

import { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname, useRouter } from "next/navigation";
import { authClient } from "@/lib/auth-client";
import { syncToken } from "@/lib/auth-token";
import { fetchApi } from "@/lib/api";
import FloatingIcons from "@/components/ui/FloatingIcons";
import RoleSelectionModal from "@/components/RoleSelectionModal";
import RoleSidebar from "@/app/(dashboard)/dashboard/RoleSidebar";
import RoleGuard from "@/app/(dashboard)/dashboard/RoleGuard";
import {
  normalizeRole,
  UserRole,
} from "@/app/(dashboard)/dashboard/RoleConfig";
import { Menu, Home, Sparkles, X } from "lucide-react";
import { toast } from "@/components/ui/CustomToast";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [showRoleModal, setShowRoleModal] = useState(false);
  const [dbRole, setDbRole] = useState<string | null>(null);
  const [isCheckingAuth, setIsCheckingAuth] = useState(true);
  const [hasVerifiedSession, setHasVerifiedSession] = useState(false);

  const pathname = usePathname();
  const router = useRouter();
  const sessionHook = authClient.useSession();
  const { data: session, isPending } = sessionHook;

  const checkRoleConfirmation = useCallback(async () => {
    const email = session?.user?.email;
    if (!email) return;

    try {
      if (!localStorage.getItem("fixlab_token")) {
        await syncToken();
      }

      const meData = await fetchApi("/api/auth/me");
      const user = meData?.user || meData;

      if (user) {
        const currentRole =
          user.role || (session?.user as any)?.role || "customer";
        setDbRole(currentRole);

        const isAdmin = currentRole === "admin";
        const isConfirmed =
          Boolean(user.roleConfirmed) ||
          Boolean((session?.user as any)?.roleConfirmed) ||
          currentRole === "technician";

        setShowRoleModal(!isAdmin && !isConfirmed);
      }
    } catch (err) {
      console.error("Failed to check role confirmation:", err);
    }
  }, [session?.user]);

  useEffect(() => {
    if (session?.user?.email) {
      setHasVerifiedSession(true);
      setIsCheckingAuth(false);
      checkRoleConfirmation();
    }
  }, [session?.user?.email, checkRoleConfirmation]);

  useEffect(() => {
    let active = true;

    const verifySessionOnLoad = async () => {
      if (isPending) return;

      if (session?.user) {
        if (active) {
          setHasVerifiedSession(true);
          setIsCheckingAuth(false);
        }
        return;
      }

      try {
        const res = await authClient.getSession();
        if (!active) return;

        if (res?.data?.user) {
          setHasVerifiedSession(true);
          setIsCheckingAuth(false);
        } else {
          setHasVerifiedSession(false);
          setIsCheckingAuth(false);
          const callbackUrl = encodeURIComponent(pathname || "/dashboard");
          router.replace(`/sign-in?callbackUrl=${callbackUrl}`);
        }
      } catch {
        if (!active) return;
        setHasVerifiedSession(false);
        setIsCheckingAuth(false);
        const callbackUrl = encodeURIComponent(pathname || "/dashboard");
        router.replace(`/sign-in?callbackUrl=${callbackUrl}`);
      }
    };

    verifySessionOnLoad();

    return () => {
      active = false;
    };
  }, [isPending, session?.user, pathname, router]);

  if (isPending || isCheckingAuth) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#f8f9fa]">
        <div className="w-10 h-10 border-4 border-[#ff5722] border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (!session && !hasVerifiedSession) return null;

  const role: UserRole = normalizeRole(dbRole || (session?.user as any)?.role);
  const displayName = session?.user?.name || "User";
  const avatarUrl =
    session?.user?.image ||
    `https://ui-avatars.com/api/?name=${encodeURIComponent(
      displayName
    )}&background=ff5722&color=fff&bold=true`;

  const handleSelectRole = async (selectedRole: "customer" | "technician") => {
    const res = await fetchApi("/api/auth/role", {
      method: "PATCH",
      body: JSON.stringify({ role: selectedRole }),
    });

    if (res?.token) {
      localStorage.setItem("fixlab_token", res.token);
    } else {
      await syncToken();
    }

    if (typeof sessionHook.refetch === "function") {
      await sessionHook.refetch();
    }

    setDbRole(selectedRole);
    setShowRoleModal(false);
    toast.success(`Joined as ${selectedRole}`);

    router.push(
      selectedRole === "technician"
        ? "/dashboard/technician"
        : "/dashboard/customer"
    );
    router.refresh();
  };

  const pageLabelsByPrefix: Record<string, string> = {
    "/dashboard/profile": "Update Profile",
    "/dashboard/customer/bookings": "My Bookings",
    "/dashboard/customer/payments": "Payments",
    "/dashboard/technician/add-service": "Add Service",
    "/dashboard/technician/my-services": "My Services",
    "/dashboard/technician/services": "My Services",
    "/dashboard/technician/requests": "Requests",
    "/dashboard/technician/transactions": "Transactions",
    "/dashboard/admin/users": "Users",
    "/dashboard/admin/role-requests": "Role Requests",
    "/dashboard/admin/services": "Services",
    "/dashboard/admin/bookings": "Bookings",
    "/dashboard/admin/transactions": "Transactions",
  };

  const currentPageLabel =
    pageLabelsByPrefix[pathname] ||
    Object.entries(pageLabelsByPrefix).find(([route]) =>
      pathname.startsWith(`${route}/`)
    )?.[1] ||
    "Overview";

  const handleSignOut = async () => {
    await authClient.signOut();
    localStorage.removeItem("fixlab_token");
    toast.success("Signed out");
    router.push("/");
  };

  const getAllowedRolesForPath = (): UserRole[] => {
    if (pathname.startsWith("/dashboard/admin")) return ["admin"];
    if (pathname.startsWith("/dashboard/technician")) return ["technician"];
    if (pathname.startsWith("/dashboard/customer")) return ["customer"];
    return ["customer", "technician", "admin"];
  };

  return (
    <div className="min-h-screen bg-[#f8f9fa] flex relative">
      <div className="fixed inset-0 z-0 pointer-events-none select-none">
        <FloatingIcons />
      </div>

      {isSidebarOpen && (
        <div
          className="fixed inset-0 bg-slate-950/35 z-40 lg:hidden"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}

      <aside
        className={`fixed lg:sticky top-0 left-0 z-50 lg:z-30 h-screen p-3 lg:p-4 transition-transform duration-200 ${
          isSidebarOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"
        }`}
      >
        <div className="h-full flex flex-col">
          <div className="mb-3 flex items-center justify-between px-2">
            <Link
              href="/"
              onClick={() => setIsSidebarOpen(false)}
              className="flex items-center gap-2"
            >
              <div className="p-1.5 bg-white rounded-xl border border-slate-200/80">
                <Image
                  src="/icon-whiteTheme.png"
                  alt="FixLab"
                  width={26}
                  height={26}
                  className="object-contain w-auto h-auto"
                />
              </div>
              <Image
                src="/fixlab-logo-black-transparent-4x.png"
                alt="FixLab"
                width={88}
                height={26}
                className="object-contain w-auto h-auto"
              />
            </Link>

            <button
              type="button"
              onClick={() => setIsSidebarOpen(false)}
              aria-label="Close menu"
              className="lg:hidden p-1.5 rounded-xl bg-white text-gray-700 hover:text-[#ff5722] cursor-pointer"
            >
              <X size={18} />
            </button>
          </div>

          <div className="flex-1 min-h-0">
            <RoleSidebar
              role={role}
              userName={displayName}
              userImage={avatarUrl}
              onSignOut={handleSignOut}
            />
          </div>
        </div>
      </aside>

      <main className="flex-1 flex flex-col min-w-0 relative z-10">
        <header className="h-20 bg-white border-b border-slate-200/80 flex items-center justify-between px-4 sm:px-8 sticky top-0 z-20">
          <div className="flex items-center gap-3 sm:gap-5 min-w-0">
            <button
              type="button"
              onClick={() => setIsSidebarOpen(true)}
              aria-label="Open menu"
              className="lg:hidden p-2 -ml-2 text-gray-700 hover:bg-slate-100 rounded-xl cursor-pointer"
            >
              <Menu size={22} />
            </button>

            <Link
              href="/"
              className="text-xs sm:text-sm font-bold text-gray-600 hover:text-[#ff5722] flex items-center gap-1.5 shrink-0"
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
              className="w-10 h-10 rounded-full border border-slate-200 object-cover"
            />
          </div>
        </header>

        <div className="p-4 sm:p-8 flex-1">
          <RoleGuard allowedRoles={getAllowedRolesForPath()}>
            {children}
          </RoleGuard>
        </div>
      </main>

      <RoleSelectionModal
        isOpen={showRoleModal}
        userName={displayName}
        onSelectRole={handleSelectRole}
      />
    </div>
  );
}