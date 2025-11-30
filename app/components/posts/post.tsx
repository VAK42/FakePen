import { Link } from 'react-router';
import { Heart, MessageCircle, Bookmark, MoreHorizontal } from 'lucide-react';
import { UserAvatar } from '../user/userAvatar';
import { formatDate, formatNumber } from '~/utils/formatters';
import { useFetcher } from 'react-router';
interface PostProps {
  post: {
    id: number;
    content: string;
    mediaUrls?: string | null;
    likesCount: number;
    commentsCount: number;
    bookmarksCount: number;
    createdAt: Date | string;
    author: {
      id: number;
      username: string;
      displayName: string;
      avatarUrl?: string | null;
    };
    isLiked?: boolean;
    isBookmarked?: boolean;
  };
  currentUserId?: number;
}
export function Post({ post, currentUserId }: PostProps) {
  const likeFetcher = useFetcher();
  const bookmarkFetcher = useFetcher();
  const mediaUrls = post.mediaUrls ? JSON.parse(post.mediaUrls) : [];
  const handleLike = () => {
    likeFetcher.submit({}, { method: 'post', action: `/api/posts/${post.id}/like` });
  };
  const handleBookmark = () => {
    bookmarkFetcher.submit({}, { method: 'post', action: `/api/posts/${post.id}/bookmark` });
  };
  return (
    <div className="border-b border-gray-200 dark:border-gray-800 p-4 hover:bg-gray-50 dark:hover:bg-gray-900/50 transition-colors">
      <div className="flex gap-3">
        <Link to={`/users/${post.author.username}`}>
          <UserAvatar src={post.author.avatarUrl} alt={post.author.displayName} />
        </Link>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1">
            <Link to={`/users/${post.author.username}`} className="font-semibold hover:underline">
              {post.author.displayName}
            </Link>
            <span className="text-gray-500 dark:text-gray-400 text-sm">
              @{post.author.username}
            </span>
            <span className="text-gray-500 dark:text-gray-400 text-sm">·</span>
            <span className="text-gray-500 dark:text-gray-400 text-sm">
              {formatDate(post.createdAt)}
            </span>
          </div>
          <div className="prose dark:prose-invert max-w-none" dangerouslySetInnerHTML={{ __html: post.content }} />
          {mediaUrls.length > 0 && (
            <div className="mt-3 grid grid-cols-2 gap-2">
              {mediaUrls.map((url: string, idx: number) => (
                <img key={idx} src={url} alt="" className="rounded-xl w-full object-cover max-h-80" />
              ))}
            </div>
          )}
          <div className="flex items-center gap-6 mt-3 text-gray-500 dark:text-gray-400">
            <button onClick={handleLike} className="flex items-center gap-2 hover:text-red-500 transition-colors">
              <Heart className={`h-5 w-5 ${post.isLiked ? 'fill-red-500 text-red-500' : ''}`} />
              <span className="text-sm">{formatNumber(post.likesCount)}</span>
            </button>
            <Link to={`/posts/${post.id}`} className="flex items-center gap-2 hover:text-blue-500 transition-colors">
              <MessageCircle className="h-5 w-5" />
              <span className="text-sm">{formatNumber(post.commentsCount)}</span>
            </Link>
            <button onClick={handleBookmark} className="flex items-center gap-2 hover:text-blue-500 transition-colors">
              <Bookmark className={`h-5 w-5 ${post.isBookmarked ? 'fill-blue-500 text-blue-500' : ''}`} />
            </button>
            {currentUserId === post.author.id && (
              <button className="ml-auto hover:bg-gray-200 dark:hover:bg-gray-700 p-2 rounded-full">
                <MoreHorizontal className="h-5 w-5" />
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}