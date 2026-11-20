"use client";

import { useState, useEffect, useCallback } from "react";
import { authClient } from "@/lib/auth-client";
import { fetchApi } from "@/lib/api";
import { toast } from "@/components/ui/CustomToast";
import {
  UploadCloud,
  Save,
  Sparkles,
  User,
  Mail,
  Phone,
  MapPin,
  FileText,
  Loader2,
  UserCheck,
  Send,
  Clock,
  CheckCircle2,
  XCircle,
  X,
  Wrench,
  ArrowRight,
} from "lucide-react";

interface RoleRequestItem {
  _id: string;
  currentRole: string;
  requestedRole: "customer" | "technician";
  reason?: string;
  status: "pending" | "approved" | "rejected";
  adminNote?: string;
  createdAt?: string;
}

export default function ProfilePage() {
  const { data: session, isPending } = authClient.useSession();
  const [loading, setLoading] = useState(false);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [dbRole, setDbRole] = useState<string | null>(null);

  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    area: "",
    bio: "",
    image: "",
  });

  const currentRole = (dbRole ||
    (session?.user as any)?.role ||
    "customer") as string;

  const [isRoleModalOpen, setIsRoleModalOpen] = useState(false);
  const [targetRole, setTargetRole] = useState<"customer" | "technician">(
    currentRole === "technician" ? "customer" : "technician"
  );
  const [reason, setReason] = useState("");
  const [submittingRequest, setSubmittingRequest] = useState(false);
  const [latestRequest, setLatestRequest] = useState<RoleRequestItem | null>(
    null
  );

  useEffect(() => {
    if (session?.user) {
      const userRole = (session.user as any).role || "customer";
      setDbRole((prev) => prev || userRole);
      setFormData({
        name: session.user.name || "",
        phone: (session.user as any).phone || "",
        area: (session.user as any).area || "",
        bio: (session.user as any).bio || "",
        image: session.user.image || "",
      });
      setImagePreview(session.user.image || null);
      setTargetRole(userRole === "technician" ? "customer" : "technician");
    }
  }, [session]);

  const loadMyRoleRequest = useCallback(async () => {
    if (!session?.user?.email) return;
    try {
      const data = await fetchApi("/api/auth/role-requests/my");
      const reqItem = data?.request || (Array.isArray(data) ? data[0] : null);
      setLatestRequest(reqItem || null);
    } catch {
      setLatestRequest(null);
    }
  }, [session?.user?.email]);

  useEffect(() => {
    if (session?.user?.email) {
      loadMyRoleRequest();
    }
  }, [session?.user?.email, loadMyRoleRequest]);

  if (isPending) {
    return (
      <div className="flex justify-center py-24">
        <Loader2 className="animate-spin text-[#ff5722]" size={42} />
      </div>
    );
  }

  if (!session) return null;

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => setImagePreview(reader.result as string);
      reader.readAsDataURL(file);
      setFormData({
        ...formData,
        image:
          "https://images.unsplash.com/photo-1540569014015-19a7be504e3a?q=80&w=200",
      });
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const { error } = await authClient.updateUser({
        name: formData.name,
        image: formData.image,
        phone: formData.phone,
        area: formData.area,
        bio: formData.bio,
      } as any);

      if (error) {
        toast.error(error.message || "Failed to update profile");
      } else {
        toast.success("Profile updated successfully!");
      }
    } catch {
      toast.error("Something went wrong!");
    } finally {
      setLoading(false);
    }
  };

  const handleRoleRequestSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (currentRole === "admin") {
      toast.error("Admin role cannot request a role change.");
      return;
    }

    if (targetRole === currentRole) {
      toast.error(`You are already a ${currentRole}.`);
      return;
    }

    setSubmittingRequest(true);
    try {
      const res = await fetchApi("/api/auth/role-requests", {
        method: "POST",
        body: JSON.stringify({
          requestedRole: targetRole,
          reason: reason.trim(),
        }),
      });

      toast.success(
        res?.message || "Role change request sent to admin for approval!"
      );
      setReason("");
      setIsRoleModalOpen(false);
      await loadMyRoleRequest();
    } catch (err: any) {
      toast.error(err?.message || "Failed to submit role request");
    } finally {
      setSubmittingRequest(false);
    }
  };

  const fallbackAvatar = `https://ui-avatars.com/api/?name=${encodeURIComponent(
    session.user.name || "User"
  )}&background=ff5722&color=fff&bold=true`;

  const hasPendingRequest = latestRequest?.status === "pending";

  const roleChoices: {
    value: "customer" | "technician";
    label: string;
    subtitle: string;
    icon: typeof User;
  }[] = [
    {
      value: "customer",
      label: "Customer",
      subtitle: "Book & track repairs",
      icon: User,
    },
    {
      value: "technician",
      label: "Technician",
      subtitle: "Provide & manage services",
      icon: Wrench,
    },
  ];

  return (
    <div className="max-w-4xl mx-auto space-y-6 relative z-10">
      <div className="relative overflow-hidden rounded-[2rem] bg-transparent hover:bg-white/5 backdrop-blur-[1px] border border-white/85 ring-1 ring-slate-900/12 px-6 py-5 sm:px-8 sm:py-6 shadow-[14px_14px_28px_rgba(15,23,42,0.13),-10px_-10px_24px_rgba(255,255,255,0.92),inset_0_1px_0_rgba(255,255,255,0.85)] transition-all duration-300">
        <span className="inline-flex items-center gap-1.5 py-1 px-3.5 rounded-full bg-white/15 backdrop-blur-[1px] border border-white/90 ring-1 ring-[#ff5722]/25 text-[#ff5722] font-extrabold tracking-wider uppercase text-[11px] mb-2 shadow-[5px_5px_12px_rgba(15,23,42,0.09),-4px_-4px_10px_rgba(255,255,255,0.92)]">
          <Sparkles size={12} /> Account Settings
        </span>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-gray-900 tracking-tight">
          Update <span className="text-[#ff5722]">Profile</span>
        </h1>
        <p className="text-gray-700 text-sm font-medium mt-0.5">
          Manage your personal information and profile photo.
        </p>
      </div>

      <div className="relative overflow-hidden bg-transparent backdrop-blur-[1px] rounded-[2rem] border border-white/85 ring-1 ring-slate-900/12 p-6 sm:p-8 shadow-[14px_14px_30px_rgba(15,23,42,0.14),-10px_-10px_24px_rgba(255,255,255,0.92),inset_0_1px_0_rgba(255,255,255,0.85)]">
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-5 pb-6 border-b border-white/75">
            <div className="flex flex-col sm:flex-row items-center gap-5">
              <div className="relative w-24 h-24 rounded-full overflow-hidden border-4 border-white/90 ring-2 ring-[#ff5722]/35 bg-white/15 shrink-0 shadow-[8px_8px_18px_rgba(15,23,42,0.12),-6px_-6px_14px_rgba(255,255,255,0.92)]">
                <img
                  src={imagePreview || fallbackAvatar}
                  alt="Profile"
                  className="w-full h-full object-cover"
                />
              </div>

              <div className="text-center sm:text-left">
                <h3 className="text-sm font-extrabold text-gray-900 mb-1">
                  Profile Photo
                </h3>
                <p className="text-xs font-medium text-gray-700 mb-3">
                  JPG, PNG or GIF. Max size 2MB.
                </p>
                <label className="inline-flex items-center gap-2 px-4 py-2 bg-white/15 hover:bg-white/25 backdrop-blur-[1px] border border-white/90 ring-1 ring-[#ff5722]/25 rounded-full cursor-pointer shadow-[5px_5px_12px_rgba(15,23,42,0.09),-4px_-4px_10px_rgba(255,255,255,0.92)] transition-all">
                  <UploadCloud size={16} className="text-[#ff5722]" />
                  <span className="text-xs font-extrabold text-gray-900">
                    Upload New Photo
                  </span>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleImageUpload}
                    className="hidden"
                  />
                </label>
              </div>
            </div>

            {currentRole !== "admin" && (
              <div className="flex flex-col items-center sm:items-end gap-2 shrink-0">
                <div className="px-4 py-2 rounded-2xl bg-white/15 border border-white/90 ring-1 ring-slate-900/10 text-center sm:text-right">
                  <p className="text-[10px] font-extrabold uppercase tracking-wider text-gray-600">
                    Current Role
                  </p>
                  <p className="text-sm font-extrabold capitalize text-[#ff5722]">
                    {currentRole}
                  </p>
                </div>

                <div className="flex items-center gap-2 flex-wrap justify-center sm:justify-end">
                  {latestRequest && (
                    <span
                      className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-extrabold capitalize border border-white/90 ring-1 ${
                        latestRequest.status === "approved"
                          ? "bg-emerald-500/15 text-emerald-800 ring-emerald-500/30"
                          : latestRequest.status === "rejected"
                          ? "bg-red-500/15 text-red-700 ring-red-500/30"
                          : "bg-amber-500/15 text-amber-800 ring-amber-500/30"
                      }`}
                    >
                      {latestRequest.status === "approved" && (
                        <CheckCircle2 size={12} />
                      )}
                      {latestRequest.status === "rejected" && (
                        <XCircle size={12} />
                      )}
                      {latestRequest.status === "pending" && <Clock size={12} />}
                      <span>{latestRequest.status}</span>
                    </span>
                  )}

                  <button
                    type="button"
                    onClick={() => setIsRoleModalOpen(true)}
                    className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-white/20 hover:bg-white/30 text-gray-900 border border-white/90 ring-1 ring-[#ff5722]/30 text-xs font-extrabold shadow-[4px_4px_10px_rgba(15,23,42,0.09),-3px_-3px_8px_rgba(255,255,255,0.92)] transition-all cursor-pointer"
                  >
                    <UserCheck size={14} className="text-[#ff5722]" />
                    <span>
                      {hasPendingRequest ? "Role Pending" : "Change Role"}
                    </span>
                  </button>
                </div>
              </div>
            )}
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="flex items-center gap-1.5 text-xs font-extrabold uppercase tracking-wider text-gray-800 mb-1.5">
                <User size={13} className="text-[#ff5722]" />
                <span>Full Name</span>
              </label>
              <input
                type="text"
                required
                value={formData.name}
                onChange={(e) =>
                  setFormData({ ...formData, name: e.target.value })
                }
                className="w-full px-4 py-2.5 rounded-2xl bg-white/15 focus:bg-white/25 backdrop-blur-[1px] border border-white/90 ring-1 ring-slate-900/12 text-sm font-semibold text-gray-900 outline-none focus:ring-2 focus:ring-[#ff5722]/35 focus:border-[#ff5722]/50 shadow-[inset_1px_1px_3px_rgba(15,23,42,0.07),4px_4px_10px_rgba(15,23,42,0.06)] transition-all"
              />
            </div>

            <div>
              <label className="flex items-center gap-1.5 text-xs font-extrabold uppercase tracking-wider text-gray-800 mb-1.5">
                <Mail size={13} className="text-[#ff5722]" />
                <span>Email (Read-only)</span>
              </label>
              <input
                type="email"
                readOnly
                value={session.user.email}
                className="w-full px-4 py-2.5 rounded-2xl bg-white/10 backdrop-blur-[1px] border border-white/75 ring-1 ring-slate-900/8 text-sm font-semibold text-gray-600 cursor-not-allowed shadow-[inset_1px_1px_3px_rgba(15,23,42,0.06)]"
              />
            </div>

            <div>
              <label className="flex items-center gap-1.5 text-xs font-extrabold uppercase tracking-wider text-gray-800 mb-1.5">
                <Phone size={13} className="text-[#ff5722]" />
                <span>Phone</span>
              </label>
              <input
                type="text"
                placeholder="+880 1XXX XXXXXX"
                value={formData.phone}
                onChange={(e) =>
                  setFormData({ ...formData, phone: e.target.value })
                }
                className="w-full px-4 py-2.5 rounded-2xl bg-white/15 focus:bg-white/25 backdrop-blur-[1px] border border-white/90 ring-1 ring-slate-900/12 text-sm font-semibold text-gray-900 placeholder-gray-500 outline-none focus:ring-2 focus:ring-[#ff5722]/35 focus:border-[#ff5722]/50 shadow-[inset_1px_1px_3px_rgba(15,23,42,0.07),4px_4px_10px_rgba(15,23,42,0.06)] transition-all"
              />
            </div>

            <div>
              <label className="flex items-center gap-1.5 text-xs font-extrabold uppercase tracking-wider text-gray-800 mb-1.5">
                <MapPin size={13} className="text-[#ff5722]" />
                <span>Area / City</span>
              </label>
              <input
                type="text"
                placeholder="e.g. Mirpur, Dhaka"
                value={formData.area}
                onChange={(e) =>
                  setFormData({ ...formData, area: e.target.value })
                }
                className="w-full px-4 py-2.5 rounded-2xl bg-white/15 focus:bg-white/25 backdrop-blur-[1px] border border-white/90 ring-1 ring-slate-900/12 text-sm font-semibold text-gray-900 placeholder-gray-500 outline-none focus:ring-2 focus:ring-[#ff5722]/35 focus:border-[#ff5722]/50 shadow-[inset_1px_1px_3px_rgba(15,23,42,0.07),4px_4px_10px_rgba(15,23,42,0.06)] transition-all"
              />
            </div>
          </div>

          <div>
            <label className="flex items-center gap-1.5 text-xs font-extrabold uppercase tracking-wider text-gray-800 mb-1.5">
              <FileText size={13} className="text-[#ff5722]" />
              <span>Short Bio</span>
            </label>
            <textarea
              rows={3}
              placeholder="Tell us a little about yourself (useful for technicians)..."
              value={formData.bio}
              onChange={(e) =>
                setFormData({ ...formData, bio: e.target.value })
              }
              className="w-full px-4 py-2.5 rounded-2xl bg-white/15 focus:bg-white/25 backdrop-blur-[1px] border border-white/90 ring-1 ring-slate-900/12 text-sm font-medium text-gray-900 placeholder-gray-500 outline-none focus:ring-2 focus:ring-[#ff5722]/35 focus:border-[#ff5722]/50 resize-none shadow-[inset_1px_1px_3px_rgba(15,23,42,0.07),4px_4px_10px_rgba(15,23,42,0.06)] transition-all"
            />
          </div>

          <div className="pt-4 border-t border-white/75 flex justify-end">
            <button
              type="submit"
              disabled={loading}
              className="flex items-center gap-2 px-8 py-3 bg-gradient-to-r from-[#ff5722] to-[#ff6d3f] hover:from-[#e64a19] hover:to-[#ff5722] text-white text-sm font-extrabold rounded-full transition-all shadow-[6px_6px_16px_rgba(255,87,34,0.34),-4px_-4px_10px_rgba(255,255,255,0.85)] disabled:opacity-65 cursor-pointer"
            >
              {loading ? (
                <Loader2 size={18} className="animate-spin" />
              ) : (
                <Save size={18} />
              )}
              <span>{loading ? "Saving..." : "Save Changes"}</span>
            </button>
          </div>
        </form>
      </div>

      {isRoleModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/15 backdrop-blur-[3px] p-4">
          <div className="relative w-full max-w-md rounded-[2rem] bg-white/85 backdrop-blur-xl border border-white ring-1 ring-slate-900/10 p-6 sm:p-7 shadow-[20px_20px_45px_rgba(15,23,42,0.16),-10px_-10px_28px_rgba(255,255,255,0.95),inset_0_1px_0_rgba(255,255,255,1)]">
            <button
              type="button"
              onClick={() => setIsRoleModalOpen(false)}
              aria-label="Close role request modal"
              className="absolute top-5 right-5 w-9 h-9 rounded-full bg-white hover:bg-slate-50 border border-slate-200/80 text-gray-700 flex items-center justify-center shadow-xs transition-all cursor-pointer"
            >
              <X size={16} />
            </button>

            <span className="inline-flex items-center gap-1.5 py-1 px-3 rounded-full bg-[#ff5722]/10 border border-[#ff5722]/20 text-[#ff5722] font-extrabold tracking-wider uppercase text-[10px] mb-2.5">
              <UserCheck size={12} /> Role Request
            </span>

            <h2 className="text-xl font-extrabold text-gray-900 tracking-tight">
              Request Role <span className="text-[#ff5722]">Change</span>
            </h2>

            <div className="mt-2 inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-slate-100/90 border border-slate-200/70 text-xs font-bold text-gray-700">
              <span className="capitalize">{currentRole}</span>
              <ArrowRight size={13} className="text-[#ff5722]" />
              <span className="capitalize text-[#ff5722] font-extrabold">
                {targetRole}
              </span>
            </div>

            {hasPendingRequest && (
              <div className="mt-4 px-4 py-3 rounded-2xl bg-amber-50 border border-amber-200/80 text-xs font-bold text-amber-800 flex items-center gap-2">
                <Clock size={14} className="shrink-0" />
                <span>
                  Request already pending for{" "}
                  <span className="capitalize">
                    {latestRequest?.requestedRole}
                  </span>
                  .
                </span>
              </div>
            )}

            <form onSubmit={handleRoleRequestSubmit} className="space-y-4 mt-5">
              <div>
                <label className="block text-[11px] font-extrabold uppercase tracking-wider text-gray-700 mb-2">
                  Select Desired Role
                </label>
                <div className="grid grid-cols-2 gap-3">
                  {roleChoices.map((choice) => {
                    const Icon = choice.icon;
                    const active = targetRole === choice.value;
                    return (
                      <button
                        key={choice.value}
                        type="button"
                        disabled={hasPendingRequest || submittingRequest}
                        onClick={() => setTargetRole(choice.value)}
                        className={`p-3.5 rounded-2xl border text-left transition-all cursor-pointer disabled:opacity-60 ${
                          active
                            ? "bg-[#ff5722]/10 border-[#ff5722] ring-2 ring-[#ff5722]/25 shadow-xs"
                            : "bg-white/75 hover:bg-white border-slate-200/80"
                        }`}
                      >
                        <div className="flex items-center justify-between mb-1.5">
                          <span
                            className={`w-8 h-8 rounded-xl flex items-center justify-center ${
                              active
                                ? "bg-[#ff5722] text-white"
                                : "bg-slate-100 text-gray-600"
                            }`}
                          >
                            <Icon size={15} />
                          </span>
                          {active && (
                            <CheckCircle2
                              size={15}
                              className="text-[#ff5722]"
                            />
                          )}
                        </div>
                        <p className="text-xs font-extrabold text-gray-900">
                          {choice.label}
                        </p>
                        <p className="text-[11px] font-medium text-gray-600 mt-0.5 leading-snug">
                          {choice.subtitle}
                        </p>
                      </button>
                    );
                  })}
                </div>
              </div>

              <div>
                <label className="block text-[11px] font-extrabold uppercase tracking-wider text-gray-700 mb-1.5">
                  Note / Experience (Optional)
                </label>
                <textarea
                  rows={3}
                  disabled={hasPendingRequest || submittingRequest}
                  placeholder="Write a short note or experience..."
                  value={reason}
                  onChange={(e) => setReason(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-2xl bg-white/80 focus:bg-white border border-slate-200/90 text-sm font-medium text-gray-900 placeholder-gray-400 outline-none focus:ring-2 focus:ring-[#ff5722]/30 focus:border-[#ff5722]/50 resize-none transition-all disabled:opacity-60"
                />
              </div>

              <div className="pt-2 flex items-center justify-end gap-2.5">
                <button
                  type="button"
                  onClick={() => setIsRoleModalOpen(false)}
                  className="px-5 py-2.5 rounded-full bg-white hover:bg-slate-50 text-gray-700 text-xs font-extrabold border border-slate-200/90 transition-all cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={hasPendingRequest || submittingRequest}
                  className="inline-flex items-center gap-1.5 px-6 py-2.5 bg-gradient-to-r from-[#ff5722] to-[#ff6d3f] hover:from-[#e64a19] hover:to-[#ff5722] text-white text-xs font-extrabold rounded-full transition-all shadow-[0_6px_16px_rgba(255,87,34,0.3)] disabled:opacity-55 disabled:cursor-not-allowed cursor-pointer"
                >
                  {submittingRequest ? (
                    <Loader2 size={14} className="animate-spin" />
                  ) : (
                    <Send size={14} />
                  )}
                  <span>
                    {hasPendingRequest
                      ? "Pending"
                      : submittingRequest
                      ? "Sending..."
                      : "Send Request"}
                  </span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}