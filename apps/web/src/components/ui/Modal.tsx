import { X, LucideIcon } from 'lucide-react';
import { ReactNode } from 'react';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  description?: string;
  icon?: LucideIcon;
  iconColor?: string;
  children: ReactNode;
  footer?: ReactNode;
  maxWidth?: 'sm' | 'md' | 'lg' | 'xl' | '2xl';
}

export default function Modal({
  isOpen,
  onClose,
  title,
  description,
  icon: Icon,
  iconColor = 'emerald',
  children,
  footer,
  maxWidth = '2xl',
}: ModalProps) {
  if (!isOpen) return null;

  const maxWidthClasses = {
    sm: 'max-w-sm',
    md: 'max-w-md',
    lg: 'max-w-lg',
    xl: 'max-w-xl',
    '2xl': 'max-w-2xl',
  };

  const iconColorClasses = {
    emerald: 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400',
    blue: 'bg-blue-500/10 text-blue-600 dark:text-blue-400',
    red: 'bg-red-500/10 text-red-600 dark:text-red-400',
    yellow: 'bg-yellow-500/10 text-yellow-600 dark:text-yellow-400',
    purple: 'bg-purple-500/10 text-purple-600 dark:text-purple-400',
  };

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div
        className={`bg-white dark:bg-neutral-900 rounded-2xl shadow-2xl ${maxWidthClasses[maxWidth]} w-full max-h-[90vh] overflow-hidden`}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200 dark:border-neutral-800">
          <div className="flex items-center gap-3">
            {Icon && (
              <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${iconColorClasses[iconColor as keyof typeof iconColorClasses] || iconColorClasses.emerald}`}>
                <Icon className="w-5 h-5" />
              </div>
            )}
            <div>
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
                {title}
              </h2>
              {description && (
                <p className="text-sm text-gray-500 dark:text-neutral-400">
                  {description}
                </p>
              )}
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 dark:hover:bg-neutral-800 rounded-lg transition-colors"
          >
            <X className="w-5 h-5 text-gray-500 dark:text-neutral-400" />
          </button>
        </div>

        {/* Content */}
        <div className="px-6 py-6 overflow-y-auto max-h-[calc(90vh-180px)]">
          {children}
        </div>

        {/* Footer */}
        {footer && (
          <div className="px-6 py-4 border-t border-gray-200 dark:border-neutral-800 bg-gray-50 dark:bg-neutral-800/50">
            {footer}
          </div>
        )}
      </div>
    </div>
  );
}
