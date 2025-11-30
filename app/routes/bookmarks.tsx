import { useLoaderData } from 'react-router';
import { requireUserId, getUser } from '~/services/auth.server';
import { prisma } from '~/db/client.server';
import { RootLayout } from '~/components/layout/rootLayout';
import { PostCard } from '~/components/posts/postCard';
export async function loader({ request }: any) {
  const userId = await requireUserId(request);
  const currentUser = await getUser(request);
  const bookmarks = await prisma.bookmark.findMany({
    where: { userId },
    include: {
      post: {
        include: {
          author: {
            select: {
              id: true,
              username: true,
              displayName: true,
              avatarUrl: true
            }
          }
        }
      }
    },
    orderBy: { createdAt: 'desc' }
  });
  const postsWithInteractions = await Promise.all(
    bookmarks.map(async (bookmark: any) => {
      const isLiked = await prisma.like.findUnique({
        where: {
          postId_userId: {
            postId: bookmark.post.id,
            userId
          }
        }
      }) !== null;
      return {
        ...bookmark.post,
        isLiked,
        isBookmarked: true
      };
    })
  );
  return { currentUser, posts: postsWithInteractions };
}
export default function Bookmarks() {
  const { currentUser, posts } = useLoaderData<typeof loader>();
  return (
    <RootLayout currentUser={currentUser}>
      <div className="max-w-2xl mx-auto">
        <div className="sticky top-0 z-10 bg-white dark:bg-gray-950 border-b border-gray-200 dark:border-gray-800 p-4">
          <h1 className="text-xl font-bold text-gray-900 dark:text-white">Bookmarks</h1>
        </div>
        <div>
          {posts.length === 0 ? (
            <div className="p-8 text-center text-gray-600 dark:text-gray-400">
              <p>No Bookmarks Yet</p>
            </div>
          ) : (
            posts.map((post: any) => (
              <PostCard key={post.id} post={post} currentUserId={currentUser?.id} />
            ))
          )}
        </div>
      </div>
    </RootLayout>
  )
}