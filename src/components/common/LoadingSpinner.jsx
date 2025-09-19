import React from 'react';

export const LoadingSpinner = ({ size = 'md', color = 'primary' }) => {
  const sizeClasses = {
    sm: 'w-4 h-4',
    md: 'w-8 h-8',
    lg: 'w-12 h-12',
    xl: 'w-16 h-16',
  };

  const colorClasses = {
    primary: 'border-blue-600',
    secondary: 'border-teal-600',
    white: 'border-white',
  };

  return (
    <div className="flex justify-center items-center">
      <div
        className={`
          ${sizeClasses[size]} 
          ${colorClasses[color]} 
          border-4 border-solid border-opacity-30 border-t-opacity-100 
          rounded-full animate-spin
        `}
      />
    </div>
  );
};