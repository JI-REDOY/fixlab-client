"use client";

import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
} from "react";
import {
  CheckCircle2,
  XCircle,
  AlertTriangle,
  Info,
  X,
  Loader2,
  Sparkles,
} from "lucide-react";

export type ToastVariant = "success" | "error" | "warning" | "info" | "loading";

export interface ToastItem {
  id: string;
  title?: string;
  message: string;
  variant: ToastVariant;
  duration: number;
}

interface ToastOptions {
  title?: string;
  variant?: ToastVariant;
  duration?: number;
  id?: string;
  persistAcrossRedirect?: boolean;
}

interface ToastContextValue {
  showToast: (message: string, options?: ToastOptions) => string;
  dismissToast: (id: string) => void;
  clearAll: () => void;
}

const PENDING_TOAST_KEY = "fixlab_pending_toast";
const MAX_VISIBLE_TOASTS = 2;

const ToastContext = createContext<ToastContextValue | null>(null);

let externalShowToast: ToastContextValue["showToast"] | null = null;
let externalDismissToast: ToastContextValue["dismissToast"] | null = null;

function formatWelcomeMessage(name?: string | null) {
  const cleanName = name?.trim();
  return cleanName ? `Welcome back, ${cleanName}!` : "Welcome back!";
}

export const toast = {
  success: (
    message: string,
    opts?: {
      title?: string;
      duration?: number;
      id?: string;
      persistAcrossRedirect?: boolean;
    }
  ) =>
    externalShowToast?.(message, {
      ...opts,
      variant: "success",
      duration: opts?.duration ?? 2500,
    }) ?? "",

  error: (
    message: string,
    opts?: {
      title?: string;
      duration?: number;
      id?: string;
      persistAcrossRedirect?: boolean;
    }
  ) =>
    externalShowToast?.(message, {
      ...opts,
      variant: "error",
      duration: opts?.duration ?? 3000,
    }) ?? "",

  warning: (
    message: string,
    opts?: {
      title?: string;
      duration?: number;
      id?: string;
      persistAcrossRedirect?: boolean;
    }
  ) =>
    externalShowToast?.(message, {
      ...opts,
      variant: "warning",
      duration: opts?.duration ?? 2800,
    }) ?? "",

  info: (
    message: string,
    opts?: {
      title?: string;
      duration?: number;
      id?: string;
      persistAcrossRedirect?: boolean;
    }
  ) =>
    externalShowToast?.(message, {
      ...opts,
      variant: "info",
      duration: opts?.duration ?? 2500,
    }) ?? "",

  loading: (message: string, opts?: { title?: string; id?: string }) =>
    externalShowToast?.(message, {
      ...opts,
      variant: "loading",
      duration: 0,
    }) ?? "",

  welcome: (
    userName?: string | null,
    opts?: {
      title?: string;
      duration?: number;
      persistAcrossRedirect?: boolean;
    }
  ) =>
    externalShowToast?.(formatWelcomeMessage(userName), {
      title: opts?.title ?? "Signed In",
      variant: "success",
      duration: opts?.duration ?? 2800,
      persistAcrossRedirect: opts?.persistAcrossRedirect ?? true,
    }) ?? "",

  dismiss: (id: string) => externalDismissToast?.(id),
};

export function Toaster(_props: {
  position?: string;
  richColors?: boolean;
}) {
  return null;
}

const VARIANT_STYLES: Record<
  ToastVariant,
  {
    icon: React.ComponentType<{ size?: number; className?: string }>;
    iconWrap: string;
    ring: string;
    progressBar: string;
    pillGlow: string;
  }
