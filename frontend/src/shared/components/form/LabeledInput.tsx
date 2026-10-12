import React from "react";
import { cn } from "@/shared/lib/utils";

export interface LabeledInputProps
  extends Omit<React.InputHTMLAttributes<HTMLInputElement>, "onChange"> {
  label?: string;
  labelClassName?: string;
  wrapperClassName?: string;
  error?: string;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

export const LabeledInput: React.FC<LabeledInputProps> = ({
  label,
  name,
  value,
  onChange,
  type = "text",
  className,
  labelClassName,
  wrapperClassName,
  error,
  ...props
}) => {
  const handleBlur = (e: React.FocusEvent<HTMLInputElement>) => {
    let newVal = e.target.value.trim();
    if (type === "number" && newVal !== "") {
      // Use parseFloat to handle float numbers; this will remove leading zeros.
      newVal = String(parseFloat(newVal));
      // Create a synthetic event to update the value
      if (onChange) {
        // We create a new event object with the normalized value.
        onChange({
          ...e,
          target: { ...e.target, value: newVal },
        } as React.ChangeEvent<HTMLInputElement>);
      }
    }
  };

  return (
    <div
      className={cn(
        "w-full flex flex-col",
        props.disabled ? "transition-none opacity-50" : "",
        wrapperClassName,
      )}
    >
      {label && (
        <label
          htmlFor={name}
          className={cn(
            "flex items-center text-sm font-medium px-3 py-2",
            labelClassName,
          )}
        >
          {label}
        </label>
      )}
      <input
        type={type}
        name={name}
        value={value}
        onChange={onChange}
        onBlur={handleBlur}
        className={cn(
          "w-full h-10 outline outline-[#cacdd0] text-base rounded-md px-3 py-2 shadow-xs", // заменён цвет outline
          "transition-colors duration-150 ease-in-out",
          props.disabled
            ? "cursor-not-allowed focus-visible:outline-none"
            : "focus-visible:outline-[#cacdd0] hover:outline-[#cacdd0]",
          error &&
            "active:outline-red-500 focus-visible:outline-red-600 hover:outline-red-500",
          className,
        )}
        {...props}
      />
      {error && <p className="text-red-500 text-xs mt-1">{error}</p>}
    </div>
  );
};
