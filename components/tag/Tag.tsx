import React from "react";

interface TagProps {
  children: React.ReactNode;
  className?: string;
}

export const Tag: React.FC<TagProps> = ({ children, className = "" }) => {
  return (
    <span
      className={`inline-block px-2 mx-0.5 rounded-sm text-sm font-medium bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200 ${className}`}
    >
      {children}
    </span>
  );
};
