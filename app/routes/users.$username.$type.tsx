import { useLoaderData } from 'react-router';
import { getUser } from '~/services/auth.server';
import { prisma } from '~/db/client.server';
import { RootLayout } from '~/components/layout/rootLayout';
import { UserCard } from '~/components/user/userCard';
export async function loader({ request, params }: any) {
  const currentUser = await getUser(request);
  const type = params.type;
  const user = await prisma.user.findUnique({
    where: { username: params.username },
    select: { id: true, username: true, displayName: true }
  });
  if (!user) {
    throw new Response('User Not Found', { status: 404 });
  }
  const users = type === 'followers'
    ? await prisma.follow.findMany({
      where: { followingId: user.id },
      include: {
        follower: {
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
    : await prisma.follow.findMany({
      where: { followerId: user.id },
      include: {
        following: {
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
  const userList = type === 'followers'
    ? users.map((f: any) => f.follower)
    : users.map((f: any) => f.following);
  return { currentUser, user, users: userList, type };
}
export default function UserFollowList() {
  const { currentUser, user, users, type } = useLoaderData<typeof loader>();
  return (
    <RootLayout currentUser={currentUser}>
      <div className="max-w-2xl mx-auto">
        <div className="sticky top-0 z-10 bg-white dark:bg-gray-950 border-b border-gray-200 dark:border-gray-800 p-4">
          <h1 className="text-xl font-bold text-gray-900 dark:text-white">
            {user.displayName}'s {type === 'followers' ? 'Followers' : 'Following'}
          </h1>
        </div>
        <div>
          {users.length === 0 ? (
            <div className="p-8 text-center text-gray-600 dark:text-gray-400">
              <p>No {type === 'followers' ? 'Followers' : 'Following'}</p>
            </div>
          ) : (
            users.map((u: any) => (
              <UserCard key={u.id} user={u} currentUserId={currentUser?.id} />
            ))
          )}
        </div>
      </div>
    </RootLayout>
  )
}