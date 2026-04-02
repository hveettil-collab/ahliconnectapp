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
    primary: 'bg-[#9D63F6] text-white hover:bg-[#8A44F4] active:scale-[0.98]',
    secondary: 'bg-[#F7F1FF] text-[#9D63F6] hover:bg-[#EDE5F9] active:scale-[0.98]',
    ghost: 'bg-transparent text-[#666D80] hover:bg-[#F8F9FB] active:scale-[0.98]',
    outline: 'bg-white border border-[#DFE1E6] text-[#15161E] hover:bg-[#F8F9FB] active:scale-[0.98]',
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
