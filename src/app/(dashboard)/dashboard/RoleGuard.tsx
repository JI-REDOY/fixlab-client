"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { authClient } from "@/lib/auth-client";
import { normalizeRole, UserRole } from "./RoleConfig";
import { Loader2 } from "lucide-react";

interface RoleGuardProps {
  allowedRoles: UserRole[];
  children: React.ReactNode;
}

export default function RoleGuard({ allowedRoles, children }: RoleGuardProps) {
  const router = useRouter();
  const { data: session, isPending } = authClient.useSession();
  const currentRole = normalizeRole((session?.user as any)?.role);

  useEffect(() => {
    if (!isPending && session?.user && !allowedRoles.includes(currentRole)) {
      router.replace(`/dashboard/${currentRole}`);
    }
  }, [isPending, session, currentRole, allowedRoles, router]);

  if (isPending || (session?.user && !allowedRoles.includes(currentRole))) {
    return (
      <div className="flex justify-center py-24">
        <Loader2 className="animate-spin text-[#ff5722]" size={38} />
      </div>
    );
  }

  return <>{children}</>;
}