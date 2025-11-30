import { useLoaderData } from 'react-router';
import { getUser } from '~/services/auth.server';
import { prisma } from '~/db/client.server';
import { RootLayout } from '~/components/layout/rootLayout';
export async function loader({ request }: any) {
  const currentUser = await getUser(request);
  if (!currentUser || !currentUser.isAdmin) {
    throw new Response('Unauthorized', { status: 403 });
  }
  const posts = await prisma.post.findMany({
    take: 100,
    orderBy: { createdAt: 'desc' },
    include: { author: { select: { username: true } } }
  });
  return { currentUser, posts };
}
export default function AdminPosts() {
  const { currentUser, posts } = useLoaderData<typeof loader>();
  return (
    <RootLayout currentUser={currentUser}>
      <div className="max-w-7xl mx-auto p-4">
        <h1 className="text-3xl font-bold mb-6 text-gray-900 dark:text-white">Post Management</h1>
        <div className="bg-white dark:bg-gray-900 rounded-lg border border-gray-200 dark:border-gray-800 overflow-hidden">
          <table className="w-full">
            <thead className="bg-gray-50 dark:bg-gray-800">
              <tr>
                <th className="px-4 py-3 text-left text-xs font-semibold uppercase text-gray-700 dark:text-gray-300">ID</th>
                <th className="px-4 py-3 text-left text-xs font-semibold uppercase text-gray-700 dark:text-gray-300">Author</th>
                <th className="px-4 py-3 text-left text-xs font-semibold uppercase text-gray-700 dark:text-gray-300">Content</th>
                <th className="px-4 py-3 text-left text-xs font-semibold uppercase text-gray-700 dark:text-gray-300">Likes</th>
                <th className="px-4 py-3 text-left text-xs font-semibold uppercase text-gray-700 dark:text-gray-300">Comments</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
              {posts.map((post: any) => (
                <tr key={post.id} className="hover:bg-gray-50 dark:hover:bg-gray-800">
                  <td className="px-4 py-3 text-sm text-gray-900 dark:text-white">{post.id}</td>
                  <td className="px-4 py-3 text-sm text-gray-900 dark:text-white">@{post.author.username}</td>
                  <td className="px-4 py-3 text-sm text-gray-900 dark:text-white">{post.content.substring(0, 100)}</td>
                  <td className="px-4 py-3 text-sm text-gray-900 dark:text-white">{post.likesCount}</td>
                  <td className="px-4 py-3 text-sm text-gray-900 dark:text-white">{post.commentsCount}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </RootLayout>
  )
}