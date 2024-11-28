import React from 'react';

export const Textarea = ({
  placeholder,
  value,
  onChange,
  className,
}: {
  placeholder?: string;
  value?: string;
  onChange?: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
  className?: string;
}) => {
  return (
    <textarea
      placeholder={placeholder}
      value={value}
      onChange={onChange}
      className={`w-full border rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-blue-500 ${className}`}
    />
  );
};