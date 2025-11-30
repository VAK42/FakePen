export function CommentList({ comments, currentUserId, postId }: any) {
  return (
    <div className="border-t border-gray-200 dark:border-gray-800">
      {comments.map((comment: any) => (
        <div key={comment.id} className="border-b border-gray-200 dark:border-gray-800 p-4">
          <div className="flex items-center gap-2 mb-2">
            <span className="font-bold text-gray-900 dark:text-white">{comment.user?.displayName}</span>
            <span className="text-gray-600 dark:text-gray-400">@{comment.user?.username}</span>
          </div>
          <p className="text-gray-900 dark:text-white">{comment.content}</p>
        </div>
      ))}
    </div>
  )
}