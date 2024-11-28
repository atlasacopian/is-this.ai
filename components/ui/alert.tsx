import React from 'react';

export const Alert = ({ variant = 'default', className, children }) => {
  return (
    <div
      className={`rounded-md p-4 ${
        variant === 'default'
          ? 'bg-blue-50 text-blue-900'
          : 'bg-red-50 text-red-900'
      } ${className}`}
    >
      {children}
    </div>
  );
};

export const AlertTitle = ({ children }) => {
  return <div className="font-medium">{children}</div>;
};

export const AlertDescription = ({ children }) => {
  return <div className="mt-2 text-sm">{children}</div>;
};