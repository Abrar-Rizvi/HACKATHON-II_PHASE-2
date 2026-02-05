import React from 'react';
import Button from '../Button';

interface EmptyStateProps {
  title?: string;
  description?: string;
  primaryButtonText?: string;
  onPrimaryButtonClick?: () => void;
  secondaryButtonText?: string;
  onSecondaryButtonClick?: () => void;
}

const EmptyState: React.FC<EmptyStateProps> = ({
  title = 'No items found',
  description = 'There are currently no items to display. Get started by creating your first item.',
  primaryButtonText = 'Create Item',
  onPrimaryButtonClick,
  secondaryButtonText,
  onSecondaryButtonClick
}) => {
  return (
    <div className="text-center py-12">
      <div className="text-gray-400 mb-4">
        <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 mx-auto" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
        </svg>
      </div>
      <h3 className="text-lg font-medium text-gray-900 mb-1">{title}</h3>
      <p className="text-gray-500 mb-6">{description}</p>
      <div className="flex justify-center space-x-4">
        <Button variant="primary" onClick={onPrimaryButtonClick}>
          {primaryButtonText}
        </Button>
        {secondaryButtonText && onSecondaryButtonClick && (
          <Button variant="outline" onClick={onSecondaryButtonClick}>
            {secondaryButtonText}
          </Button>
        )}
      </div>
    </div>
  );
};

export default EmptyState;