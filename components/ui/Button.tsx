'use client';
import { ReactNode, ButtonHTMLAttributes } from 'react';
import { clsx } from 'clsx';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'ghost' | 'outline';
  size?: 'sm' | 'md' | 'lg';
  children: ReactNode;
  loading?: boolean;
  fullWidth?: boolean;
}

export default function Button({
  variant = 'primary', size = 'md', children, loading, fullWidth, className, disabled, ...props
}: ButtonProps) {
  const base = 'inline-flex items-center justify-center font-medium transition-all duration-200 cursor-pointer select-none';

  const variants = {
    primary: 'bg-[#1B3A6B] text-white hover:bg-[#152E56] active:scale-[0.98]',
    secondary: 'bg-[#E8EFF8] text-[#1B3A6B] hover:bg-[#D5E4F5] active:scale-[0.98]',
    ghost: 'bg-transparent text-[#6B7280] hover:bg-[#F4EFE8] active:scale-[0.98]',
    outline: 'bg-white border border-[#E8E2D9] text-[#1A1A2E] hover:bg-[#F9F6F1] active:scale-[0.98]',
  };

  const sizes = {
    sm: 'px-4 py-2 text-sm rounded-[12px] gap-1.5',
    md: 'px-5 py-3 text-sm rounded-[14px] gap-2',
    lg: 'px-6 py-3.5 text-base rounded-[16px] gap-2',
  };

  return (
    <button
      {...props}
      disabled={disabled || loading}
      className={clsx(base, variants[variant], sizes[size], fullWidth && 'w-full', (disabled || loading) && 'opacity-50 cursor-not-allowed', className)}
    >
      {loading ? (
        <>
          <span className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
          <span>Loading...</span>
        </>
      ) : children}
    </button>
  );
}