> = {
  success: {
    icon: CheckCircle2,
    iconWrap: "bg-emerald-500/15 text-emerald-700 border-emerald-400/40",
    ring: "ring-emerald-500/20",
    progressBar: "bg-gradient-to-r from-emerald-500 to-teal-400",
    pillGlow:
      "shadow-[12px_12px_28px_rgba(15,23,42,0.14),-8px_-8px_22px_rgba(255,255,255,0.95),0_0_0_1px_rgba(16,185,129,0.12)]",
  },
  error: {
    icon: XCircle,
    iconWrap: "bg-[#ff5722]/15 text-[#ff5722] border-[#ff5722]/35",
    ring: "ring-[#ff5722]/25",
    progressBar: "bg-gradient-to-r from-[#ff5722] to-rose-500",
    pillGlow:
      "shadow-[12px_12px_28px_rgba(255,87,34,0.16),-8px_-8px_22px_rgba(255,255,255,0.95)]",
  },
  warning: {
    icon: AlertTriangle,
    iconWrap: "bg-amber-500/15 text-amber-800 border-amber-400/40",
    ring: "ring-amber-500/25",
    progressBar: "bg-gradient-to-r from-amber-500 to-orange-400",
    pillGlow:
      "shadow-[12px_12px_28px_rgba(15,23,42,0.14),-8px_-8px_22px_rgba(255,255,255,0.95)]",
  },
  info: {
    icon: Info,
    iconWrap: "bg-[#ff5722]/12 text-[#ff5722] border-[#ff5722]/25",
    ring: "ring-[#ff5722]/20",
    progressBar: "bg-gradient-to-r from-[#ff5722] to-[#ff6d3f]",
    pillGlow:
      "shadow-[12px_12px_28px_rgba(15,23,42,0.14),-8px_-8px_22px_rgba(255,255,255,0.95)]",
  },
  loading: {
    icon: Loader2,
    iconWrap:
      "bg-gradient-to-r from-[#ff5722] to-[#ff6d3f] text-white border-[#ff5722]/40",
    ring: "ring-[#ff5722]/25",
    progressBar: "bg-gradient-to-r from-[#ff5722] to-[#ff6d3f]",
    pillGlow:
      "shadow-[12px_12px_28px_rgba(255,87,34,0.18),-8px_-8px_22px_rgba(255,255,255,0.95)]",
  },
};

function ToastPill({
  item,
  onDismiss,
}: {
  item: ToastItem;
  onDismiss: (id: string) => void;
}) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    const raf = requestAnimationFrame(() => setMounted(true));
    return () => cancelAnimationFrame(raf);
  }, []);

  const config = VARIANT_STYLES[item.variant];
  const IconComp = item.title === "Signed In" ? Sparkles : config.icon;

  return (
    <div
      role="status"
      onClick={() => onDismiss(item.id)}
      className={`pointer-events-auto relative overflow-hidden inline-flex flex-col rounded-2xl sm:rounded-full bg-white/90 backdrop-blur-xl border border-white ring-1 ${config.ring} ${config.pillGlow} transition-all duration-200 cursor-pointer select-none ${
        mounted
          ? "opacity-100 translate-y-0 scale-100"
          : "opacity-0 -translate-y-2 scale-95"
      }`}
    >
      <div className="flex items-center gap-3 pl-2.5 pr-3 py-2">
        <div
          className={`w-8 h-8 rounded-full border flex items-center justify-center shrink-0 ${config.iconWrap}`}
        >
          <IconComp
            size={15}
            className={item.variant === "loading" ? "animate-spin" : ""}
          />
        </div>

        <div className="min-w-0 pr-1">
          {item.title && (
            <span className="text-[10px] font-extrabold uppercase tracking-wider text-[#ff5722] mr-1.5">
              {item.title}
            </span>
          )}
          <span className="text-xs sm:text-sm font-extrabold text-gray-900 break-words">
            {item.message}
          </span>
        </div>

        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            onDismiss(item.id);
          }}
          aria-label="Close notification"
          className="w-6 h-6 rounded-full bg-white/85 hover:bg-[#ff5722] text-gray-600 hover:text-white border border-slate-200/80 flex items-center justify-center shrink-0 transition-all cursor-pointer"
        >
          <X size={12} />
        </button>
      </div>

      {item.duration > 0 && (
        <div className="w-full h-[2.5px] bg-slate-900/5 overflow-hidden">
          <div
            className={`h-full w-full origin-left ${config.progressBar} transition-transform ease-linear`}
            style={{
              transform: mounted ? "scaleX(0)" : "scaleX(1)",
              transitionDuration: `${item.duration}ms`,
            }}
          />
        </div>
      )}
    </div>
  );
}

