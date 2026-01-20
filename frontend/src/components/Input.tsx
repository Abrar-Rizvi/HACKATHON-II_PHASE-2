import React, { InputHTMLAttributes } from 'react';

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  helperText?: string;
}

const Input: React.FC<InputProps> = ({
  label,
  error,
  helperText,
  className = '',
  ...props
}) => {
  const baseClasses = 'flex flex-col w-full';
  const inputBaseClasses = 'flex h-10 w-full rounded-md border px-3 py-2 text-sm bg-white shadow-sm transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50';
  const borderClasses = error ? 'border-red-500 focus-visible:ring-red-500' : 'border-input';
  const combinedInputClasses = `${inputBaseClasses} ${borderClasses} ${className}`;

  return (
    <div className={baseClasses}>
      {label && (
        <label className="mb-2 block text-sm font-medium">
          {label}
        </label>
      )}
      <input
        className={combinedInputClasses}
        {...props}
      />
      {helperText && !error && (
        <p className="mt-1 text-xs text-gray-500">{helperText}</p>
      )}
      {error && (
        <p className="mt-1 text-xs text-red-600">{error}</p>
      )}
    </div>
  );
};

export default Input;