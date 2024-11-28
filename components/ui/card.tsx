import React from 'react';

export const Card = ({ children, className }: { children: React.ReactNode; className?: string }) => {
  return (
    <div className={`border rounded-lg shadow-md ${className}`}>
      {children}
    </div>
  );
};

export const CardHeader = ({ children, className }: { children: React.ReactNode; className?: string }) => {
  return <div className={`p-4 border-b ${className}`}>{children}</div>;
};

export const CardTitle = ({ children, className }: { children: React.ReactNode; className?: string }) => {
  return <h2 className={`text-xl font-semibold ${className}`}>{children}</h2>;
};

export const CardContent = ({ children, className }: { children: React.ReactNode; className?: string }) => {
  return <div className={`p-4 ${className}`}>{children}</div>;
};