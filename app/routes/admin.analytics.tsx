import { useLoaderData } from 'react-router';
import { getUser } from '~/services/auth.server';
import { prisma } from '~/db/client.server';
import { RootLayout } from '~/components/layout/rootLayout';
import { LineChart, Line, BarChart, Bar, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { TrendingUp, Users, FileText, MessageSquare, Activity } from 'lucide-react';
import { formatNumber } from '~/utils/formatters';
import { Link } from 'react-router';
export async function loader({ request }: any) {
  const currentUser = await getUser(request);
  if (!currentUser || !currentUser.isAdmin) {
    throw new Response('Unauthorized', { status: 403 });
  }
  const stats = {
    totalUsers: await prisma.user.count(),
    totalPosts: await prisma.post.count(),
    totalComments: await prisma.comment.count(),
    totalLikes: await prisma.like.count(),
    totalBookmarks: await prisma.bookmark.count(),
    totalFollows: await prisma.follow.count(),
    totalNotifications: await prisma.notification.count(),
    totalMessages: await prisma.message.count()
  };
  const today = new Date();
  const last7Days = new Date(today.getTime() - 7 * 24 * 60 * 60 * 1000);
  const startOfToday = new Date(today.setHours(0, 0, 0, 0));
  const newUsersToday = await prisma.user.count({
    where: {
      createdAt: {
        gte: startOfToday
      }
    }
  });
  const newUsersWeek = await prisma.user.count({
    where: { createdAt: { gte: last7Days } }
  });
  const newPostsWeek = await prisma.post.count({
    where: { createdAt: { gte: last7Days } }
  });
  const activityData = [];
  for (let i = 6; i >= 0; i--) {
    const date = new Date(today.getTime() - i * 24 * 60 * 60 * 1000);
    const startOfDay = new Date(date.setHours(0, 0, 0, 0));
    const endOfDay = new Date(date.setHours(23, 59, 59, 999));
    const users = await prisma.user.count({
      where: { createdAt: { gte: startOfDay, lte: endOfDay } }
    });
    const posts = await prisma.post.count({
      where: { createdAt: { gte: startOfDay, lte: endOfDay } }
    });
    const comments = await prisma.comment.count({
      where: { createdAt: { gte: startOfDay, lte: endOfDay } }
    });
    activityData.push({
      date: `${date.getMonth() + 1}/${date.getDate()}`,
      users,
      posts,
      comments
    });
  }
  const contentDistribution = [
    { name: 'Posts', value: stats.totalPosts },
    { name: 'Comments', value: stats.totalComments },
    { name: 'Likes', value: stats.totalLikes },
    { name: 'Bookmarks', value: stats.totalBookmarks }
  ];
  const topPosts = await prisma.post.findMany({
    orderBy: { likesCount: 'desc' },
    take: 5,
    include: {
      author: {
        select: { username: true }
      }
    }
  });
  return {
    currentUser,
    stats,
    newUsersToday,
    newUsersWeek,
    newPostsWeek,
    activityData,
    contentDistribution,
    topPosts
  };
}
export default function AdminAnalytics() {
  const { currentUser, stats, newUsersToday, newUsersWeek, newPostsWeek, activityData, contentDistribution, topPosts } = useLoaderData<typeof loader>();
  const COLORS = ['#3b82f6', '#10b981', '#f59e0b', '#ef4444'];
  return (
    <RootLayout currentUser={currentUser}>
      <div className="max-w-7xl mx-auto p-4">
        <div className="mb-6">
          <h1 className="text-3xl font-bold flex items-center gap-2 text-gray-900 dark:text-white">
            <Activity className="h-8 w-8 text-blue-600" />
            Admin Analytics
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mt-1">System Performance And Insights</p>
        </div>
        <div className="grid grid-cols-4 gap-4 mb-6">
          <div className="bg-gradient-to-br from-blue-500 to-blue-600 text-white p-6 rounded-lg shadow-lg">
            <Users className="h-8 w-8 mb-2 opacity-80" />
            <p className="text-3xl font-bold">{formatNumber(stats.totalUsers)}</p>
            <p className="text-sm opacity-90">Total Users</p>
            <p className="text-xs mt-2 opacity-75">+{newUsersToday} Today</p>
          </div>
          <div className="bg-gradient-to-br from-green-500 to-green-600 text-white p-6 rounded-lg shadow-lg">
            <FileText className="h-8 w-8 mb-2 opacity-80" />
            <p className="text-3xl font-bold">{formatNumber(stats.totalPosts)}</p>
            <p className="text-sm opacity-90">Total Posts</p>
            <p className="text-xs mt-2 opacity-75">+{newPostsWeek} This Week</p>
          </div>
          <div className="bg-gradient-to-br from-purple-500 to-purple-600 text-white p-6 rounded-lg shadow-lg">
            <MessageSquare className="h-8 w-8 mb-2 opacity-80" />
            <p className="text-3xl font-bold">{formatNumber(stats.totalComments)}</p>
            <p className="text-sm opacity-90">Total Comments</p>
          </div>
          <div className="bg-gradient-to-br from-orange-500 to-orange-600 text-white p-6 rounded-lg shadow-lg">
            <TrendingUp className="h-8 w-8 mb-2 opacity-80" />
            <p className="text-3xl font-bold">{formatNumber(stats.totalLikes + stats.totalBookmarks)}</p>
            <p className="text-sm opacity-90">Total Engagements</p>
          </div>
        </div>
        <div className="grid grid-cols-2 gap-6 mb-6">
          <div className="bg-white dark:bg-gray-900 p-6 rounded-lg border border-gray-200 dark:border-gray-800">
            <h2 className="text-xl font-bold mb-4 text-gray-900 dark:text-white">7 Day Activity Trend</h2>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={activityData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Line type="monotone" dataKey="users" stroke="#3b82f6" name="New Users" />
                <Line type="monotone" dataKey="posts" stroke="#10b981" name="New Posts" />
                <Line type="monotone" dataKey="comments" stroke="#f59e0b" name="New Comments" />
              </LineChart>
            </ResponsiveContainer>
          </div>
          <div className="bg-white dark:bg-gray-900 p-6 rounded-lg border border-gray-200 dark:border-gray-800">
            <h2 className="text-xl font-bold mb-4 text-gray-900 dark:text-white">Content Distribution</h2>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie data={contentDistribution} cx="50%" cy="50%" labelLine={false} label={(entry) => `${entry.name}: ${entry.value}`} outerRadius={100} fill="#8884d8" dataKey="value">
                  {contentDistribution.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
        <div className="grid grid-cols-2 gap-6 mb-6">
          <div className="bg-white dark:bg-gray-900 p-6 rounded-lg border border-gray-200 dark:border-gray-800">
            <h2 className="text-xl font-bold mb-4 text-gray-900 dark:text-white">Database Stats</h2>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={[
                { name: 'Users', count: stats.totalUsers },
                { name: 'Posts', count: stats.totalPosts },
                { name: 'Comments', count: stats.totalComments },
                { name: 'Follows', count: stats.totalFollows },
                { name: 'Likes', count: stats.totalLikes },
                { name: 'Bookmarks', count: stats.totalBookmarks }
              ]}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="count" fill="#3b82f6" />
              </BarChart>
            </ResponsiveContainer>
          </div>
          <div className="bg-white dark:bg-gray-900 p-6 rounded-lg border border-gray-200 dark:border-gray-800">
            <h2 className="text-xl font-bold mb-4 text-gray-900 dark:text-white">Top Posts By Engagement</h2>
            <div className="space-y-3">
              {topPosts.map((post: any, index: number) => (
                <Link key={post.id} to={`/posts/${post.id}`} className="block p-3 border border-gray-200 dark:border-gray-800 rounded hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <p className="text-sm font-semibold text-gray-700 dark:text-gray-300">#{index + 1} By @{post.author?.username}</p>
                      <p className="text-xs text-gray-600 dark:text-gray-400 line-clamp-2 mt-1">{post.content}</p>
                    </div>
                    <div className="text-right ml-4">
                      <p className="text-sm font-bold text-blue-600">{post.likesCount}</p>
                      <p className="text-xs text-gray-500">Likes</p>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </div>
      </div>
    </RootLayout>
  )
}