import React from 'react';

interface InputProps {
  type?: 'text' | 'email' | 'password' | 'tel' | 'url';
  placeholder?: string;
  value?: string;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
  error?: string;
  label?: string;
  required?: boolean;
  className?: string;
}

const Input: React.FC<InputProps> = ({
  type = 'text',
  placeholder,
  value,
  onChange,
  error,
  label,
  required = false,
  className = '',
}) => {
  const baseClasses = 'flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50';
  const errorClasses = error ? 'border-red-500' : '';

  const combinedClasses = `${baseClasses} ${errorClasses} ${className}`;

  return (
    <div className="grid w-full gap-1.5">
      {label && (
        <label htmlFor={placeholder} className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
          {label} {required && <span className="text-red-500">*</span>}
        </label>
      )}
      <input
        type={type}
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        required={required}
        className={combinedClasses}
        aria-invalid={!!error}
        aria-describedby={error ? `${placeholder}-error` : undefined}
      />
      {error && (
        <p id={`${placeholder}-error`} className="text-sm font-medium text-red-500">
          {error}
        </p>
      )}
    </div>
  );
};

export default Input;