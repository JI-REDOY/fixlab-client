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
  const pathname = usePathname();
  const router = useRouter();
  const sessionHook = authClient.useSession();
  const { data: session, isPending } = sessionHook;

  const checkRoleConfirmation = useCallback(async () => {
    if (!session?.user?.email) return;

    try {
      if (!localStorage.getItem("fixlab_token")) {
        await syncToken();
      }

      const meData = await fetchApi("/api/auth/me");
      const user = meData?.user || meData;

      if (user) {
        const currentRole = user.role || session.user.role || "customer";
        setDbRole(currentRole);

        const isAdmin = currentRole === "admin";
        const isConfirmed = Boolean(user.roleConfirmed);

        setShowRoleModal(!isAdmin && !isConfirmed);
      }
    } catch (err) {
      console.error("Failed to check role confirmation:", err);
    }
  }, [session?.user?.email, session?.user?.role]);

  useEffect(() => {
    if (session?.user?.email) {
      checkRoleConfirmation();
    }
  }, [session?.user?.email, checkRoleConfirmation]);

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

  const role: UserRole = normalizeRole(dbRole || (session.user as any)?.role);
  const displayName = session.user.name || "User";
  const avatarUrl =
    session.user.image ||
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
    <div className="min-h-screen bg-[#f8f9fa] flex relative overflow-hidden">
      <FloatingIcons />

      <div className="absolute top-0 left-0 w-[520px] h-[520px] bg-[#ff5722]/10 blur-[130px] rounded-full -translate-x-1/2 -translate-y-1/2 z-0 pointer-events-none" />
      <div className="absolute bottom-0 right-0 w-[520px] h-[520px] bg-[#ff5722]/8 blur-[130px] rounded-full translate-x-1/3 translate-y-1/3 z-0 pointer-events-none" />

      {isSidebarOpen && (
        <div
          className="fixed inset-0 bg-slate-950/35 z-40 lg:hidden backdrop-blur-xs transition-opacity"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}

      <div
        className={`fixed lg:sticky top-0 left-0 z-50 h-screen p-3 lg:p-4 transition-transform duration-300 ease-in-out ${
          isSidebarOpen
            ? "translate-x-0"
            : "-translate-x-full lg:translate-x-0"
        }`}
      >
        <div className="h-full flex flex-col">
          <div className="mb-3 flex items-center justify-between px-2">
            <Link
              href="/"
              onClick={() => setIsSidebarOpen(false)}
              className="flex items-center gap-2 group"
            >
              <div className="p-1.5 bg-white/90 rounded-xl border border-white/80 shadow-2xs group-hover:border-[#ff5722]/30 transition-all">
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
              className="lg:hidden p-1.5 rounded-xl bg-white/80 text-gray-700 hover:text-[#ff5722] cursor-pointer"
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
      </div>

      <main className="flex-1 flex flex-col min-w-0 relative z-10">
        <header className="h-20 bg-white/60 backdrop-blur-xl border-b border-white/75 flex items-center justify-between px-4 sm:px-8 sticky top-0 z-30">
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