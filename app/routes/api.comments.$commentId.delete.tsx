import { requireUserId } from '~/services/auth.server';
import { prisma } from '~/db/client.server';
export async function action({ request, params }: any) {
  const userId = await requireUserId(request);
  const commentId = parseInt(params.commentId);
  try {
    const comment = await prisma.comment.findUnique({
      where: { id: commentId },
      select: { userId: true, postId: true }
    });
    if (!comment || comment.userId !== userId) {
      return Response.json({ error: 'Unauthorized' }, { status: 403 });
    }
    await prisma.comment.delete({ where: { id: commentId } });
    await prisma.post.update({
      where: { id: comment.postId },
      data: { commentsCount: { decrement: 1 } }
    });
    return Response.json({ success: true });
  } catch (error) {
    return Response.json({ error: 'Failed To Delete Comment' }, { status: 400 });
  }
}