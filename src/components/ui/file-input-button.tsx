import React, { useRef } from 'react';
import { Button } from './button';

interface FileInputButtonProps {
  onFileSelect: (file: File) => void;
  accept?: string;
  children: React.ReactNode;
  variant?: 'default' | 'secondary' | 'outline' | 'destructive' | 'ghost' | 'link';
  size?: 'sm' | 'default' | 'lg' | 'icon';
  disabled?: boolean;
}

export const FileInputButton: React.FC<FileInputButtonProps> = ({
  onFileSelect,
  accept,
  children,
  variant = 'default',
  size = 'default',
  disabled = false,
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleClick = () => {
    if (!disabled && fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      onFileSelect(e.target.files[0]);
    }
  };

  return (
    <>
      <input
        ref={fileInputRef}
        type="file"
        accept={accept}
        onChange={handleFileChange}
        className="hidden"
        disabled={disabled}
      />
      <Button
        onClick={handleClick}
        variant={variant}
        size={size}
        disabled={disabled}
      >
        {children}
      </Button>
    </>
  );
};
