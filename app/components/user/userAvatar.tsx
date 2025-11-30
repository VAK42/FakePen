import { User } from 'lucide-react';
import { cn } from '~/utils/formatters';
interface UserAvatarProps {
  src?: string | null;
  alt: string;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}
export function UserAvatar({ src, alt, size = 'md', className }: UserAvatarProps) {
  const sizeClasses = {
    sm: 'h-8 w-8',
    md: 'h-12 w-12',
    lg: 'h-20 w-20'
  };
  return (
    <div className={cn('rounded-full overflow-hidden bg-gray-200 dark:bg-gray-700 flex items-center justify-center', sizeClasses[size], className)}>
      {src ? (
        <img src={src} alt={alt} className="h-full w-full object-cover" />
      ) : (
        <User className={cn('text-gray-400', {
          'h-4 w-4': size === 'sm',
          'h-6 w-6': size === 'md',
          'h-10 w-10': size === 'lg'
        })} />
      )}
    </div>
  )
}