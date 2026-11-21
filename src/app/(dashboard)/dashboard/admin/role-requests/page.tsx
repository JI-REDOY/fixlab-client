"use client";

import { useState, useEffect, useCallback } from "react";
import { fetchApi } from "@/lib/api";
import Pagination from "@/components/ui/Pagination";
import {
  UserCheck,
  CheckCircle2,
  XCircle,
  Loader2,
  Sparkles,
  RefreshCw,
} from "lucide-react";
import { toast } from "@/components/ui/CustomToast";

const PAGE_SIZE = 6;

interface RoleRequestItem {
  _id: string;
  userName?: string;
  name?: string;
  userEmail?: string;
  email?: string;
  currentRole?: string;
  requestedRole: "customer" | "technician";
  reason?: string;
  status: "pending" | "approved" | "rejected";
  createdAt?: string;
}

export default function AdminRoleRequestsPage() {
  const [requests, setRequests] = useState<RoleRequestItem[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [actionId, setActionId] = useState<string | null>(null);

  const loadRequests = useCallback(async () => {
    setLoading(true);
    try {
      const data = await fetchApi("/api/auth/role-requests");
      const list = Array.isArray(data)
        ? data
        : data?.requests ?? data?.data ?? [];
      setRequests(list);
    } catch (err: any) {
      console.error(err);
      toast.error(err?.message || "Failed to load role requests");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadRequests();
  }, [loadRequests]);

  const handleDecision = async (
    id: string,
    decision: "approved" | "rejected"
  ) => {
    setActionId(id);
    try {
      await fetchApi(`/api/auth/role-requests/${id}`, {
        method: "PATCH",
        body: JSON.stringify({ status: decision }),
      });

      setRequests((prev) =>
        prev.map((item) =>
          item._id === id ? { ...item, status: decision } : item
        )
      );

      toast.success(
        decision === "approved"
          ? "Role request approved"
          : "Role request rejected"
      );
    } catch (err: any) {
      toast.error(err?.message || "Action failed");
    } finally {
      setActionId(null);
    }
  };

  const totalPages = Math.max(1, Math.ceil(requests.length / PAGE_SIZE));
  const safePage = Math.min(currentPage, totalPages);
  const paginatedRequests = requests.slice(
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
      <div className="relative overflow-hidden rounded-[2rem] bg-white/65 hover:bg-white/75 backdrop-blur-xs border border-white/85 p-6 sm:p-8 shadow-[10px_10px_24px_rgba(15,23,42,0.06),-10px_-10px_24px_rgba(255,255,255,0.92)] transition-all duration-300">
        <div className="absolute -right-14 -top-14 w-52 h-52 rounded-full bg-[#ff5722]/12 blur-2xl pointer-events-none" />

        <div className="relative z-10 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <span className="inline-flex items-center gap-1.5 py-1 px-3.5 rounded-full bg-white/85 border border-white/90 text-[#ff5722] font-extrabold tracking-wider uppercase text-[11px] mb-3 shadow-2xs">
              <Sparkles size={12} /> Admin Control
            </span>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-gray-900 tracking-tight">
              Role <span className="text-[#ff5722]">Requests</span>
            </h1>
            <p className="text-gray-600 text-sm font-medium mt-1">
              Review and approve or reject customer and technician role changes.
            </p>
          </div>

          <button
            type="button"
            onClick={loadRequests}
            className="inline-flex items-center justify-center gap-2 px-5 py-3 rounded-full bg-white/85 hover:bg-white text-gray-800 hover:text-[#ff5722] text-xs sm:text-sm font-extrabold border border-white shadow-xs transition-all cursor-pointer shrink-0 self-start sm:self-center"
          >
            <RefreshCw size={15} />
            <span>Refresh</span>
          </button>
        </div>
      </div>

      {requests.length === 0 ? (
        <div className="rounded-[2rem] bg-white/65 backdrop-blur-xs border border-white/85 p-10 text-center shadow-[10px_10px_24px_rgba(15,23,42,0.06),-10px_-10px_24px_rgba(255,255,255,0.92)]">
          <div className="w-14 h-14 rounded-2xl bg-[#ff5722]/10 text-[#ff5722] flex items-center justify-center mx-auto mb-3">
            <UserCheck size={26} />
          </div>
          <h2 className="text-lg font-extrabold text-gray-900">
            No Role Requests Found
          </h2>
          <p className="text-sm text-gray-600 mt-1">
            When users request a role change, they will appear here.
          </p>
        </div>
      ) : (
        <div className="rounded-[2rem] bg-white/55 backdrop-blur-xs border border-white/85 p-4 sm:p-6 shadow-[10px_10px_24px_rgba(15,23,42,0.06),-10px_-10px_24px_rgba(255,255,255,0.92)]">
          <div className="grid grid-cols-1 gap-4">
            {paginatedRequests.map((reqItem) => {
              const memberName = reqItem.userName || reqItem.name || "User";
              const memberEmail = reqItem.userEmail || reqItem.email || "";
              const isBusy = actionId === reqItem._id;

              const statusBadge =
                reqItem.status === "approved"
                  ? "bg-emerald-500/12 text-emerald-700 border-emerald-500/25"
                  : reqItem.status === "rejected"
                  ? "bg-red-500/12 text-red-700 border-red-500/25"
                  : "bg-amber-500/12 text-amber-700 border-amber-500/25";

              return (
                <div
                  key={reqItem._id}
                  className="rounded-[1.75rem] bg-white/75 hover:bg-white/90 backdrop-blur-xs border border-white/90 p-5 shadow-[6px_6px_16px_rgba(15,23,42,0.05),-6px_-6px_16px_rgba(255,255,255,0.92)] flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 transition-all"
                >
                  <div className="space-y-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <h3 className="text-base font-extrabold text-gray-900">
                        {memberName}
                      </h3>
                      <span
                        className={`px-2.5 py-0.5 rounded-full text-[10px] font-extrabold uppercase tracking-wider border ${statusBadge}`}
                      >
                        {reqItem.status}
                      </span>
                    </div>
                    <p className="text-xs font-medium text-gray-600">
                      {memberEmail}
                    </p>
                    <p className="text-xs font-bold text-gray-700 pt-1">
                      Current:{" "}
                      <span className="uppercase text-gray-900">
                        {reqItem.currentRole || "customer"}
                      </span>{" "}
                      <span className="mx-1.5 text-[#ff5722]">→</span>
                      Requested:{" "}
                      <span className="uppercase text-[#ff5722]">
                        {reqItem.requestedRole}
                      </span>
                    </p>
                    {reqItem.reason && (
                      <p className="text-xs text-gray-600 pt-0.5">
                        Note: {reqItem.reason}
                      </p>
                    )}
                  </div>

                  {reqItem.status === "pending" && (
                    <div className="flex items-center gap-2.5 shrink-0">
                      <button
                        type="button"
                        disabled={isBusy}
                        onClick={() => handleDecision(reqItem._id, "approved")}
                        className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-full bg-gradient-to-r from-[#ff5722] to-[#ff6d3f] hover:from-[#e64a19] hover:to-[#ff5722] text-white text-xs font-extrabold shadow-xs transition-all disabled:opacity-60 cursor-pointer"
                      >
                        {isBusy ? (
                          <Loader2 size={14} className="animate-spin" />
                        ) : (
                          <CheckCircle2 size={15} />
                        )}
                        <span>Approve</span>
                      </button>

                      <button
                        type="button"
                        disabled={isBusy}
                        onClick={() => handleDecision(reqItem._id, "rejected")}
                        className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-full bg-white hover:bg-red-50 text-red-600 text-xs font-extrabold border border-red-200/80 transition-all disabled:opacity-60 cursor-pointer"
                      >
                        <XCircle size={15} />
                        <span>Reject</span>
                      </button>
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          <Pagination
            currentPage={safePage}
            totalItems={requests.length}
            pageSize={PAGE_SIZE}
            onPageChange={setCurrentPage}
            itemLabel="requests"
          />
        </div>
      )}
    </div>
  );
}