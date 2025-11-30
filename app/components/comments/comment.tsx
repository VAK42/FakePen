import { Link } from 'react-router';
import { UserAvatar } from '../user/userAvatar';
import { formatDate } from '~/utils/formatters';
interface CommentProps {
  comment: {
    id: number;
    content: string;
    createdAt: Date | string;
    author: {
      id: number;
      username: string;
      displayName: string;
      avatarUrl?: string | null;
    };
  };
  currentUserId?: number;
}
export function Comment({ comment, currentUserId }: CommentProps) {
  return (
    <div className="p-4 border-b border-gray-200 dark:border-gray-800">
      <div className="flex gap-3">
        <Link to={`/users/${comment.author.username}`}>
          <UserAvatar src={comment.author.avatarUrl} alt={comment.author.displayName} size="sm" />
        </Link>
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-1">
            <Link to={`/users/${comment.author.username}`} className="font-semibold text-sm hover:underline">
              {comment.author.displayName}
            </Link>
            <span className="text-gray-500 dark:text-gray-400 text-xs">
              @{comment.author.username}
            </span>
            <span className="text-gray-500 dark:text-gray-400 text-xs">·</span>
            <span className="text-gray-500 dark:text-gray-400 text-xs">
              {formatDate(comment.createdAt)}
            </span>
          </div>
          <p className="text-sm">{comment.content}</p>
        </div>
      </div>
    </div>
  )
}