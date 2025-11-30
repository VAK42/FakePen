import { useLoaderData } from 'react-router';
import { getUser, getUserId } from '~/services/auth.server';
import { prisma } from '~/db/client.server';
import { RootLayout } from '~/components/layout/rootLayout';
import { UserAvatar } from '~/components/user/userAvatar';
import { FollowButton } from '~/components/user/followButton';
import { PostCard } from '~/components/posts/postCard';
import { formatNumber } from '~/utils/formatters';
import { Link } from 'react-router';
export async function loader({ request, params }: any) {
  const currentUser = await getUser(request);
  const currentUserId = await getUserId(request);
  const user = await prisma.user.findUnique({
    where: { username: params.username },
    select: {
      id: true,
      username: true,
      displayName: true,
      bio: true,
      avatarUrl: true,
      coverUrl: true,
      createdAt: true
    }
  });
  if (!user) {
    throw new Response('User Not Found', { status: 404 });
  }
  const posts = await prisma.post.findMany({
    where: { userId: user.id },
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
    orderBy: { createdAt: 'desc' },
    take: 20
  });
  const postsWithInteractions = currentUserId ? await Promise.all(
    posts.map(async (post: any) => {
      const isLiked = await prisma.like.findUnique({
        where: {
          postId_userId: {
            postId: post.id,
            userId: currentUserId
          }
        }
      }) !== null;
      const isBookmarked = await prisma.bookmark.findUnique({
        where: {
          postId_userId: {
            postId: post.id,
            userId: currentUserId
          }
        }
      }) !== null;
      return { ...post, isLiked, isBookmarked };
    })
  ) : posts;
  const followersCount = await prisma.follow.count({ where: { followingId: user.id } });
  const followingCount = await prisma.follow.count({ where: { followerId: user.id } });
  const isFollowing = currentUserId ? await prisma.follow.findUnique({
    where: {
      followerId_followingId: {
        followerId: currentUserId,
        followingId: user.id
      }
    }
  }) !== null : false;
  return {
    currentUser,
    user,
    posts: postsWithInteractions,
    followersCount,
    followingCount,
    isFollowing
  };
}
export default function UserProfile() {
  const { currentUser, user, posts, followersCount, followingCount, isFollowing } = useLoaderData<typeof loader>();
  return (
    <RootLayout currentUser={currentUser}>
      <div className="max-w-2xl mx-auto">
        <div className="relative">
          {user.coverUrl ? (
            <img src={user.coverUrl} alt="" className="w-full h-48 object-cover" />
          ) : (
            <div className="w-full h-48 bg-gradient-to-r from-blue-500 to-purple-600" />
          )}
          <div className="absolute -bottom-16 left-4">
            <UserAvatar src={user.avatarUrl} alt={user.displayName} size="lg" className="border-4 border-white dark:border-gray-950" />
          </div>
        </div>
        <div className="p-4 pt-20">
          <div className="flex justify-between items-start mb-4">
            <div>
              <h1 className="text-2xl font-bold text-gray-900 dark:text-white">{user.displayName}</h1>
              <p className="text-gray-600 dark:text-gray-400">@{user.username}</p>
            </div>
            {currentUser?.id !== user.id && (
              <FollowButton userId={user.id} isFollowing={isFollowing} />
            )}
          </div>
          {user.bio && (
            <p className="text-gray-900 dark:text-white mb-4">{user.bio}</p>
          )}
          <div className="flex gap-4 mb-6">
            <Link to={`/users/${user.username}/followers`} className="hover:underline">
              <span className="font-bold text-gray-900 dark:text-white">{formatNumber(followersCount)}</span>
              <span className="text-gray-600 dark:text-gray-400 ml-1">Followers</span>
            </Link>
            <Link to={`/users/${user.username}/following`} className="hover:underline">
              <span className="font-bold text-gray-900 dark:text-white">{formatNumber(followingCount)}</span>
              <span className="text-gray-600 dark:text-gray-400 ml-1">Following</span>
            </Link>
          </div>
        </div>
        <div className="border-t border-gray-200 dark:border-gray-800">
          {posts.length === 0 ? (
            <div className="p-8 text-center text-gray-600 dark:text-gray-400">
              <p>No Posts Yet</p>
            </div>
          ) : (
            posts.map((post: any) => (
              <PostCard key={post.id} post={post} currentUserId={currentUser?.id} />
            ))
          )}
        </div>
      </div>
    </RootLayout>
  )
}