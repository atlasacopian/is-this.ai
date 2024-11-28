import React from 'react';

interface AlertProps {
  variant?: 'default' | 'destructive';
  className?: string;
  children: React.ReactNode;
}

export const Alert = ({ 
  variant = 'default', 
  className = '', 
  children 
}: AlertProps) => {
  return (
    <div className={`rounded-md p-4 ${className}`}>
      {children}
    </div>
  );
};

export const AlertDescription = ({
  className = '',
  children
}: {
  className?: string;
  children: React.ReactNode;
}) => {
  return (
    <div className={`text-sm ${className}`}>
      {children}
    </div>
  );
};