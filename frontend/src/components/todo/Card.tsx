import React from 'react';

interface CardProps {
  children: React.ReactNode;
  className?: string;
  variant?: 'default' | 'elevated';
}

const Card: React.FC<CardProps> = ({ children, className = '', variant = 'default' }) => {
  const baseClasses = 'rounded-lg border shadow-sm transition-all duration-200';

  const variantClasses = variant === 'elevated'
    ? 'bg-white border-saas-bg-light shadow-md hover:shadow-lg'
    : 'bg-white border-saas-bg-light';

  const classes = `${baseClasses} ${variantClasses} ${className}`;

  return (
    <div className={classes}>
      {children}
    </div>
  );
};

interface CardHeaderProps {
  children: React.ReactNode;
  className?: string;
}

const CardHeader: React.FC<CardHeaderProps> = ({ children, className = '' }) => {
  const classes = `p-4 border-b border-saas-bg-light ${className}`;

  return (
    <div className={classes}>
      {children}
    </div>
  );
};

interface CardContentProps {
  children: React.ReactNode;
  className?: string;
}

const CardContent: React.FC<CardContentProps> = ({ children, className = '' }) => {
  const classes = `p-4 ${className}`;

  return (
    <div className={classes}>
      {children}
    </div>
  );
};

interface CardFooterProps {
  children: React.ReactNode;
  className?: string;
}

const CardFooter: React.FC<CardFooterProps> = ({ children, className = '' }) => {
  const classes = `p-4 border-t border-saas-bg-light ${className}`;

  return (
    <div className={classes}>
      {children}
    </div>
  );
};

Card.Header = CardHeader;
Card.Content = CardContent;
Card.Footer = CardFooter;

export default Card;