import { ReactNode } from 'react';
import { LucideIcon, AlertCircle, Check, Info, AlertTriangle } from 'lucide-react';

interface AlertProps {
  variant?: 'success' | 'error' | 'warning' | 'info';
  icon?: LucideIcon;
  title?: string;
  children: ReactNode;
  className?: string;
}

export default function Alert({
  variant = 'info',
  icon,
  title,
  children,
  className = '',
}: AlertProps) {
  const defaultIcons = {
    success: Check,
    error: AlertCircle,
    warning: AlertTriangle,
    info: Info,
  };

  const Icon = icon || defaultIcons[variant];

  const variantStyles = {
    success: 'bg-emerald-50 dark:bg-emerald-500/10 border-emerald-200 dark:border-emerald-500/20 text-emerald-900 dark:text-emerald-100',
    error: 'bg-red-50 dark:bg-red-500/10 border-red-200 dark:border-red-500/20 text-red-900 dark:text-red-100',
    warning: 'bg-yellow-50 dark:bg-yellow-500/10 border-yellow-200 dark:border-yellow-500/20 text-yellow-900 dark:text-yellow-100',
    info: 'bg-blue-50 dark:bg-blue-500/10 border-blue-200 dark:border-blue-500/20 text-blue-900 dark:text-blue-100',
  };

  const iconStyles = {
    success: 'text-emerald-600 dark:text-emerald-400',
    error: 'text-red-600 dark:text-red-400',
    warning: 'text-yellow-600 dark:text-yellow-400',
    info: 'text-blue-600 dark:text-blue-400',
  };

  return (
    <div className={`p-4 border rounded-xl ${variantStyles[variant]} ${className}`}>
      <div className="flex items-start gap-3">
        <Icon className={`w-5 h-5 mt-0.5 flex-shrink-0 ${iconStyles[variant]}`} />
        <div className="flex-1 min-w-0">
          {title && (
            <p className="text-sm font-medium mb-1">
              {title}
            </p>
          )}
          <div className="text-sm">
            {children}
          </div>
        </div>
      </div>
    </div>
  );
}
