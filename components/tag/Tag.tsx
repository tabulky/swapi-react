import React from "react";

interface TagProps {
  children: React.ReactNode;
  className?: string;
}

export const Tag: React.FC<TagProps> = ({ children, className = "" }) => {
  return (
    <span
      className={`inline-block px-1 m-0.5 rounded-sm text-sm font-medium bg-zinc-100 dark:bg-zinc-800 border border-zinc-300 dark:border-zinc-700 ${className}`}
    >
      {children}
    </span>
  );
};
