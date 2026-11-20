import { InputHTMLAttributes, forwardRef } from "react";

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ label, error, className, ...props }, ref) => {
    return (
      <div className="flex flex-col gap-1.5 w-full">
        {label && <label className="text-sm font-bold text-gray-800 ml-1">{label}</label>}
        <input
          ref={ref}
          // ইনপুটও ট্রান্সপারেন্ট করা হলো
          className={`w-full px-5 py-3.5 rounded-xl bg-white/20 border border-white/50 text-gray-900 placeholder-gray-500 outline-none transition-all duration-300 focus:border-[#ff5722] focus:bg-white/40 focus:ring-2 focus:ring-[#ff5722]/20 ${
            error ? "border-red-500 focus:border-red-500 focus:ring-red-500/20" : ""
          } ${className}`}
          {...props}
        />
        {error && <span className="text-xs text-red-500 font-bold ml-2 mt-1">{error}</span>}
      </div>
    );
  }
);
Input.displayName = "Input";