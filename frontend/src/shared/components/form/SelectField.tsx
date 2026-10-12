import React from "react";
import { cn } from "@/shared/lib/utils";

interface SelectFieldProps {
  label?: string;
  subLabel?: string;
  value: string | number | undefined;
  onChange: (value: number | undefined) => void;
  options: Array<{ id: number; name: string }>;
  placeholder?: string;
  error?: string;
  disabled?: boolean;
  className?: string;
  showEmptyOption?: boolean;
  emptyOptionText?: string;
}

const SelectField: React.FC<SelectFieldProps> = ({
  label,
  subLabel,
  value,
  onChange,
  options,
  placeholder = "Выберите опцию",
  error,
  disabled = false,
  className = "",
  showEmptyOption = true,
  emptyOptionText,
}) => {
  const getEmptyOptionText = () => {
    if (emptyOptionText) return emptyOptionText;
    if (options.length === 0) return "Нет доступных опций";
    return placeholder;
  };

  return (
    <div className={cn("flex flex-col gap-1", className)}>
      {label && <label className="font-medium text-[12px]">{label}</label>}
      {subLabel && (
        <label className="font-normal text-[12px] mb-2">{subLabel}</label>
      )}
      <select
        className={cn(
          "custom-select disabled:bg-gray-100 disabled:text-gray-500 disabled:cursor-not-allowed",
          error ? "border-red-500" : "",
        )}
        value={value || ""}
        onChange={(e) => {
          const value = e.target.value ? Number(e.target.value) : undefined;
          onChange(value);
        }}
        disabled={disabled}
      >
        {showEmptyOption && <option value="">{getEmptyOptionText()}</option>}
        {options.map((option) => (
          <option key={option.id} value={option.id}>
            {option.name}
          </option>
        ))}
      </select>
      {error && <p className="text-red-500 text-sm">{error}</p>}
    </div>
  );
};

export default SelectField;
