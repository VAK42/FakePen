import * as React from 'react';
import { X } from 'lucide-react';
import { cn } from '~/utils/formatters';
interface DialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  children: React.ReactNode;
}
export function Dialog({ open, onOpenChange, children }: DialogProps) {
  if (!open) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="fixed inset-0 bg-black/50" onClick={() => onOpenChange(false)} />
      <div className="relative z-50 w-full max-w-lg mx-4">
        {children}
      </div>
    </div>
  )
}
interface DialogContentProps {
  children: React.ReactNode;
  className?: string;
}
export function DialogContent({ children, className }: DialogContentProps) {
  return (
    <div className={cn('bg-white dark:bg-gray-900 rounded-lg shadow-xl p-6', className)}>
      {children}
    </div>
  )
}
interface DialogHeaderProps {
  children: React.ReactNode;
  onClose?: () => void;
}
export function DialogHeader({ children, onClose }: DialogHeaderProps) {
  return (
    <div className="flex items-center justify-between mb-4">
      <div className="flex-1">{children}</div>
      {onClose && (
        <button onClick={onClose} className="text-gray-500 hover:text-gray-700 dark:hover:text-gray-300">
          <X className="h-5 w-5" />
        </button>
      )}
    </div>
  )
}
interface DialogTitleProps {
  children: React.ReactNode;
}
export function DialogTitle({ children }: DialogTitleProps) {
  return <h2 className="text-xl font-semibold">{children}</h2>;
}