import { requireUserId } from '~/services/auth.server';
import { prisma } from '~/db/client.server';
export async function action({ request, params }: any) {
  const userId = await requireUserId(request);
  const targetUserId = parseInt(params.userId);
  try {
    const existingFollow = await prisma.follow.findUnique({
      where: {
        followerId_followingId: {
          followerId: userId,
          followingId: targetUserId
        }
      }
    });
    if (existingFollow) {
      await prisma.follow.delete({ where: { id: existingFollow.id } });
      return Response.json({ following: false });
    } else {
      await prisma.follow.create({
        data: {
          followerId: userId,
          followingId: targetUserId
        }
      });
      return Response.json({ following: true });
    }
  } catch (error) {
    return Response.json({ error: 'Failed To Toggle Follow' }, { status: 400 });
  }
}