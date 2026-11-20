"use client";

import { useState } from "react";
import { toast } from "@/components/ui/CustomToast";
import {
  User,
  Wrench,
  Sparkles,
  CheckCircle2,
  Loader2,
  X,
} from "lucide-react";

type JoinableRole = "customer" | "technician";

interface RoleSelectionModalProps {
  isOpen: boolean;
  userName?: string | null;
  onSelectRole: (role: JoinableRole) => Promise<void> | void;
  onClose?: () => void;
}

export default function RoleSelectionModal({
  isOpen,
  userName,
  onSelectRole,
  onClose,
}: RoleSelectionModalProps) {
  const [selectedRole, setSelectedRole] = useState<JoinableRole>("customer");
  const [submitting, setSubmitting] = useState(false);

  if (!isOpen) return null;

  const handleConfirm = async () => {
    setSubmitting(true);
    try {
      await onSelectRole(selectedRole);
    } catch (err: any) {
      toast.error(err?.message || "Could not save role selection");
    } finally {
      setSubmitting(false);
    }
  };

  const options: {
    role: JoinableRole;
    title: string;
    description: string;
    icon: typeof User;
  }[] = [
    {
      role: "customer",
      title: "Customer",
      description: "Book repair services, track jobs, and manage payments.",
      icon: User,
    },
    {
      role: "technician",
      title: "Technician",
      description: "List repair services, manage requests, and earn.",
      icon: Wrench,
    },
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 backdrop-blur-sm p-4">
      <div className="relative w-full max-w-lg rounded-[2rem] bg-white/88 backdrop-blur-xl border border-white ring-1 ring-slate-900/10 p-6 sm:p-8 shadow-[0_24px_60px_rgba(15,23,42,0.22),inset_0_1px_0_rgba(255,255,255,0.95)]">
        {onClose && (
          <button
            type="button"
            onClick={onClose}
            aria-label="Close modal"
            className="absolute top-5 right-5 p-2 rounded-full bg-white/80 hover:bg-white border border-gray-200/80 text-gray-700 hover:text-gray-900 transition-all cursor-pointer"
          >
            <X size={16} />
          </button>
        )}

        <span className="inline-flex items-center gap-1.5 py-1 px-3.5 rounded-full bg-[#ff5722]/12 border border-[#ff5722]/25 text-[#ff5722] font-extrabold tracking-wider uppercase text-[11px] mb-3">
          <Sparkles size={12} /> Welcome to FixLab
        </span>

        <h2 className="text-2xl font-extrabold text-gray-900 tracking-tight">
          আপনি কীভাবে এখানে{" "}
          <span className="text-[#ff5722]">যুক্ত হতে চান?</span>
        </h2>
        <p className="text-xs sm:text-sm font-medium text-gray-600 mt-1.5">
          {userName ? `${userName}, ` : ""}Choose how you want to use FixLab.
          You can select Customer or Technician to continue.
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 my-6">
          {options.map((item) => {
            const Icon = item.icon;
            const active = selectedRole === item.role;

            return (
              <button
                key={item.role}
                type="button"
                onClick={() => setSelectedRole(item.role)}
                className={`text-left p-5 rounded-[1.5rem] border transition-all cursor-pointer relative ${
                  active
                    ? "bg-[#fff6f3] border-[#ff5722] ring-2 ring-[#ff5722]/25 shadow-[0_10px_22px_rgba(255,87,34,0.16)]"
                    : "bg-white/75 hover:bg-white border-gray-200/85 hover:border-gray-300 shadow-[0_4px_12px_rgba(15,23,42,0.04)]"
                }`}
              >
                {active && (
                  <CheckCircle2
                    size={18}
                    className="text-[#ff5722] absolute top-4 right-4"
                  />
                )}
                <div
                  className={`w-11 h-11 rounded-2xl flex items-center justify-center mb-3 border ${
                    active
                      ? "bg-gradient-to-r from-[#ff5722] to-[#ff6d3f] text-white border-[#ff5722]/30 shadow-xs"
                      : "bg-white text-[#ff5722] border-gray-200/80"
                  }`}
                >
                  <Icon size={20} />
                </div>
                <p className="font-extrabold text-sm text-gray-900">
                  {item.title}
                </p>
                <p className="text-xs font-medium text-gray-600 mt-1 leading-relaxed">
                  {item.description}
                </p>
              </button>
            );
          })}
        </div>

        <button
          type="button"
          disabled={submitting}
          onClick={handleConfirm}
          className="w-full py-3.5 bg-gradient-to-r from-[#ff5722] to-[#ff6d3f] hover:from-[#e64a19] hover:to-[#ff5722] text-white text-sm font-extrabold rounded-full transition-all shadow-[0_10px_24px_rgba(255,87,34,0.32)] disabled:opacity-65 flex items-center justify-center gap-2 cursor-pointer"
        >
          {submitting && <Loader2 className="animate-spin" size={18} />}
          <span>
            {submitting
              ? "Saving..."
              : `Continue as ${
                  selectedRole === "customer" ? "Customer" : "Technician"
                }`}
          </span>
        </button>
      </div>
    </div>
  );
}