export function UserCard({ user, currentUserId }: any) {
  return (
    <div className="border-b border-gray-200 dark:border-gray-800 p-4 flex items-center gap-3">
      <div className="flex-1">
        <div className="font-bold text-gray-900 dark:text-white">{user.displayName}</div>
        <div className="text-gray-600 dark:text-gray-400">@{user.username}</div>
        {user.bio && <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">{user.bio}</p>}
      </div>
    </div>
  )
}