import { useLoaderData, Form } from 'react-router';
import { getUserId, getUser } from '~/services/auth.server';
import { prisma } from '~/db/client.server';
import { RootLayout } from '~/components/layout/rootLayout';
import { UserCard } from '~/components/user/userCard';
import { PostCard } from '~/components/posts/postCard';
import { Input } from '~/components/ui/input';
import { Search as SearchIcon } from 'lucide-react';
export async function loader({ request }: any) {
  const url = new URL(request.url);
  const q = url.searchParams.get('q') || '';
  const userId = await getUserId(request);
  const currentUser = await getUser(request);
  const users = q ? await prisma.user.findMany({
    where: {
      OR: [
        { username: { contains: q } },
        { displayName: { contains: q } }
      ]
    },
    select: {
      id: true,
      username: true,
      displayName: true,
      bio: true,
      avatarUrl: true
    },
    take: 20
  }) : [];
  const posts = q ? await prisma.post.findMany({
    where: {
      content: { contains: q }
    },
    include: {
      author: {
        select: {
          id: true,
          username: true,
          displayName: true,
          avatarUrl: true
        }
      }
    },
    take: 20,
    orderBy: { createdAt: 'desc' }
  }) : [];
  return { currentUser, users, posts, query: q };
}
export default function Search() {
  const { currentUser, users, posts, query } = useLoaderData<typeof loader>();
  return (
    <RootLayout currentUser={currentUser}>
      <div className="max-w-2xl mx-auto">
        <div className="sticky top-0 z-10 bg-white dark:bg-gray-950 border-b border-gray-200 dark:border-gray-800 p-4">
          <h1 className="text-xl font-bold text-gray-900 dark:text-white mb-4">Search</h1>
          <Form method="get" className="relative">
            <SearchIcon className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
            <Input
              type="search"
              name="q"
              defaultValue={query}
              placeholder="Search Users & Posts..."
              className="pl-10"
            />
          </Form>
        </div>
        {query && (
          <div>
            {users.length > 0 && (
              <div className="border-b border-gray-200 dark:border-gray-800">
                <h2 className="p-4 font-semibold text-gray-900 dark:text-white">Users</h2>
                {users.map((user: any) => (
                  <UserCard key={user.id} user={user} currentUserId={currentUser?.id} />
                ))}
              </div>
            )}
            {posts.length > 0 && (
              <div>
                <h2 className="p-4 font-semibold text-gray-900 dark:text-white">Posts</h2>
                {posts.map((post: any) => (
                  <PostCard key={post.id} post={post} currentUserId={currentUser?.id} />
                ))}
              </div>
            )}
            {users.length === 0 && posts.length === 0 && (
              <div className="p-8 text-center text-gray-600 dark:text-gray-400">
                <p>No Results Found For "{query}"</p>
              </div>
            )}
          </div>
        )}
      </div>
    </RootLayout>
  )
}