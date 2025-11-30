import { requireUserId } from '~/services/auth.server';
import { prisma } from '~/db/client.server';
export async function action({ request, params }: any) {
  const userId = await requireUserId(request);
  const postId = parseInt(params.postId);
  try {
    const post = await prisma.post.findUnique({
      where: { id: postId },
      select: { userId: true }
    });
    if (!post || post.userId !== userId) {
      return Response.json({ error: 'Unauthorized' }, { status: 403 });
    }
    await prisma.post.delete({ where: { id: postId } });
    return Response.json({ success: true });
  } catch (error) {
    return Response.json({ error: 'Failed To Delete Post' }, { status: 400 });
  }
}