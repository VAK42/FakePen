import { useState } from 'react';
import { useLoaderData } from 'react-router';
import { requireUserId, getUser } from '~/services/auth.server';
import { prisma } from '~/db/client.server';
import { RootLayout } from '~/components/layout/rootLayout';
import { PostEditor } from '~/components/posts/postEditor';
import { ForYouFeed } from '~/components/feed/forYouFeed';
import { FollowingFeed } from '~/components/feed/followingFeed';
export async function loader({ request }: any) {
  const userId = await requireUserId(request);
  const currentUser = await getUser(request);
  const posts = await prisma.post.findMany({
    include: {
      author: {
        select: {
          id: true,
          username: true,
          displayName: true,
          avatarUrl: true
        }
      }
    },
    orderBy: { createdAt: 'desc' },
    take: 10
  });
  const postsWithInteractions = await Promise.all(
    posts.map(async (post: any) => {
      const isLiked = await prisma.like.findUnique({
        where: {
          postId_userId: {
            postId: post.id,
            userId
          }
        }
      }) !== null;
      const isBookmarked = await prisma.bookmark.findUnique({
        where: {
          postId_userId: {
            postId: post.id,
            userId
          }
        }
      }) !== null;
      return {
        ...post,
        isLiked,
        isBookmarked
      };
    })
  );
  return { currentUser, posts: postsWithInteractions };
}
export default function Index() {
  const { currentUser, posts } = useLoaderData<typeof loader>();
  const [activeTab, setActiveTab] = useState<'forYou' | 'following'>('forYou');
  return (
    <RootLayout currentUser={currentUser}>
      <div className="max-w-2xl mx-auto">
        <div className="sticky top-0 z-10 bg-white/80 dark:bg-gray-950/80 backdrop-blur-sm border-b border-gray-200 dark:border-gray-800">
          <div className="flex">
            <button
              onClick={() => setActiveTab('forYou')}
              className={`flex-1 py-4 font-semibold transition-colors ${activeTab === 'forYou'
                ? 'text-blue-600 border-b-2 border-blue-600'
                : 'text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-900'
                }`}
            >
              For You
            </button>
            <button
              onClick={() => setActiveTab('following')}
              className={`flex-1 py-4 font-semibold transition-colors ${activeTab === 'following'
                ? 'text-blue-600 border-b-2 border-blue-600'
                : 'text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-900'
                }`}
            >
              Following
            </button>
          </div>
        </div>
        <div className="p-4 border-b border-gray-200 dark:border-gray-800">
          <PostEditor />
        </div>
        {activeTab === 'forYou' && (
          <ForYouFeed initialPosts={posts} currentUserId={currentUser?.id} />
        )}
        {activeTab === 'following' && (
          <FollowingFeed initialPosts={[]} currentUserId={currentUser?.id} />
        )}
      </div>
    </RootLayout>
  )
}