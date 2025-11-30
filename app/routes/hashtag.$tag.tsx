import { useLoaderData } from 'react-router';
import { getUser, getUserId } from '~/services/auth.server';
import { prisma } from '~/db/client.server';
import { RootLayout } from '~/components/layout/rootLayout';
import { PostCard } from '~/components/posts/postCard';
export async function loader({ request, params }: any) {
  const currentUser = await getUser(request);
  const currentUserId = await getUserId(request);
  const tag = params.tag;
  const posts = await prisma.post.findMany({
    where: {
      content: {
        contains: `#${tag}`
      }
    },
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
    take: 50
  });
  const postsWithInteractions = currentUserId ? await Promise.all(
    posts.map(async (post: any) => {
      const isLiked = await prisma.like.findUnique({
        where: {
          postId_userId: {
            postId: post.id,
            userId: currentUserId
          }
        }
      }) !== null;
      const isBookmarked = await prisma.bookmark.findUnique({
        where: {
          postId_userId: {
            postId: post.id,
            userId: currentUserId
          }
        }
      }) !== null;
      return { ...post, isLiked, isBookmarked };
    })
  ) : posts;
  return { currentUser, tag, posts: postsWithInteractions };
}
export default function Hashtag() {
  const { currentUser, tag, posts } = useLoaderData<typeof loader>();
  return (
    <RootLayout currentUser={currentUser}>
      <div className="max-w-2xl mx-auto">
        <div className="sticky top-0 z-10 bg-white dark:bg-gray-950 border-b border-gray-200 dark:border-gray-800 p-4">
          <h1 className="text-xl font-bold text-gray-900 dark:text-white">#{tag}</h1>
        </div>
        <div>
          {posts.length === 0 ? (
            <div className="p-8 text-center text-gray-600 dark:text-gray-400">
              <p>No Posts With #{tag}</p>
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