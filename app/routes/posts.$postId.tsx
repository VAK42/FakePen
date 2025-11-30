import { useLoaderData } from 'react-router';
import { getUser, getUserId } from '~/services/auth.server';
import { prisma } from '~/db/client.server';
import { RootLayout } from '~/components/layout/rootLayout';
import { PostCard } from '~/components/posts/postCard';
import { CommentList } from '~/components/comments/commentList';
export async function loader({ request, params }: any) {
  const currentUser = await getUser(request);
  const currentUserId = await getUserId(request);
  const postId = parseInt(params.postId);
  const post = await prisma.post.findUnique({
    where: { id: postId },
    include: {
      author: {
        select: {
          id: true,
          username: true,
          displayName: true,
          avatarUrl: true
        }
      }
    }
  });
  if (!post) {
    throw new Response('Post Not Found', { status: 404 });
  }
  const isLiked = currentUserId ? await prisma.like.findUnique({
    where: {
      postId_userId: {
        postId,
        userId: currentUserId
      }
    }
  }) !== null : false;
  const isBookmarked = currentUserId ? await prisma.bookmark.findUnique({
    where: {
      postId_userId: {
        postId,
        userId: currentUserId
      }
    }
  }) !== null : false;
  const comments = await prisma.comment.findMany({
    where: { postId },
    include: {
      user: {
        select: {
          id: true,
          username: true,
          displayName: true,
          avatarUrl: true
        }
      }
    },
    orderBy: { createdAt: 'desc' }
  });
  return {
    currentUser,
    post: { ...post, isLiked, isBookmarked },
    comments
  };
}
export default function PostDetail() {
  const { currentUser, post, comments } = useLoaderData<typeof loader>();
  return (
    <RootLayout currentUser={currentUser}>
      <div className="max-w-2xl mx-auto">
        <div className="sticky top-0 z-10 bg-white dark:bg-gray-950 border-b border-gray-200 dark:border-gray-800 p-4">
          <h1 className="text-xl font-bold text-gray-900 dark:text-white">Post</h1>
        </div>
        <PostCard post={post} currentUserId={currentUser?.id} detailed />
        <CommentList comments={comments} currentUserId={currentUser?.id} postId={post.id} />
      </div>
    </RootLayout>
  )
}