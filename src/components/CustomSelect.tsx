import React from 'react';

interface CustomSelectProps {
  value: string | number;
  onChange: (value: string | number) => void;
  options: {
    value: string | number;
    label: string;
  }[];
  className?: string;
  disabled?: boolean;
  placeholder?: string;
}

export const CustomSelect: React.FC<CustomSelectProps> = ({
  value,
  onChange,
  options,
  className = '',
  disabled = false,
  placeholder,
}) => {
  return (
    <select
      value={value}
      onChange={(e) => {
        const val = e.target.value;
        onChange(isNaN(Number(val)) ? val : Number(val));
      }}
      disabled={disabled}
      className={`p-3 border rounded-lg bg-background focus:outline-none focus:ring-2 focus:ring-primary/50 ${className}`}
    >
      {placeholder && (
        <option value="" disabled>
          {placeholder}
        </option>
      )}
      {options.map((option) => (
        <option key={option.value} value={option.value}>
          {option.label}
        </option>
      ))}
    </select>
  );
};
