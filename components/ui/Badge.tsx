import { clsx } from 'clsx';

interface BadgeProps {
  children: React.ReactNode;
  variant?: 'default' | 'success' | 'warning' | 'info' | 'gold' | 'outline';
  size?: 'sm' | 'md';
}

export default function Badge({ children, variant = 'default', size = 'sm' }: BadgeProps) {
  const variants = {
    default: 'bg-[#E8EFF8] text-[#1B3A6B]',
    success: 'bg-[#D1FAE5] text-[#065F46]',
    warning: 'bg-[#FEF3C7] text-[#92400E]',
    info: 'bg-[#E0F2FE] text-[#0369A1]',
    gold: 'bg-[#FEF3C7] text-[#B8962E]',
    outline: 'bg-white border border-[#E8E2D9] text-[#6B7280]',
  };
  const sizes = {
    sm: 'px-2.5 py-0.5 text-xs',
    md: 'px-3 py-1 text-sm',
  };
  return (
    <span className={clsx('inline-flex items-center font-medium rounded-full', variants[variant], sizes[size])}>
      {children}
    </span>
  );
}
