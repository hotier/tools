import React from "react";

interface ButtonProps {
  children: React.ReactNode;
  onClick?: () => void;
  variant?: "primary" | "secondary" | "success" | "danger" | "info" | "warning";
  disabled?: boolean;
  className?: string;
  type?: "button" | "submit" | "reset";
}

export function Button({
  children,
  onClick,
  variant = "primary",
  disabled = false,
  className = "",
  type = "button",
}: ButtonProps) {
  const baseClasses = "px-4 py-2 rounded-lg transition-all duration-200";

  const variantClasses = {
    primary: "bg-blue-500/10 text-blue-500 border border-blue-500/30 hover:bg-blue-500 hover:text-white hover:border-blue-500",
    secondary: "bg-slate-500/10 text-slate-500 border border-slate-500/30 hover:bg-slate-500 hover:text-white hover:border-slate-500",
    success: "bg-green-500/10 text-green-500 border border-green-500/30 hover:bg-green-500 hover:text-white hover:border-green-500",
    danger: "bg-red-500/10 text-red-500 border border-red-500/30 hover:bg-red-500 hover:text-white hover:border-red-500",
    info: "bg-violet-500/10 text-violet-500 border border-violet-500/30 hover:bg-violet-500 hover:text-white hover:border-violet-500",
    warning: "bg-amber-500/10 text-amber-500 border border-amber-500/30 hover:bg-amber-500 hover:text-white hover:border-amber-500",
  };

  const disabledClasses = disabled
    ? "opacity-50 cursor-not-allowed"
    : "";

  const allClasses = [baseClasses, variantClasses[variant], disabledClasses, className].filter(Boolean).join(" ");

  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={allClasses}
    >
      {children}
    </button>
  );
}

export function FileInputButton({
  onFileSelect,
  accept = ".txt,.xlsx,.xls",
  children = "导入文件",
  className = "",
}: {
  onFileSelect: (file: File) => void;
  accept?: string;
  children?: React.ReactNode;
  className?: string;
}) {
  const baseClasses = "px-4 py-2 rounded-lg transition-all duration-200";

  const variantClasses = "bg-blue-500/10 text-blue-500 border border-blue-500/30 hover:bg-blue-500 hover:text-white hover:border-blue-500";

  const allClasses = [baseClasses, variantClasses, className].filter(Boolean).join(" ");

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      onFileSelect(file);
      e.target.value = "";
    }
  };

  return (
    <label className={allClasses}>
      {children}
      <input
        type="file"
        accept={accept}
        onChange={handleFileChange}
        className="hidden"
      />
    </label>
  );
}