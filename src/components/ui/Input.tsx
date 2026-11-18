import { InputHTMLAttributes, forwardRef } from "react";

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ label, error, className, ...props }, ref) => {
    return (
      <div className="flex flex-col gap-1.5 w-full">
        {label && <label className="text-sm font-medium text-fixlab-charcoal">{label}</label>}
        <input
          ref={ref}
          className={`w-full px-4 py-3 rounded-xl border bg-white/50 backdrop-blur-sm focus:outline-none focus:ring-2 transition-all ${
            error 
              ? "border-red-400 focus:ring-red-200" 
              : "border-gray-200 focus:border-fixlab-green focus:ring-fixlab-mint/30"
          } ${className}`}
          {...props}
        />
        {error && <span className="text-xs text-red-500 font-medium">{error}</span>}
      </div>
    );
  }
);
Input.displayName = "Input";