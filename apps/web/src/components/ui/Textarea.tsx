import { TextareaHTMLAttributes, forwardRef } from 'react';

interface TextareaProps extends TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string;
  error?: string;
  helperText?: string;
}

const Textarea = forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ label, error, helperText, className = '', ...props }, ref) => {
    return (
      <div className="w-full">
        {label && (
          <label className="block text-sm font-medium text-gray-700 dark:text-neutral-300 mb-2">
            {label}
          </label>
        )}
        <textarea
          ref={ref}
          className={`
            w-full px-4 py-2 
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
            resize-none
            ${className}
          `}
          {...props}
        />
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

Textarea.displayName = 'Textarea';

export default Textarea;
