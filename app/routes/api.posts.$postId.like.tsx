import { requireUserId } from '~/services/auth.server';
import { prisma } from '~/db/client.server';
export async function action({ request, params }: any) {
  const userId = await requireUserId(request);
  const postId = parseInt(params.postId);
  try {
    const existingLike = await prisma.like.findUnique({
      where: {
        postId_userId: {
          postId,
          userId
        }
      }
    });
    if (existingLike) {
      await prisma.like.delete({
        where: { id: existingLike.id }
      });
      await prisma.post.update({
        where: { id: postId },
        data: { likesCount: { decrement: 1 } }
      });
      return Response.json({ liked: false });
    } else {
      await prisma.like.create({
        data: { postId, userId }
      });
      await prisma.post.update({
        where: { id: postId },
        data: { likesCount: { increment: 1 } }
      });
      return Response.json({ liked: true });
    }
  } catch (error) {
    return Response.json({ error: 'Failed To Toggle Like' }, { status: 400 });
  }
}