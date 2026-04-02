'use client';
import { forwardRef, InputHTMLAttributes, ReactNode } from 'react';
import { clsx } from 'clsx';

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  hint?: string;
  leftIcon?: ReactNode;
  rightIcon?: ReactNode;
}

const Input = forwardRef<HTMLInputElement, InputProps>(function Input(
  { label, error, hint, leftIcon, rightIcon, className, ...props },
  ref
) {
  return (
    <div className="flex flex-col gap-1.5">
      {label && <label className="text-sm font-medium text-[#374151]">{label}</label>}
      <div className="relative">
        {leftIcon && (
          <div className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#9CA3AF]">{leftIcon}</div>
        )}
        <input
          ref={ref}
          {...props}
          className={clsx(
            'w-full border rounded-[14px] bg-white text-[#1A1A2E] placeholder:text-[#9CA3AF]',
            'px-4 py-3 text-sm transition-all duration-200 outline-none',
            'border-[#E8E2D9] focus:border-[#1B3A6B] focus:ring-2 focus:ring-[#1B3A6B]/10',
            leftIcon && 'pl-10',
            rightIcon && 'pr-10',
            error && 'border-red-400 focus:border-red-400 focus:ring-red-100',
            className
          )}
        />
        {rightIcon && (
          <div className="absolute right-3.5 top-1/2 -translate-y-1/2 text-[#9CA3AF]">{rightIcon}</div>
        )}
      </div>
      {error && <p className="text-xs text-red-500">{error}</p>}
      {hint && !error && <p className="text-xs text-[#9CA3AF]">{hint}</p>}
    </div>
  );
});

export default Input;
