import React from 'react';

interface ButtonProps {
  variant?: 'primary' | 'secondary' | 'destructive' | 'outline' | 'ghost' | 'link';
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
  let baseClasses = 'inline-flex items-center justify-center rounded-md font-medium transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none ring-offset-background';

  // Variant classes using the specified color palette
  switch (variant) {
    case 'primary':
      baseClasses += ' bg-saas-primary-blue text-white hover:bg-[#5a8bad] active:scale-95';
      break;
    case 'secondary':
      baseClasses += ' bg-saas-secondary-teal text-white hover:bg-[#649aa0] active:scale-95';
      break;
    case 'destructive':
      baseClasses += ' bg-saas-accent-red text-white hover:bg-[#862f38] active:scale-95';
      break;
    case 'outline':
      baseClasses += ' border border-saas-primary-blue bg-transparent text-saas-primary-blue hover:bg-saas-primary-blue hover:text-white';
      break;
    case 'ghost':
      baseClasses += ' hover:bg-saas-bg-light';
      break;
    case 'link':
      baseClasses += ' underline-offset-4 hover:underline text-saas-primary-blue';
      break;
    default:
      baseClasses += ' bg-saas-primary-blue text-white hover:bg-[#5a8bad] active:scale-95';
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