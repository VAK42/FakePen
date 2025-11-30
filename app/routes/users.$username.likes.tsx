import { useLoaderData } from 'react-router';
import { getUser, getUserId } from '~/services/auth.server';
import { prisma } from '~/db/client.server';
import { RootLayout } from '~/components/layout/rootLayout';
import { PostCard } from '~/components/posts/postCard';
export async function loader({ request, params }: any) {
  const currentUser = await getUser(request);
  const currentUserId = await getUserId(request);
  const user = await prisma.user.findUnique({
    where: { username: params.username },
    select: { id: true, username: true, displayName: true }
  });
  if (!user) {
    throw new Response('User Not Found', { status: 404 });
  }
  const likes = await prisma.like.findMany({
    where: { userId: user.id },
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
  const postsWithInteractions = currentUserId ? await Promise.all(
    likes.map(async (like: any) => {
      const isLiked = true;
      const isBookmarked = await prisma.bookmark.findUnique({
        where: {
          postId_userId: {
            postId: like.post.id,
            userId: currentUserId
          }
        }
      }) !== null;
      return { ...like.post, isLiked, isBookmarked };
    })
  ) : likes.map((l: any) => ({ ...l.post, isLiked: true, isBookmarked: false }));
  return { currentUser, user, posts: postsWithInteractions };
}
export default function UserLikes() {
  const { currentUser, user, posts } = useLoaderData<typeof loader>();
  return (
    <RootLayout currentUser={currentUser}>
      <div className="max-w-2xl mx-auto">
        <div className="sticky top-0 z-10 bg-white dark:bg-gray-950 border-b border-gray-200 dark:border-gray-800 p-4">
          <h1 className="text-xl font-bold text-gray-900 dark:text-white">{user.displayName}'s Likes</h1>
        </div>
        <div>
          {posts.length === 0 ? (
            <div className="p-8 text-center text-gray-600 dark:text-gray-400">
              <p>No Liked Posts</p>
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