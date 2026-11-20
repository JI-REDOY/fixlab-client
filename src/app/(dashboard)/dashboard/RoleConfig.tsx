"use client";

import {
  LayoutDashboard,
  Wrench,
  ClipboardList,
  CreditCard,
  PlusCircle,
  Briefcase,
  UserCheck,
  ShieldCheck,
  UserCog,
} from "lucide-react";

export type UserRole = "customer" | "technician" | "admin";

export interface NavItem {
  label: string;
  href: string;
  icon: typeof LayoutDashboard;
}

export const ROLE_NAV_ITEMS: Record<UserRole, NavItem[]> = {
  customer: [
    {
      label: "Overview",
      href: "/dashboard/customer",
      icon: LayoutDashboard,
    },
    {
      label: "Browse Services",
      href: "/services",
      icon: Wrench,
    },
    {
      label: "My Bookings",
      href: "/dashboard/customer/bookings",
      icon: ClipboardList,
    },
    {
      label: "Payments",
      href: "/dashboard/customer/payments",
      icon: CreditCard,
    },
    {
      label: "Update Profile",
      href: "/dashboard/profile",
      icon: UserCog,
    },
  ],
  technician: [
    {
      label: "Overview",
      href: "/dashboard/technician",
      icon: LayoutDashboard,
    },
    {
      label: "Add Service",
      href: "/dashboard/technician/add-service",
      icon: PlusCircle,
    },
    {
      label: "My Services",
      href: "/dashboard/technician/my-services",
      icon: Briefcase,
    },
    {
      label: "Requests",
      href: "/dashboard/technician/requests",
      icon: ClipboardList,
    },
    {
      label: "Update Profile",
      href: "/dashboard/profile",
      icon: UserCog,
    },
  ],
  admin: [
    {
      label: "Overview",
      href: "/dashboard/admin",
      icon: LayoutDashboard,
    },
    {
      label: "Role Requests",
      href: "/dashboard/admin/role-requests",
      icon: UserCheck,
    },
    {
      label: "Manage Services",
      href: "/dashboard/admin/services",
      icon: ShieldCheck,
    },
    {
      label: "Update Profile",
      href: "/dashboard/profile",
      icon: UserCog,
    },
  ],
};

export function normalizeRole(role?: string | null): UserRole {
  if (role === "technician" || role === "admin" || role === "customer") {
    return role;
  }
  return "customer";
}

export function RoleBadge({ role }: { role?: string | null }) {
  const normalized = normalizeRole(role);

  const styles: Record<UserRole, string> = {
    customer: "bg-sky-500/12 text-sky-800 border-sky-500/25",
    technician: "bg-[#ff5722]/12 text-[#ff5722] border-[#ff5722]/25",
    admin: "bg-emerald-500/12 text-emerald-800 border-emerald-500/25",
  };

  return (
    <span
      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-[10px] font-extrabold uppercase tracking-wider border ${styles[normalized]}`}
    >
      {normalized}
    </span>
  );
}