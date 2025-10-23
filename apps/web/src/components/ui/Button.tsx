import { ButtonHTMLAttributes, ReactNode } from 'react';
import { LucideIcon } from 'lucide-react';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'danger' | 'ghost' | 'outline';
  size?: 'sm' | 'md' | 'lg';
  icon?: LucideIcon;
  iconPosition?: 'left' | 'right';
  isLoading?: boolean;
  children: ReactNode;
}

export default function Button({
  variant = 'primary',
  size = 'md',
  icon: Icon,
  iconPosition = 'left',
  isLoading = false,
  children,
  className = '',
  disabled,
  ...props
}: ButtonProps) {
  const baseStyles = 'inline-flex items-center justify-center gap-2 font-medium rounded-lg transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed';

  const variantStyles = {
    primary: 'bg-emerald-600 hover:bg-emerald-700 text-white shadow-sm hover:shadow-md',
    secondary: 'bg-gray-100 dark:bg-neutral-800 hover:bg-gray-200 dark:hover:bg-neutral-700 text-gray-900 dark:text-white',
    danger: 'bg-red-600 hover:bg-red-700 text-white shadow-sm hover:shadow-md',
    ghost: 'hover:bg-gray-100 dark:hover:bg-neutral-800 text-gray-700 dark:text-neutral-300',
    outline: 'border border-gray-300 dark:border-neutral-700 hover:bg-gray-50 dark:hover:bg-neutral-800 text-gray-700 dark:text-neutral-300',
  };

  const sizeStyles = {
    sm: 'px-3 py-1.5 text-sm',
    md: 'px-4 py-2 text-sm',
    lg: 'px-6 py-3 text-base',
  };

  const iconSizeStyles = {
    sm: 'w-3.5 h-3.5',
    md: 'w-4 h-4',
    lg: 'w-5 h-5',
  };

  return (
    <button
      className={`${baseStyles} ${variantStyles[variant]} ${sizeStyles[size]} ${className}`}
      disabled={disabled || isLoading}
      {...props}
    >
      {isLoading ? (
        <>
          <svg className={`animate-spin ${iconSizeStyles[size]}`} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
          Loading...
        </>
      ) : (
        <>
          {Icon && iconPosition === 'left' && <Icon className={iconSizeStyles[size]} />}
          {children}
          {Icon && iconPosition === 'right' && <Icon className={iconSizeStyles[size]} />}
        </>
      )}
    </button>
  );
}
