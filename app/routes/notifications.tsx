import { useLoaderData } from 'react-router';
import { requireUserId, getUser } from '~/services/auth.server';
import { prisma } from '~/db/client.server';
import { RootLayout } from '~/components/layout/rootLayout';
import { NotificationCard } from '~/components/notifications/notificationCard';
export async function loader({ request }: any) {
  const userId = await requireUserId(request);
  const currentUser = await getUser(request);
  const notifications = await prisma.notification.findMany({
    where: { userId },
    include: {
      actor: {
        select: {
          id: true,
          username: true,
          displayName: true,
          avatarUrl: true
        }
      },
      post: {
        select: {
          id: true,
          content: true
        }
      }
    },
    orderBy: { createdAt: 'desc' },
    take: 50
  });
  await prisma.notification.updateMany({
    where: { userId, isRead: false },
    data: { isRead: true }
  });
  return { currentUser, notifications };
}
export default function Notifications() {
  const { currentUser, notifications } = useLoaderData<typeof loader>();
  return (
    <RootLayout currentUser={currentUser}>
      <div className="max-w-2xl mx-auto">
        <div className="sticky top-0 z-10 bg-white dark:bg-gray-950 border-b border-gray-200 dark:border-gray-800 p-4">
          <h1 className="text-xl font-bold text-gray-900 dark:text-white">Notifications</h1>
        </div>
        <div>
          {notifications.length === 0 ? (
            <div className="p-8 text-center text-gray-600 dark:text-gray-400">
              <p>No Notifications Yet</p>
            </div>
          ) : (
            notifications.map((notification: any) => (
              <NotificationCard key={notification.id} notification={notification} />
            ))
          )}
        </div>
      </div>
    </RootLayout>
  )
}