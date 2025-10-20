import { TextareaHTMLAttributes, forwardRef } from 'react';
import { clsx } from 'clsx';

interface TextareaProps extends TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string;
  error?: string;
}

const Textarea = forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ className, label, error, ...props }, ref) => {
    return (
      <div className="w-full">
        {label && (
          <label className="block text-sm font-semibold text-gray-900 dark:text-dark-text-primary mb-2">
            {label}
          </label>
        )}
        <textarea
          ref={ref}
          className={clsx(
            'w-full px-4 py-3 rounded-xl border-2 bg-white dark:bg-dark-bg-tertiary',
            'text-gray-900 dark:text-dark-text-primary placeholder-gray-400 dark:placeholder-gray-600',
            'border-gray-200 dark:border-dark-border-primary',
            'focus:border-primary-500 dark:focus:border-primary-500',
            'focus:ring-4 focus:ring-primary-500/10',
            'transition-all duration-200 outline-none',
            'disabled:bg-gray-100 dark:disabled:bg-dark-bg-hover disabled:cursor-not-allowed',
            error ? 'border-red-500 dark:border-red-500 focus:border-red-500 focus:ring-red-500/10' : '',
            className
          )}
          {...props}
        />
        {error && (
          <p className="mt-2 text-sm text-red-600 dark:text-red-400">{error}</p>
        )}
      </div>
    );
  }
);

Textarea.displayName = 'Textarea';

export default Textarea;
