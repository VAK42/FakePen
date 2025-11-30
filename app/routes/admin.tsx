import { useLoaderData } from 'react-router';
import { getUser } from '~/services/auth.server';
import { prisma } from '~/db/client.server';
import { RootLayout } from '~/components/layout/rootLayout';
export async function loader({ request }: any) {
  const currentUser = await getUser(request);
  if (!currentUser || !currentUser.isAdmin) {
    throw new Response('Unauthorized', { status: 403 });
  }
  const table = new URL(request.url).searchParams.get('table') || 'users';
  let tableData: any[] = [];
  let columns: string[] = [];
  if (table === 'users') {
    tableData = await prisma.user.findMany({ take: 100, select: { id: true, username: true, email: true, displayName: true, isAdmin: true, createdAt: true } });
    columns = ['id', 'username', 'email', 'displayName', 'isAdmin', 'createdAt'];
  } else if (table === 'posts') {
    tableData = await prisma.post.findMany({ take: 100, select: { id: true, userId: true, content: true, likesCount: true, commentsCount: true, createdAt: true } });
    columns = ['id', 'userId', 'content', 'likesCount', 'commentsCount', 'createdAt'];
  } else if (table === 'comments') {
    tableData = await prisma.comment.findMany({ take: 100, select: { id: true, postId: true, userId: true, content: true, createdAt: true } });
    columns = ['id', 'postId', 'userId', 'content', 'createdAt'];
  } else if (table === 'follows') {
    tableData = await prisma.follow.findMany({ take: 100, select: { id: true, followerId: true, followingId: true, createdAt: true } });
    columns = ['id', 'followerId', 'followingId', 'createdAt'];
  } else if (table === 'likes') {
    tableData = await prisma.like.findMany({ take: 100, select: { id: true, postId: true, userId: true, createdAt: true } });
    columns = ['id', 'postId', 'userId', 'createdAt'];
  } else if (table === 'bookmarks') {
    tableData = await prisma.bookmark.findMany({ take: 100, select: { id: true, postId: true, userId: true, createdAt: true } });
    columns = ['id', 'postId', 'userId', 'createdAt'];
  } else if (table === 'notifications') {
    tableData = await prisma.notification.findMany({ take: 100, select: { id: true, userId: true, type: true, content: true, isRead: true, createdAt: true } });
    columns = ['id', 'userId', 'type', 'content', 'isRead', 'createdAt'];
  } else if (table === 'messages') {
    tableData = await prisma.message.findMany({ take: 100, select: { id: true, senderId: true, receiverId: true, content: true, isRead: true, createdAt: true } });
    columns = ['id', 'senderId', 'receiverId', 'content', 'isRead', 'createdAt'];
  }
  return { currentUser, table, tableData, columns };
}
export default function Admin() {
  const { currentUser, table, tableData, columns } = useLoaderData<typeof loader>();
  return (
    <RootLayout currentUser={currentUser}>
      <div className="max-w-7xl mx-auto p-4">
        <h1 className="text-3xl font-bold mb-6 text-gray-900 dark:text-white">Admin Panel</h1>
        <div className="flex gap-2 mb-6 overflow-x-auto">
          {['users', 'posts', 'comments', 'follows', 'likes', 'bookmarks', 'notifications', 'messages'].map(t => (
            <a key={t} href={`/admin?table=${t}`} className={`px-4 py-2 rounded ${table === t ? 'bg-blue-600 text-white' : 'bg-gray-200 dark:bg-gray-800 text-gray-900 dark:text-white'}`}>
              {t.charAt(0).toUpperCase() + t.slice(1)}
            </a>
          ))}
        </div>
        <div className="bg-white dark:bg-gray-900 rounded-lg border border-gray-200 dark:border-gray-800 overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 dark:bg-gray-800">
              <tr>
                {columns.map(col => (
                  <th key={col} className="px-4 py-3 text-left text-xs font-semibold uppercase text-gray-700 dark:text-gray-300">{col}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
              {tableData.map((row: any, i) => (
                <tr key={i} className="hover:bg-gray-50 dark:hover:bg-gray-800">
                  {columns.map(col => (
                    <td key={col} className="px-4 py-3 text-sm text-gray-900 dark:text-white">
                      {typeof row[col] === 'object' ? JSON.stringify(row[col]) : String(row[col])}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </RootLayout>
  )
}