export function CustomToastProvider({ children }: { children: React.ReactNode }) {
  const [toasts, setToasts] = useState<ToastItem[]>([]);
  const timersRef = useRef<Record<string, ReturnType<typeof setTimeout>>>({});

  const dismissToast = useCallback((id: string) => {
    if (timersRef.current[id]) {
      clearTimeout(timersRef.current[id]);
      delete timersRef.current[id];
    }
    setToasts((prev) => prev.filter((item) => item.id !== id));
  }, []);

  const clearAll = useCallback(() => {
    Object.values(timersRef.current).forEach(clearTimeout);
    timersRef.current = {};
    setToasts([]);
  }, []);

  const showToast = useCallback(
    (message: string, options?: ToastOptions) => {
      const variant = options?.variant || "info";
      const defaultDuration =
        variant === "loading"
          ? 0
          : variant === "error"
          ? 3000
          : variant === "warning"
          ? 2800
          : 2500;
      const duration = options?.duration ?? defaultDuration;

      if (options?.persistAcrossRedirect && typeof window !== "undefined") {
        try {
          sessionStorage.setItem(
            PENDING_TOAST_KEY,
            JSON.stringify({
              title: options.title,
              message,
              variant,
              duration,
            })
          );
        } catch {
          // ignore storage error
        }
      }

      const id =
        options?.id ||
        `toast-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`;

      if (timersRef.current[id]) {
        clearTimeout(timersRef.current[id]);
        delete timersRef.current[id];
      }

      const newItem: ToastItem = {
        id,
        title: options?.title,
        message,
        variant,
        duration,
      };

      setToasts((prev) => {
        const filtered = prev.filter((item) => item.id !== id);
        const keepCount = Math.max(0, MAX_VISIBLE_TOASTS - 1);
        const dropped =
          keepCount === 0 ? filtered : filtered.slice(0, -keepCount);
        dropped.forEach((d) => {
          if (timersRef.current[d.id]) {
            clearTimeout(timersRef.current[d.id]);
            delete timersRef.current[d.id];
          }
        });
        return [...filtered.slice(-keepCount), newItem];
      });

      if (duration > 0) {
        timersRef.current[id] = setTimeout(() => {
          dismissToast(id);
        }, duration);
      }

      return id;
    },
    [dismissToast]
  );

  useEffect(() => {
    externalShowToast = showToast;
    externalDismissToast = dismissToast;

    if (typeof window !== "undefined") {
      try {
        const saved = sessionStorage.getItem(PENDING_TOAST_KEY);
        if (saved) {
          sessionStorage.removeItem(PENDING_TOAST_KEY);
          const parsed = JSON.parse(saved);
          if (parsed?.message) {
            showToast(parsed.message, {
              title: parsed.title,
              variant: parsed.variant || "success",
              duration: parsed.duration ?? 2800,
            });
          }
        }
      } catch {
        // ignore parse error
      }
    }

    return () => {
      externalShowToast = null;
      externalDismissToast = null;
    };
  }, [showToast, dismissToast]);

  useEffect(() => {
    return () => {
      Object.values(timersRef.current).forEach(clearTimeout);
    };
  }, []);

  return (
    <ToastContext.Provider value={{ showToast, dismissToast, clearAll }}>
      {children}

      {/* Top-Center Compact Soft UI Toast Stack */}
      <div
        aria-live="polite"
        className="fixed top-20 sm:top-24 left-1/2 -translate-x-1/2 z-[100] flex flex-col items-center gap-2 w-fit max-w-[92vw] sm:max-w-md pointer-events-none"
      >
        {toasts.map((item) => (
          <ToastPill key={item.id} item={item} onDismiss={dismissToast} />
        ))}
      </div>
    </ToastContext.Provider>
  );
}

export function useToast() {
  const ctx = useContext(ToastContext);
  if (!ctx) {
    throw new Error("useToast must be used within a CustomToastProvider");
  }
  return ctx;
}