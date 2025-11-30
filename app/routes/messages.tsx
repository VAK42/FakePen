import { useLoaderData } from 'react-router';
import { requireUserId, getUser } from '~/services/auth.server';
import { prisma } from '~/db/client.server';
import { RootLayout } from '~/components/layout/rootLayout';
import { MessageList } from '~/components/messages/messageList';
export async function loader({ request }: any) {
  const userId = await requireUserId(request);
  const currentUser = await getUser(request);
  const conversations = await prisma.message.findMany({
    where: {
      OR: [
        { senderId: userId },
        { receiverId: userId }
      ]
    },
    include: {
      sender: {
        select: {
          id: true,
          username: true,
          displayName: true,
          avatarUrl: true
        }
      },
      receiver: {
        select: {
          id: true,
          username: true,
          displayName: true,
          avatarUrl: true
        }
      }
    },
    orderBy: { createdAt: 'desc' },
    take: 50
  });
  return { currentUser, conversations };
}
export default function Messages() {
  const { currentUser, conversations } = useLoaderData<typeof loader>();
  return (
    <RootLayout currentUser={currentUser}>
      <div className="max-w-2xl mx-auto">
        <div className="sticky top-0 z-10 bg-white dark:bg-gray-950 border-b border-gray-200 dark:border-gray-800 p-4">
          <h1 className="text-xl font-bold text-gray-900 dark:text-white">Messages</h1>
        </div>
        <div>
          {conversations.length === 0 ? (
            <div className="p-8 text-center text-gray-600 dark:text-gray-400">
              <p>No Messages Yet</p>
            </div>
          ) : (
            <MessageList conversations={conversations} currentUserId={currentUser?.id} />
          )}
        </div>
      </div>
    </RootLayout>
  )
}