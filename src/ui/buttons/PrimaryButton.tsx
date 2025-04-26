"use client";

import { ReactNode } from 'react';

interface PrimaryButtonProps {
  children: ReactNode;
  onClick?: () => void;
  type?: 'button' | 'submit' | 'reset';
  className?: string;
  disabled?: boolean;
}

export const PrimaryButton = ({
  children,
  onClick,
  type = 'button',
  className = '',
  disabled = false,
}: PrimaryButtonProps) => {
  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={`rounded-full bg-[var(--primary)] px-5 py-3 text-white font-medium transition-colors cursor-pointer hover:bg-[var(--primary-dark)] focus:outline-none focus:ring-2 focus:ring-[var(--primary)] focus:ring-offset-2 disabled:bg-gray-300 disabled:cursor-not-allowed shadow-sm ${className}`}
    >
      {children}
    </button>
  );
};
