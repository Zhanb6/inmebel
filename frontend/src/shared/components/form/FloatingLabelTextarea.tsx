import React from "react";
import { cn, hasValue } from "@/shared/lib/utils";

export interface FloatingLabelTextareaProps
  extends Omit<React.InputHTMLAttributes<HTMLTextAreaElement>, "onChange"> {
  label: string;
  labelClassName?: string;
  error?: string;
  onChange?: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
}

export const FloatingLabelTextarea: React.FC<FloatingLabelTextareaProps> = ({
  label,
  value,
  onChange,
  className,
  labelClassName,
  error,
  ...props
}) => {
  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    // For onChange, just pass the raw value
    if (onChange) {
      onChange(e);
    }
  };

  return (
    <div
      className={cn(
        "w-full relative",
        props.disabled ? "transition-none opacity-50" : "",
      )}
    >
      <textarea
        name={props.name}
        value={value}
        onChange={handleChange}
        className={cn(
          "peer w-full h-14 px-3 py-2 rounded-md block leading-normal text-base", // Always apply border-gray-300
          "transition-colors duration-150 ease-in-out outline outline-gray-300 bg-input disabled:opacity-100 shadow-xs",
          props.disabled
            ? "cursor-not-allowed focus-visible:outline-none" // Apply disabled styles: opacity and no interaction
            : "focus-visible:outline-blue-600 hover:outline-blue-500",
          error &&
            "active:outline-red-500 focus-visible:outline-red-600 hover:outline-red-500", // Error handling
          className,
        )}
        {...props}
      />
      <label
        htmlFor={props.name}
        className={cn(
          "flex items-center text-sm font-medium bg-input text-gray-300 absolute transition-all px-1 pointer-events-none",
          labelClassName,
          hasValue(value)
            ? "-top-4 left-2 h-4 text-xs rounded-t-md border-t border-x border border-gray-300 peer-hover:border-blue-500 peer-focus-visible:border-blue-600"
            : "top-2 left-2 text-base",
          props.disabled && "peer-hover:border-gray-300",
        )}
      >
        {label}
      </label>
      {error && <p className="text-red-500 text-xs mt-1">{error}</p>}
    </div>
  );
};
