import { ButtonHTMLAttributes, forwardRef } from 'react';
import { clsx } from 'clsx';
import { Loader2 } from 'lucide-react';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'danger' | 'success';
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
  isLoading?: boolean;
  fullWidth?: boolean;
  icon?: React.ReactNode;
}

const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = 'primary', size = 'md', isLoading, children, disabled, fullWidth, icon, ...props }, ref) => {
    const baseStyles = 'inline-flex items-center justify-center gap-2 rounded-xl font-semibold transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-60 disabled:cursor-not-allowed active:scale-[0.98] relative overflow-hidden';
    
    const variants = {
      primary: 'bg-gradient-to-r from-primary-600 to-primary-500 text-white shadow-soft hover:shadow-medium hover:from-primary-700 hover:to-primary-600 focus:ring-primary-500 dark:from-primary-500 dark:to-primary-600 dark:hover:from-primary-600 dark:hover:to-primary-700',
      secondary: 'bg-gray-100 text-gray-900 hover:bg-gray-200 shadow-soft hover:shadow-medium focus:ring-gray-500 dark:bg-dark-bg-tertiary dark:text-dark-text-primary dark:hover:bg-dark-bg-hover',
      outline: 'border-2 border-gray-300 bg-transparent text-gray-700 hover:bg-gray-50 hover:border-gray-400 focus:ring-primary-500 dark:border-dark-border-primary dark:text-dark-text-secondary dark:hover:bg-dark-bg-tertiary dark:hover:border-dark-border-secondary',
      ghost: 'text-gray-700 hover:bg-gray-100 hover:text-gray-900 focus:ring-gray-500 dark:text-dark-text-secondary dark:hover:bg-dark-bg-tertiary dark:hover:text-dark-text-primary',
      danger: 'bg-gradient-to-r from-red-600 to-red-500 text-white shadow-soft hover:shadow-medium hover:from-red-700 hover:to-red-600 focus:ring-red-500',
      success: 'bg-gradient-to-r from-emerald-600 to-emerald-500 text-white shadow-soft hover:shadow-medium hover:from-emerald-700 hover:to-emerald-600 focus:ring-emerald-500',
    };

    const sizes = {
      xs: 'px-2.5 py-1.5 text-xs',
      sm: 'px-3 py-2 text-sm',
      md: 'px-4 py-2.5 text-sm',
      lg: 'px-6 py-3 text-base',
      xl: 'px-8 py-4 text-lg',
    };

    return (
      <button
        ref={ref}
        className={clsx(
          baseStyles,
          variants[variant],
          sizes[size],
          fullWidth && 'w-full',
          className
        )}
        disabled={disabled || isLoading}
        {...props}
      >
        {isLoading && (
          <Loader2 className="w-4 h-4 animate-spin" />
        )}
        {!isLoading && icon && icon}
        {children}
      </button>
    );
  }
);

Button.displayName = 'Button';

export default Button;
