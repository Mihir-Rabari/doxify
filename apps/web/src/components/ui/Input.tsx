import { InputHTMLAttributes, forwardRef } from 'react';
import { LucideIcon } from 'lucide-react';

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  helperText?: string;
  icon?: LucideIcon;
  iconPosition?: 'left' | 'right';
}

const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ label, error, helperText, icon: Icon, iconPosition = 'left', className = '', ...props }, ref) => {
    return (
      <div className="w-full">
        {label && (
          <label className="block text-sm font-medium text-gray-700 dark:text-neutral-300 mb-2">
            {label}
          </label>
        )}
        <div className="relative">
          {Icon && iconPosition === 'left' && (
            <div className="absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none">
              <Icon className="w-5 h-5 text-gray-400 dark:text-neutral-500" />
            </div>
          )}
          <input
            ref={ref}
            className={`
              w-full px-4 py-2 
              ${Icon && iconPosition === 'left' ? 'pl-10' : ''}
              ${Icon && iconPosition === 'right' ? 'pr-10' : ''}
              bg-white dark:bg-neutral-900 
              border ${error ? 'border-red-500' : 'border-gray-200 dark:border-neutral-700'}
              rounded-lg 
              focus:outline-none
              focus:ring-2 ${error ? 'focus:ring-red-500/40' : 'focus:ring-emerald-500/40'}
              focus:border-transparent 
              text-gray-900 dark:text-white 
              placeholder-gray-400 dark:placeholder-neutral-500
              transition-all duration-200
              disabled:opacity-50 disabled:cursor-not-allowed
              ${className}
            `}
            {...props}
          />
          {Icon && iconPosition === 'right' && (
            <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none">
              <Icon className="w-5 h-5 text-gray-400 dark:text-neutral-500" />
            </div>
          )}
        </div>
        {error && (
          <p className="mt-1.5 text-sm text-red-600 dark:text-red-400">{error}</p>
        )}
        {helperText && !error && (
          <p className="mt-1.5 text-sm text-gray-500 dark:text-neutral-400">{helperText}</p>
        )}
      </div>
    );
  }
);

Input.displayName = 'Input';

export default Input;
