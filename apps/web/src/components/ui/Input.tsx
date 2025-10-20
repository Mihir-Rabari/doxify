import { InputHTMLAttributes, forwardRef } from 'react';
import { clsx } from 'clsx';

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
}

const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ label, error, className = '', ...props }: InputProps) => {
    return (
      <div className="w-full">
        {label && (
          <label className="block text-sm font-semibold text-gray-900 dark:text-dark-text-primary mb-2">
            {label}
          </label>
        )}
        <input
          className={`
            w-full px-4 py-3 rounded-xl border-2 bg-white dark:bg-dark-bg-tertiary
            text-gray-900 dark:text-dark-text-primary placeholder-gray-400 dark:placeholder-gray-600
            border-gray-200 dark:border-dark-border-primary
            focus:border-primary-500 dark:focus:border-primary-500
            focus:ring-4 focus:ring-primary-500/10
            transition-all duration-200 outline-none
            ${
              error 
                ? 'border-red-500 dark:border-red-500 focus:border-red-500 focus:ring-red-500/10' 
                : ''
            } 
            ${className}
          `}
          {...props}
        />
        {error && (
          <p className="mt-2 text-sm text-red-600 dark:text-red-400 flex items-center gap-1">
            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
            </svg>
            {error}
          </p>
        )}
      </div>
    );
  }
);

Input.displayName = 'Input';

export default Input;
