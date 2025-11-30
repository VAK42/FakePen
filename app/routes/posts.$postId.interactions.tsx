import { useLoaderData } from 'react-router';
import { getUser } from '~/services/auth.server';
import { prisma } from '~/db/client.server';
import { RootLayout } from '~/components/layout/rootLayout';
import { UserCard } from '~/components/user/userCard';
export async function loader({ request, params }: any) {
  const currentUser = await getUser(request);
  const postId = parseInt(params.postId);
  const url = new URL(request.url);
  const type = url.searchParams.get('type') || 'likes';
  const users = type === 'likes'
    ? await prisma.like.findMany({
      where: { postId },
      include: {
        user: {
          select: {
            id: true,
            username: true,
            displayName: true,
            bio: true,
            avatarUrl: true
          }
        }
      }
    })
    : await prisma.bookmark.findMany({
      where: { postId },
      include: {
        user: {
          select: {
            id: true,
            username: true,
            displayName: true,
            bio: true,
            avatarUrl: true
          }
        }
      }
    });
  const userList = users.map((u: any) => u.user);
  return { currentUser, users: userList, type };
}
export default function PostInteractions() {
  const { currentUser, users, type } = useLoaderData<typeof loader>();
  return (
    <RootLayout currentUser={currentUser}>
      <div className="max-w-2xl mx-auto">
        <div className="sticky top-0 z-10 bg-white dark:bg-gray-950 border-b border-gray-200 dark:border-gray-800 p-4">
          <h1 className="text-xl font-bold text-gray-900 dark:text-white">
            {type === 'likes' ? 'Liked By' : 'Bookmarked By'}
          </h1>
        </div>
        <div>
          {users.length === 0 ? (
            <div className="p-8 text-center text-gray-600 dark:text-gray-400">
              <p>No {type === 'likes' ? 'Likes' : 'Bookmarks'}</p>
            </div>
          ) : (
            users.map((user: any) => (
              <UserCard key={user.id} user={user} currentUserId={currentUser?.id} />
            ))
          )}
        </div>
      </div>
    </RootLayout>
  )
}