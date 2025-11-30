export function NotificationCard({ notification }: any) {
  return (
    <div className="border-b border-gray-200 dark:border-gray-800 p-4">
      <div className="flex items-center gap-2 mb-1">
        <span className="font-bold text-gray-900 dark:text-white">{notification.actor?.displayName}</span>
        <span className="text-gray-600 dark:text-gray-400">{notification.content}</span>
      </div>
    </div>
  )
}