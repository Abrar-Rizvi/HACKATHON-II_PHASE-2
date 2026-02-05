import React from 'react';

interface ButtonProps {
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'link';
  size?: 'sm' | 'md' | 'lg';
  disabled?: boolean;
  children: React.ReactNode;
  onClick?: () => void;
  className?: string;
  type?: 'button' | 'submit' | 'reset';
}

const Button: React.FC<ButtonProps> = ({
  variant = 'primary',
  size = 'md',
  disabled = false,
  children,
  onClick,
  className = '',
  type = 'button',
}) => {
  // Define base classes
  let baseClasses = 'inline-flex items-center justify-center rounded-md font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none ring-offset-background';

  // Variant classes
  switch (variant) {
    case 'primary':
      baseClasses += ' bg-blue-600 text-white hover:bg-blue-700';
      break;
    case 'secondary':
      baseClasses += ' bg-gray-200 text-gray-900 hover:bg-gray-300';
      break;
    case 'outline':
      baseClasses += ' border border-gray-300 bg-transparent hover:bg-gray-100';
      break;
    case 'ghost':
      baseClasses += ' hover:bg-gray-100';
      break;
    case 'link':
      baseClasses += ' underline-offset-4 hover:underline text-blue-600';
      break;
    default:
      baseClasses += ' bg-blue-600 text-white hover:bg-blue-700';
  }

  // Size classes
  switch (size) {
    case 'sm':
      baseClasses += ' h-9 px-3 text-xs';
      break;
    case 'lg':
      baseClasses += ' h-12 px-8 text-lg';
      break;
    case 'md':
    default:
      baseClasses += ' h-10 px-4 py-2';
  }

  // Combine classes
  const classes = `${baseClasses} ${className}`;

  return (
    <button
      type={type}
      className={classes}
      onClick={onClick}
      disabled={disabled}
      aria-disabled={disabled}
    >
      {children}
    </button>
  );
};

export default Button;