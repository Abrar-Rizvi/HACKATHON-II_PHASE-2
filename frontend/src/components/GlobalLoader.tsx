import React from 'react';
import LoadingSpinner from './LoadingSpinner';

interface GlobalLoaderProps {
  loading: boolean;
}

const GlobalLoader: React.FC<GlobalLoaderProps> = ({ loading }) => {
  if (!loading) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-30 flex items-center justify-center z-50">
      <LoadingSpinner size="lg" />
    </div>
  );
};

export default GlobalLoader;