import { requireUserId } from '~/services/auth.server';
import { prisma } from '~/db/client.server';
import { postSchema } from '~/utils/validation';
export async function action({ request }: any) {
  const userId = await requireUserId(request);
  const formData = await request.formData();
  const content = formData.get('content');
  const mediaUrls = formData.get('mediaUrls');
  try {
    const validated = postSchema.parse({ content });
    const post = await prisma.post.create({
      data: {
        userId,
        content: validated.content,
        mediaUrls: mediaUrls ? JSON.parse(mediaUrls as string) : []
      }
    });
    return Response.json({ success: true, post });
  } catch (error: any) {
    return Response.json({ error: error.errors?.[0]?.message || 'Failed To Create Post' }, { status: 400 });
  }
}