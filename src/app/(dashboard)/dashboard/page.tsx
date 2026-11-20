"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { authClient } from "@/lib/auth-client";
import { fetchApi, syncToken } from "@/lib/api";
import { Loader2 } from "lucide-react";

export default function DashboardIndexPage() {
  const router = useRouter();
  const { data: session, isPending } = authClient.useSession();

  useEffect(() => {
    if (isPending) return;

    if (!session?.user?.email) {
      router.replace("/sign-in");
      return;
    }

    let cancelled = false;

    const resolveRoleAndRedirect = async () => {
      try {
        await syncToken(true);
        const meData = await fetchApi("/api/auth/me");
        const role =
          meData?.user?.role || (session.user as any)?.role || "customer";

        if (!cancelled) {
          if (role === "technician") {
            router.replace("/dashboard/technician");
          } else if (role === "admin") {
            router.replace("/dashboard/admin");
          } else {
            router.replace("/dashboard/customer");
          }
        }
      } catch {
        const fallbackRole = (session.user as any)?.role || "customer";
        if (!cancelled) {
          if (fallbackRole === "technician") {
            router.replace("/dashboard/technician");
          } else if (fallbackRole === "admin") {
            router.replace("/dashboard/admin");
          } else {
            router.replace("/dashboard/customer");
          }
        }
      }
    };

    resolveRoleAndRedirect();

    return () => {
      cancelled = true;
    };
  }, [session, isPending, router]);

  return (
    <div className="min-h-[60vh] flex flex-col items-center justify-center gap-3">
      <Loader2 className="animate-spin text-[#ff5722]" size={38} />
      <p className="text-xs font-extrabold uppercase tracking-wider text-gray-600">
        Redirecting to your dashboard...
      </p>
    </div>
  );
}