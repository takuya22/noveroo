"use client";

import { ReactNode } from 'react';

interface SecondaryButtonProps {
  children: ReactNode;
  onClick?: () => void;
  type?: 'button' | 'submit' | 'reset';
  className?: string;
  disabled?: boolean;
}

export const SecondaryButton = ({
  children,
  onClick,
  type = 'button',
  className = '',
  disabled = false,
}: SecondaryButtonProps) => {
  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={`rounded-full border border-[var(--secondary)] bg-transparent px-5 py-3 text-[var(--secondary-dark)] font-medium transition-colors hover:bg-[var(--secondary-light)] focus:outline-none focus:ring-2 focus:ring-[var(--secondary)] focus:ring-offset-2 disabled:border-gray-300 disabled:text-gray-300 disabled:cursor-not-allowed shadow-sm ${className}`}
    >
      {children}
    </button>
  );
};
