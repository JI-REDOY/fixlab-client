import { InputHTMLAttributes, forwardRef } from "react";

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ label, error, className, ...props }, ref) => {
    return (
      <div className="flex flex-col gap-1.5 w-full">
        {label && <label className="text-sm font-medium text-fixlab-charcoal ml-1">{label}</label>}
        <input
          ref={ref}
          className={`w-full px-5 py-3.5 rounded-2xl neumorphic-input text-fixlab-charcoal placeholder-fixlab-gray ${
            error ? "border-red-400" : ""
          } ${className}`}
          {...props}
        />
        {error && <span className="text-xs text-red-500 font-medium ml-2 mt-1">{error}</span>}
      </div>
    );
  }
);
Input.displayName = "Input";