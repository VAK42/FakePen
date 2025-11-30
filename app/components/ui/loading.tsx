import { cn } from '~/utils/formatters';
export function Skeleton({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn('animate-pulse rounded-md bg-gray-200 dark:bg-gray-800', className)}
      {...props}
    />
  )
}
export function PostSkeleton() {
  return (
    <div className="p-4 border-b border-gray-200 dark:border-gray-800">
      <div className="flex gap-3">
        <Skeleton className="h-12 w-12 rounded-full" />
        <div className="flex-1 space-y-3">
          <Skeleton className="h-4 w-32" />
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-3/4" />
          <div className="flex gap-4 mt-3">
            <Skeleton className="h-8 w-16" />
            <Skeleton className="h-8 w-16" />
            <Skeleton className="h-8 w-16" />
          </div>
        </div>
      </div>
    </div>
  )
}