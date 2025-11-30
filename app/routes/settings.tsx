import { useState } from 'react';
import { Form, useActionData, useNavigation, useLoaderData } from 'react-router';
import { requireUserId, getUser } from '~/services/auth.server';
import { prisma } from '~/db/client.server';
import { RootLayout } from '~/components/layout/rootLayout';
import { Input } from '~/components/ui/input';
import { Textarea } from '~/components/ui/textarea';
import { Button } from '~/components/ui/button';
import { UserAvatar } from '~/components/user/userAvatar';
export async function loader({ request }: any) {
  const currentUser = await getUser(request);
  return { currentUser };
}
export async function action({ request }: any) {
  const userId = await requireUserId(request);
  const formData = await request.formData();
  const displayName = formData.get('displayName');
  const bio = formData.get('bio');
  const avatarUrl = formData.get('avatarUrl');
  const coverUrl = formData.get('coverUrl');
  try {
    await prisma.user.update({
      where: { id: userId },
      data: {
        displayName: displayName as string,
        bio: bio as string || null,
        avatarUrl: avatarUrl as string || null,
        coverUrl: coverUrl as string || null
      }
    });
    return { success: true };
  } catch (error: any) {
    return { error: 'Failed To Update Profile' };
  }
}
export default function Settings() {
  const { currentUser } = useLoaderData<typeof loader>();
  const actionData = useActionData<typeof action>();
  const navigation = useNavigation();
  const isSubmitting = navigation.state === 'submitting';
  const [displayName, setDisplayName] = useState(currentUser?.displayName || '');
  const [bio, setBio] = useState(currentUser?.bio || '');
  return (
    <RootLayout currentUser={currentUser}>
      <div className="max-w-2xl mx-auto">
        <div className="sticky top-0 z-10 bg-white dark:bg-gray-950 border-b border-gray-200 dark:border-gray-800 p-4">
          <h1 className="text-xl font-bold text-gray-900 dark:text-white">Settings</h1>
        </div>
        <div className="p-4">
          <div className="relative mb-16">
            {currentUser?.coverUrl ? (
              <img src={currentUser.coverUrl} alt="" className="w-full h-48 object-cover rounded-lg" />
            ) : (
              <div className="w-full h-48 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg" />
            )}
            <div className="absolute -bottom-14 left-4">
              <UserAvatar src={currentUser?.avatarUrl} alt={currentUser?.displayName || 'User'} size="lg" className="border-4 border-white dark:border-gray-950" />
            </div>
          </div>
          <Form method="post" className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-2 text-gray-700 dark:text-gray-300">Display Name</label>
              <Input type="text" name="displayName" value={displayName} onChange={(e) => setDisplayName(e.target.value)} placeholder="Your Display Name" />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2 text-gray-700 dark:text-gray-300">Bio</label>
              <Textarea name="bio" value={bio} onChange={(e) => setBio(e.target.value)} placeholder="Tell Us About Yourself" rows={4} />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2 text-gray-700 dark:text-gray-300">Avatar URL</label>
              <Input type="text" name="avatarUrl" defaultValue={currentUser?.avatarUrl || ''} placeholder="https://example.com/avatar.jpg" />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2 text-gray-700 dark:text-gray-300">Cover URL</label>
              <Input type="text" name="coverUrl" defaultValue={currentUser?.coverUrl || ''} placeholder="https://example.com/cover.jpg" />
            </div>
            {actionData?.error && (
              <div className="text-red-600 text-sm">{actionData.error}</div>
            )}
            {actionData?.success && (
              <div className="text-green-600 text-sm">Profile Updated Successfully!</div>
            )}
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? 'Saving...' : 'Save Changes'}
            </Button>
          </Form>
        </div>
      </div>
    </RootLayout>
  )
}