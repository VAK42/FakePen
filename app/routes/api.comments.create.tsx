import { requireUserId } from '~/services/auth.server';
import { prisma } from '~/db/client.server';
export async function action({ request }: any) {
  const userId = await requireUserId(request);
  const formData = await request.formData();
  const postId = parseInt(formData.get('postId') as string);
  const content = formData.get('content') as string;
  try {
    const comment = await prisma.comment.create({
      data: {
        postId,
        userId,
        content
      }
    });
    await prisma.post.update({
      where: { id: postId },
      data: { commentsCount: { increment: 1 } }
    });
    return Response.json({ success: true, comment });
  } catch (error) {
    return Response.json({ error: 'Failed To Create Comment' }, { status: 400 });
  }
}