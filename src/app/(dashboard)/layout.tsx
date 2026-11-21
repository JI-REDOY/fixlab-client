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
import { Menu, Home, Sparkles, X, ShieldCheck } from "lucide-react";
import { toast } from "@/components/ui/CustomToast";

const GOOGLE_OAUTH_PENDING_KEY = "fixlab_google_oauth_pending";

function checkProStatus(payload: any): boolean {
  if (!payload || typeof payload !== "object") return false;

  const targets = [
    payload,
    payload?.user,
    payload?.data,
    payload?.data?.user,
    payload?.profile,
    payload?.subscription,
  ].filter(Boolean);

  for (const item of targets) {
    const planVal = String(
      item?.plan || item?.subscriptionPlan || item?.tier || ""
    )
      .trim()
      .toLowerCase();

    const statusVal = String(
      item?.subscriptionStatus || item?.proStatus || item?.status || ""
    )
      .trim()
      .toLowerCase();

    const hasProFlag = Boolean(
      item?.isVerifiedPro ||
        item?.isPro ||
        item?.pro ||
        planVal === "pro" ||
        planVal.includes("pro") ||
        statusVal === "pro"
    );

    if (!hasProFlag) continue;

    const expiresAt =
      item?.proExpiresAt ||
      item?.subscriptionExpiresAt ||
      item?.expiresAt ||
      null;

    if (expiresAt) {
      const expiryMs = new Date(expiresAt).getTime();
      if (!Number.isNaN(expiryMs) && expiryMs <= Date.now()) {
        continue;
      }
    }

    return true;
  }

  return false;
}

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [showRoleModal, setShowRoleModal] = useState(false);
  const [dbRole, setDbRole] = useState<string | null>(null);
  const [plan, setPlan] = useState<"free" | "pro">("free");
  const [isVerifiedPro, setIsVerifiedPro] = useState(false);
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

        const proActive =
          checkProStatus(user) ||
          checkProStatus(meData) ||
          checkProStatus(session);

        setPlan(proActive || user.plan === "pro" ? "pro" : "free");
        setIsVerifiedPro(Boolean(user.isVerifiedPro) || proActive);

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
  }, [session]);

  useEffect(() => {
    if (session?.user?.email) {
      setHasVerifiedSession(true);
      setIsCheckingAuth(false);
      checkRoleConfirmation();
    }
  }, [session?.user?.email, checkRoleConfirmation]);

  useEffect(() => {
    if (!session?.user || typeof window === "undefined") return;
    if (sessionStorage.getItem(GOOGLE_OAUTH_PENDING_KEY) !== "1") return;

    sessionStorage.removeItem(GOOGLE_OAUTH_PENDING_KEY);
    const timer = window.setTimeout(() => {
      toast.welcome(session.user.name, { duration: 2600 });
    }, 150);

    return () => window.clearTimeout(timer);
  }, [session?.user]);

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
      <div className="min-h-screen flex items-center justify-center bg-[#f8f9fa]/75 backdrop-blur-[1px]">
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

  const effectivePlan =
    plan === "pro" || isVerifiedPro || checkProStatus(session) ? "pro" : "free";

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
    "/dashboard/technician/pro": "Get Pro",
    "/dashboard/admin/users": "Users",
    "/dashboard/admin/role-requests": "Role Requests",
    "/dashboard/admin/services": "Services",
    "/dashboard/admin/bookings": "Bookings",
    "/dashboard/admin/transactions": "Transactions",
    "/dashboard/admin/pro-payments": "Pro Payments",
  };

  const currentPageLabel =
    pageLabelsByPrefix[pathname] ||
    Object.entries(pageLabelsByPrefix).find(([route]) =>
      pathname.startsWith(`${route}/`)
    )?.[1] ||
    "Overview";

  const handleSignOut = async () => {
    if (typeof window !== "undefined") {
      sessionStorage.removeItem(GOOGLE_OAUTH_PENDING_KEY);
      localStorage.removeItem("fixlab_token");
      localStorage.removeItem("fixlab_pro_subscription");
    }
    await authClient.signOut();
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
    <div className="min-h-screen bg-[#f8f9fa]/65 flex flex-col relative">
      <div className="fixed inset-0 z-0 pointer-events-none select-none opacity-60">
        <FloatingIcons />
      </div>

      {/* Full-width Top Navbar with FixLab Logo on the left */}
      <header className="w-full h-20 bg-white/75 backdrop-blur-[1px] border-b border-slate-200/80 flex items-center justify-between px-4 sm:px-6 sticky top-0 z-40">
        <div className="flex items-center gap-3 sm:gap-5 min-w-0">
          <button
            type="button"
            onClick={() => setIsSidebarOpen((prev) => !prev)}
            aria-label="Toggle menu"
            className="lg:hidden p-2 -ml-1 text-gray-700 hover:bg-white/60 rounded-xl cursor-pointer shrink-0"
          >
            {isSidebarOpen ? <X size={22} /> : <Menu size={22} />}
          </button>

          <Link
            href="/"
            onClick={() => setIsSidebarOpen(false)}
            className="flex items-center gap-2 shrink-0"
          >
            <Image
              src="/icon-whiteTheme.png"
              alt="FixLab"
              width={26}
              height={26}
              className="object-contain w-auto h-auto"
            />
            <Image
              src="/fixlab-logo-black-transparent-4x.png"
              alt="FixLab"
              width={88}
              height={26}
              className="object-contain w-auto h-auto"
            />
          </Link>

          <span className="hidden md:inline text-gray-300">|</span>

          <Link
            href="/"
            className="hidden sm:flex text-xs sm:text-sm font-bold text-gray-600 hover:text-[#ff5722] items-center gap-1.5 shrink-0"
          >
            <Home size={16} className="text-[#ff5722]" />
            <span>Back to Home</span>
          </Link>

          <span className="hidden md:inline text-gray-300">/</span>

          <span className="hidden md:inline-flex items-center gap-1.5 text-sm font-extrabold text-gray-900 truncate">
            <Sparkles size={14} className="text-[#ff5722]" />
            {currentPageLabel}
          </span>
        </div>

        <div className="flex items-center gap-3 shrink-0">
          <div className="text-right hidden sm:block">
            <div className="flex items-center justify-end gap-1.5">
              <p className="text-sm font-extrabold text-gray-900 leading-tight">
                {displayName}
              </p>
              {role === "technician" && (isVerifiedPro || plan === "pro") && (
                <span className="inline-flex items-center gap-1 rounded-full bg-emerald-100/90 text-emerald-800 px-2 py-0.5 text-[10px] font-bold">
                  <ShieldCheck className="w-3 h-3" />
                  <span>Verified Pro</span>
                </span>
              )}
            </div>
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

      {/* Body below Full-width Top Nav */}
      <div className="flex-1 flex min-h-[calc(100vh-5rem)] relative z-10">
        {isSidebarOpen && (
          <div
            className="fixed inset-x-0 top-20 bottom-0 bg-slate-950/35 backdrop-blur-[1px] z-30 lg:hidden"
            onClick={() => setIsSidebarOpen(false)}
          />
        )}

        <aside
          className={`fixed lg:sticky top-20 left-0 z-30 h-[calc(100vh-5rem)] p-0 bg-[#f8f9fa]/75 lg:bg-transparent backdrop-blur-[1px] lg:backdrop-blur-none transition-transform duration-200 flex flex-col ${
            isSidebarOpen
              ? "translate-x-0"
              : "-translate-x-full lg:translate-x-0"
          }`}
        >
          <div className="flex-1 min-h-0 flex">
            <RoleSidebar
              role={role}
              userName={displayName}
              userImage={avatarUrl}
              plan={effectivePlan}
              onSignOut={handleSignOut}
            />
          </div>
        </aside>

        <main className="flex-1 flex flex-col min-w-0">
          <div className="p-4 sm:p-8 flex-1">
            <RoleGuard allowedRoles={getAllowedRolesForPath()}>
              {children}
            </RoleGuard>
          </div>
        </main>
      </div>

      <RoleSelectionModal
        isOpen={showRoleModal}
        userName={displayName}
        onSelectRole={handleSelectRole}
      />
    </div>
  );
}