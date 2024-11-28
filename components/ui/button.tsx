import React from 'react';

export const Button = ({ 
  children, 
  onClick, 
  disabled, 
  className 
}: { 
  children: React.ReactNode; 
  onClick?: () => void; 
  disabled?: boolean; 
  className?: string; 
}) => {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={`px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 disabled:bg-gray-300 ${className}`}
    >
      {children}
    </button>
  );
};