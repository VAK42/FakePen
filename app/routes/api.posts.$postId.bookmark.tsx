import { requireUserId } from '~/services/auth.server';
import { prisma } from '~/db/client.server';
export async function action({ request, params }: any) {
  const userId = await requireUserId(request);
  const postId = parseInt(params.postId);
  try {
    const existingBookmark = await prisma.bookmark.findUnique({
      where: {
        postId_userId: {
          postId,
          userId
        }
      }
    });
    if (existingBookmark) {
      await prisma.bookmark.delete({
        where: { id: existingBookmark.id }
      });
      await prisma.post.update({
        where: { id: postId },
        data: { bookmarksCount: { decrement: 1 } }
      });
      return Response.json({ bookmarked: false });
    } else {
      await prisma.bookmark.create({
        data: { postId, userId }
      });
      await prisma.post.update({
        where: { id: postId },
        data: { bookmarksCount: { increment: 1 } }
      });
      return Response.json({ bookmarked: true });
    }
  } catch (error) {
    return Response.json({ error: 'Failed To Toggle Bookmark' }, { status: 400 });
  }
}