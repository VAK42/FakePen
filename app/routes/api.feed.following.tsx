import { requireUserId } from '~/services/auth.server';
import { prisma } from '~/db/client.server';
export async function loader({ request }: any) {
  const userId = await requireUserId(request);
  const url = new URL(request.url);
  const cursor = url.searchParams.get('cursor');
  const following = await prisma.follow.findMany({
    where: { followerId: userId },
    select: { followingId: true }
  });
  const followingIds = following.map((f: any) => f.followingId);
  if (followingIds.length === 0) {
    return Response.json({ posts: [] });
  }
  const posts = await prisma.post.findMany({
    where: {
      userId: { in: followingIds }
    },
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
  return Response.json({ posts: postsWithInteractions });
}