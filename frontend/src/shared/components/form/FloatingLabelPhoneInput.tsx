"use client";

import React from "react";
import { cn, hasValue } from "@/shared/lib/utils";
import PhoneInput from "react-phone-number-input";
import "react-phone-number-input/style.css";

export interface FloatingLabelPhoneInputProps
  extends Omit<React.InputHTMLAttributes<HTMLInputElement>, "onChange"> {
  value: string;
  label: string;
  labelClassName?: string;
  error?: string;
  onChange: (value?: string) => void;
  disabled?: boolean; // Add the disabled prop
}

export const FloatingLabelPhoneInput: React.FC<
  FloatingLabelPhoneInputProps
> = ({
  label,
  name,
  value,
  onChange,
  className,
  labelClassName,
  error,
  disabled = false,
  ...props
}) => {
  const [localValue, setLocalValue] = React.useState(value || "");

  // Keep local value in sync when RHF resets
  React.useEffect(() => {
    setLocalValue(value || "");
  }, [value]);

  const handleBlur = (event: React.FocusEvent<HTMLInputElement>) => {
    // Sync local value to RHF on blur
    const normalized = localValue.replace(/\D/g, "");
    onChange?.(normalized);
    props.onBlur?.(event);
  };

  return (
    <div
      className={cn(
        "w-full relative",
        disabled ? "transition-none opacity-50" : "",
      )}
    >
      <PhoneInput
        name={name}
        value={localValue}
        onChange={(val) => {
          if (disabled) return;
          setLocalValue(val || "");
          onChange?.(val || "");
        }}
        onBlur={handleBlur}
        className={cn(
          "w-full h-10 border border-gray-300 text-base bg-input dark:bg-input disabled:opacity-100 rounded-md px-3 py-0 shadow-xs", // Always apply border-gray-300
          "transition-colors duration-150 ease-in-out",
          error &&
            "border-red-500 active:ring-red-500 active:outline-hidden active:ring-2 active:ring-offset-1 active:ring-offset-red-100", // Error handling
          disabled
            ? "cursor-not-allowed focus:outline-none focus:ring-0 hover:ring-0 active:ring-0" // Apply disabled styles: opacity and no interaction
            : "focus-visible:ring-blue-600 focus-visible:outline-hidden focus-visible:ring-2 focus-visible:ring-offset-1 focus-visible:ring-offset-blue-100 ",
          className,
        )}
        {...props}
        disabled={disabled}
      />
      <label
        htmlFor={name}
        className={cn(
          "flex items-center text-sm font-medium bg-input text-gray-300 absolute transition-all h-4 px-1 pointer-events-none",
          labelClassName,
          hasValue(localValue)
            ? "-top-4 left-2 text-xs rounded-t-md border-t border-x border border-gray-300 peer-hover:border-blue-500 peer-focus-visible:border-blue-600"
            : "top-3 left-14 text-base",
          disabled && "peer-hover:border-gray-300",
        )}
      >
        {label}
      </label>
      {error && <p className="text-red-500 text-xs mt-1">{error}</p>}
    </div>
  );
};
