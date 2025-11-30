import { getUserId } from '~/services/auth.server';
import { prisma } from '~/db/client.server';
export async function loader({ request }: any) {
  const url = new URL(request.url);
  const cursor = url.searchParams.get('cursor');
  const currentUserId = await getUserId(request);
  const posts = await prisma.post.findMany({
    take: 20,
    skip: cursor ? 1 : 0,
    cursor: cursor ? { id: parseInt(cursor) } : undefined,
    orderBy: { createdAt: 'desc' },
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
  const postsWithInteractions = await Promise.all(
    posts.map(async (post: any) => {
      const isLiked = currentUserId ? await prisma.like.findUnique({
        where: {
          postId_userId: {
            postId: post.id,
            userId: currentUserId
          }
        }
      }) !== null : false;
      const isBookmarked = currentUserId ? await prisma.bookmark.findUnique({
        where: {
          postId_userId: {
            postId: post.id,
            userId: currentUserId
          }
        }
      }) !== null : false;
      return {
        ...post,
        isLiked,
        isBookmarked
      };
    })
  );
  return Response.json({ posts: postsWithInteractions });
}