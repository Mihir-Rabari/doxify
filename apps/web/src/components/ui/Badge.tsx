import { ReactNode } from 'react';
import { LucideIcon } from 'lucide-react';

interface BadgeProps {
  variant?: 'success' | 'error' | 'warning' | 'info' | 'default';
  size?: 'sm' | 'md' | 'lg';
  icon?: LucideIcon;
  children: ReactNode;
  className?: string;
}

export default function Badge({
  variant = 'default',
  size = 'md',
  icon: Icon,
  children,
  className = '',
}: BadgeProps) {
  const variantStyles = {
    success: 'bg-emerald-100 dark:bg-emerald-500/20 text-emerald-700 dark:text-emerald-300 border-emerald-200 dark:border-emerald-500/30',
    error: 'bg-red-100 dark:bg-red-500/20 text-red-700 dark:text-red-300 border-red-200 dark:border-red-500/30',
    warning: 'bg-yellow-100 dark:bg-yellow-500/20 text-yellow-700 dark:text-yellow-300 border-yellow-200 dark:border-yellow-500/30',
    info: 'bg-blue-100 dark:bg-blue-500/20 text-blue-700 dark:text-blue-300 border-blue-200 dark:border-blue-500/30',
    default: 'bg-gray-100 dark:bg-neutral-800 text-gray-700 dark:text-neutral-300 border-gray-200 dark:border-neutral-700',
  };

  const sizeStyles = {
    sm: 'px-2 py-0.5 text-xs',
    md: 'px-2.5 py-1 text-sm',
    lg: 'px-3 py-1.5 text-base',
  };

  const iconSizeStyles = {
    sm: 'w-3 h-3',
    md: 'w-3.5 h-3.5',
    lg: 'w-4 h-4',
  };

  return (
    <span
      className={`inline-flex items-center gap-1.5 font-medium rounded-full border ${variantStyles[variant]} ${sizeStyles[size]} ${className}`}
    >
      {Icon && <Icon className={iconSizeStyles[size]} />}
      {children}
    </span>
  );
}
