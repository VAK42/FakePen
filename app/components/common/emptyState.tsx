import { FileQuestion } from 'lucide-react';
interface EmptyStateProps {
  icon?: React.ReactNode;
  title: string;
  description?: string;
  action?: React.ReactNode;
}
export function EmptyState({ icon, title, description, action }: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center py-12 px-4 text-center">
      <div className="text-gray-400 dark:text-gray-600 mb-4">
        {icon || <FileQuestion className="h-16 w-16" />}
      </div>
      <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-2">
        {title}
      </h3>
      {description && (
        <p className="text-sm text-gray-600 dark:text-gray-400 mb-4 max-w-sm">
          {description}
        </p>
      )}
      {action && <div>{action}</div>}
    </div>
  )
}