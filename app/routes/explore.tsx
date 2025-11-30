import { useLoaderData } from 'react-router';
import { getUserId, getUser } from '~/services/auth.server';
import { prisma } from '~/db/client.server';
import { RootLayout } from '~/components/layout/rootLayout';
import { PostCard } from '~/components/posts/postCard';
export async function loader({ request }: any) {
  const userId = await getUserId(request);
  const currentUser = await getUser(request);
  const posts = await prisma.post.findMany({
    orderBy: { likesCount: 'desc' },
    take: 20,
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
  });
  const postsWithInteractions = userId ? await Promise.all(
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
  ) : posts;
  return { currentUser, posts: postsWithInteractions };
}
export default function Explore() {
  const { currentUser, posts } = useLoaderData<typeof loader>();
  return (
    <RootLayout currentUser={currentUser}>
      <div className="max-w-2xl mx-auto">
        <div className="sticky top-0 z-10 bg-white dark:bg-gray-950 border-b border-gray-200 dark:border-gray-800 p-4">
          <h1 className="text-xl font-bold text-gray-900 dark:text-white">Explore</h1>
        </div>
        <div>
          {posts.map((post: any) => (
            <PostCard key={post.id} post={post} currentUserId={currentUser?.id} />
          ))}
        </div>
      </div>
    </RootLayout>
  )
}