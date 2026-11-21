"use client";

import { useState, useEffect, useCallback } from "react";
import { toast } from "@/components/ui/CustomToast";
import { fetchApi } from "@/lib/api";
import Pagination from "@/components/ui/Pagination";
import {
  Loader2,
  Sparkles,
  Users,
  Mail,
  ShieldCheck,
  UserCog,
} from "lucide-react";

const PAGE_SIZE = 6;

interface AdminUserItem {
  _id: string;
  name?: string;
  email?: string;
  image?: string;
  role: string;
}

export default function ManageUsersPage() {
  const [users, setUsers] = useState<AdminUserItem[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [updatingId, setUpdatingId] = useState<string | null>(null);

  const loadUsers = useCallback(() => {
    setLoading(true);
    fetchApi("/api/admin/users")
      .then((data) => {
        const list = Array.isArray(data)
          ? data
          : Array.isArray(data?.users)
          ? data.users
          : Array.isArray(data?.data)
          ? data.data
          : [];
        setUsers(list);
      })
      .catch((err: any) => {
        toast.error(err?.message || "Failed to load users");
        setUsers([]);
      })
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    loadUsers();
  }, [loadUsers]);

  const handleRoleChange = async (id: string, newRole: string) => {
    setUpdatingId(id);
    try {
      await fetchApi(`/api/admin/users/${id}/role`, {
        method: "PATCH",
        body: JSON.stringify({ role: newRole }),
      });
      setUsers((prev) =>
        prev.map((u) => (u._id === id ? { ...u, role: newRole } : u))
      );
      toast.success(`User role updated to ${newRole}`);
    } catch (err: any) {
      toast.error(err?.message || "Failed to update role");
    } finally {
      setUpdatingId(null);
    }
  };

  const totalPages = Math.max(1, Math.ceil(users.length / PAGE_SIZE));
  const safePage = Math.min(currentPage, totalPages);
  const paginatedUsers = users.slice(
    (safePage - 1) * PAGE_SIZE,
    safePage * PAGE_SIZE
  );

  if (loading) {
    return (
      <div className="flex justify-center py-24">
        <Loader2 className="animate-spin text-[#ff5722]" size={42} />
      </div>
    );
  }

  return (
    <div className="space-y-8 relative z-10">
      <div className="relative overflow-hidden rounded-[2rem] bg-transparent hover:bg-white/5 backdrop-blur-[1px] border border-white/85 ring-1 ring-slate-900/10 p-6 sm:p-8 shadow-[14px_14px_28px_rgba(15,23,42,0.13),-10px_-10px_24px_rgba(255,255,255,0.92),inset_0_1px_0_rgba(255,255,255,0.85)] transition-all duration-300">
        <div className="relative z-10 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <span className="inline-flex items-center gap-1.5 py-1 px-3.5 rounded-full bg-white/15 backdrop-blur-[1px] border border-white/90 ring-1 ring-[#ff5722]/25 text-[#ff5722] font-extrabold tracking-wider uppercase text-[11px] mb-3 shadow-[5px_5px_12px_rgba(15,23,42,0.09),-4px_-4px_10px_rgba(255,255,255,0.92)]">
              <Sparkles size={12} /> Access Control
            </span>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-gray-900 tracking-tight">
              Manage <span className="text-[#ff5722]">Users</span>
            </h1>
            <p className="text-gray-700 text-sm font-medium mt-1">
              View and update user roles across the platform.
            </p>
          </div>

          <div className="px-5 py-3 rounded-2xl bg-white/10 backdrop-blur-[1px] border border-white/90 ring-1 ring-slate-900/10 shadow-[7px_7px_16px_rgba(15,23,42,0.1),-5px_-5px_12px_rgba(255,255,255,0.92)] self-start sm:self-center">
            <p className="text-[10px] font-extrabold uppercase tracking-wider text-gray-600">
              Total Users
            </p>
            <p className="text-lg font-extrabold text-gray-900 mt-0.5">
              {users.length}
            </p>
          </div>
        </div>
      </div>

      <div className="relative overflow-hidden bg-transparent backdrop-blur-[1px] rounded-[2rem] border border-white/85 ring-1 ring-slate-900/10 p-2 sm:p-4 shadow-[14px_14px_30px_rgba(15,23,42,0.14),-10px_-10px_24px_rgba(255,255,255,0.92),inset_0_1px_0_rgba(255,255,255,0.85)]">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-white/10 border-b border-white/80">
                <th className="px-6 py-4 text-[11px] font-extrabold text-gray-800 uppercase tracking-wider">
                  <span className="inline-flex items-center gap-1.5">
                    <Users size={13} className="text-[#ff5722]" />
                    User
                  </span>
                </th>
                <th className="px-6 py-4 text-[11px] font-extrabold text-gray-800 uppercase tracking-wider">
                  <span className="inline-flex items-center gap-1.5">
                    <Mail size={13} className="text-[#ff5722]" />
                    Email
                  </span>
                </th>
                <th className="px-6 py-4 text-[11px] font-extrabold text-gray-800 uppercase tracking-wider">
                  <span className="inline-flex items-center gap-1.5">
                    <ShieldCheck size={13} className="text-[#ff5722]" />
                    Role
                  </span>
                </th>
                <th className="px-6 py-4 text-[11px] font-extrabold text-gray-800 uppercase tracking-wider text-right">
                  <span className="inline-flex items-center gap-1.5">
                    <UserCog size={13} className="text-[#ff5722]" />
                    Actions
                  </span>
                </th>
              </tr>
            </thead>

            <tbody className="divide-y divide-white/65">
              {paginatedUsers.length === 0 ? (
                <tr>
                  <td colSpan={4} className="px-6 py-16 text-center">
                    <div className="inline-flex flex-col items-center justify-center p-6 rounded-[1.75rem] bg-white/10 backdrop-blur-[1px] border border-white/85 ring-1 ring-slate-900/10 shadow-[10px_10px_22px_rgba(15,23,42,0.1),-8px_-8px_18px_rgba(255,255,255,0.92)]">
                      <div className="w-14 h-14 rounded-2xl bg-white/15 border border-white/90 ring-1 ring-[#ff5722]/25 flex items-center justify-center text-[#ff5722] mb-3 shadow-[5px_5px_12px_rgba(15,23,42,0.09),-4px_-4px_10px_rgba(255,255,255,0.92)]">
                        <Users size={24} />
                      </div>
                      <p className="text-sm font-extrabold text-gray-900">
                        No users found.
                      </p>
                      <p className="text-xs font-medium text-gray-700 mt-1">
                        Registered users will appear here once available.
                      </p>
                    </div>
                  </td>
                </tr>
              ) : (
                paginatedUsers.map((user) => {
                  const displayName = user.name || "User";
                  const fallbackAvatar = `https://ui-avatars.com/api/?name=${encodeURIComponent(
                    displayName
                  )}&background=ff5722&color=fff&bold=true`;

                  const roleBadgeStyle =
                    user.role === "admin"
                      ? "bg-purple-500/15 text-purple-800 ring-purple-500/30"
                      : user.role === "technician"
                      ? "bg-indigo-500/15 text-indigo-800 ring-indigo-500/30"
                      : "bg-[#ff5722]/15 text-[#ff5722] ring-[#ff5722]/30";

                  return (
                    <tr
                      key={user._id}
                      className="group hover:bg-white/10 transition-all duration-200"
                    >
                      <td className="px-6 py-3.5">
                        <div className="flex items-center gap-3.5">
                          <img
                            src={user.image || fallbackAvatar}
                            alt={displayName}
                            className="w-10 h-10 rounded-full object-cover shrink-0 border-2 border-white/90 ring-1 ring-slate-900/10 shadow-[4px_4px_10px_rgba(15,23,42,0.1),-3px_-3px_8px_rgba(255,255,255,0.92)]"
                          />
                          <p className="font-extrabold text-sm text-gray-900 group-hover:text-[#ff5722] transition-colors">
                            {displayName}
                          </p>
                        </div>
                      </td>

                      <td className="px-6 py-3.5 text-sm font-semibold text-gray-800 whitespace-nowrap">
                        {user.email || "—"}
                      </td>

                      <td className="px-6 py-3.5 whitespace-nowrap">
                        <span
                          className={`w-28 inline-flex items-center justify-center py-1 text-xs font-extrabold rounded-full capitalize bg-white/40 backdrop-blur-[1px] border border-white/90 ring-1 shadow-[3px_3px_8px_rgba(15,23,42,0.08),-3px_-3px_8px_rgba(255,255,255,0.92)] ${roleBadgeStyle}`}
                        >
                          {user.role}
                        </span>
                      </td>

                      <td className="px-6 py-3.5 text-right whitespace-nowrap">
                        <select
                          disabled={
                            user.role === "admin" || updatingId === user._id
                          }
                          value={user.role}
                          onChange={(e) =>
                            handleRoleChange(user._id, e.target.value)
                          }
                          className="w-32 px-3.5 py-2 text-xs font-extrabold text-gray-900 bg-white/20 hover:bg-white/30 backdrop-blur-[1px] border border-white/90 ring-1 ring-slate-900/10 rounded-xl shadow-[4px_4px_10px_rgba(15,23,42,0.08),-3px_-3px_8px_rgba(255,255,255,0.92)] outline-none focus:ring-2 focus:ring-[#ff5722]/35 focus:border-[#ff5722]/50 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                        >
                          <option value="customer">Customer</option>
                          <option value="technician">Technician</option>
                          <option value="admin">Admin</option>
                        </select>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>

        <div className="px-4 pb-2">
          <Pagination
            currentPage={safePage}
            totalItems={users.length}
            pageSize={PAGE_SIZE}
            onPageChange={setCurrentPage}
            itemLabel="users"
          />
        </div>
      </div>
    </div>
  );
}