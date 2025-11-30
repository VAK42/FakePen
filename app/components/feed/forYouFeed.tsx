import { useState, useEffect, useRef } from 'react';
import { Post } from '../posts/post';
import { PostSkeleton } from '../ui/loading';
interface FeedPost {
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
}
interface ForYouFeedProps {
  initialPosts: FeedPost[];
  currentUserId?: number;
}
export function ForYouFeed({ initialPosts, currentUserId }: ForYouFeedProps) {
  const [posts, setPosts] = useState<FeedPost[]>(initialPosts);
  const [loading, setLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const [page, setPage] = useState(1);
  const observerRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && hasMore && !loading) {
          loadMore();
        }
      },
      { threshold: 0.1 }
    );
    if (observerRef.current) {
      observer.observe(observerRef.current);
    }
    return () => observer.disconnect();
  }, [hasMore, loading, page]);
  const loadMore = async () => {
    setLoading(true);
    try {
      const response = await fetch(`/api/feed/forYou?page=${page + 1}`);
      const data = await response.json();
      if (data.posts.length === 0) {
        setHasMore(false);
      } else {
        setPosts([...posts, ...data.posts]);
        setPage(page + 1);
      }
    } catch (error) {
      setHasMore(false);
    }
    setLoading(false);
  };
  return (
    <div>
      {posts.map((post) => (
        <Post key={post.id} post={post} currentUserId={currentUserId} />
      ))}
      {loading && <PostSkeleton />}
      <div ref={observerRef} className="h-4" />
      {!hasMore && posts.length > 0 && (
        <div className="text-center py-8 text-gray-500 dark:text-gray-400">
          No More Posts
        </div>
      )}
      {posts.length === 0 && !loading && (
        <div className="text-center py-12 text-gray-500 dark:text-gray-400">
          <p className="text-lg">No Posts Yet</p>
          <p className="text-sm mt-2">Start Following Users To See Their Posts Here</p>
        </div>
      )}
    </div>
  )
}