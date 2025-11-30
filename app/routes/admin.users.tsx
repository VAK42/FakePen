import { useState } from 'react';
import { useLoaderData, useFetcher, Form } from 'react-router';
import { getUser } from '~/services/auth.server';
import { prisma } from '~/db/client.server';
import { hashPassword } from '~/services/auth.server';
import { RootLayout } from '~/components/layout/rootLayout';
import { Users as UsersIcon, Trash2, Edit, Plus, Shield } from 'lucide-react';
import { formatDate } from '~/utils/formatters';
import { Dialog, DialogContent, DialogHeader } from '~/components/ui/dialog';
import { Input } from '~/components/ui/input';
import { Button } from '~/components/ui/button';
export async function loader({ request }: any) {
  const currentUser = await getUser(request);
  if (!currentUser || !currentUser.isAdmin) {
    throw new Response('Unauthorized', { status: 403 });
  }
  const url = new URL(request.url);
  const search = url.searchParams.get('search') || '';
  const users = search ? await prisma.user.findMany({
    where: {
      OR: [
        { username: { contains: search } },
        { email: { contains: search } },
        { displayName: { contains: search } }
      ]
    },
    orderBy: { createdAt: 'desc' },
    take: 100,
    select: {
      id: true,
      username: true,
      email: true,
      displayName: true,
      bio: true,
      avatarUrl: true,
      isAdmin: true,
      createdAt: true
    }
  }) : await prisma.user.findMany({
    orderBy: { createdAt: 'desc' },
    take: 100,
    select: {
      id: true,
      username: true,
      email: true,
      displayName: true,
      bio: true,
      avatarUrl: true,
      isAdmin: true,
      createdAt: true
    }
  });
  return { currentUser, users, search };
}
export async function action({ request }: any) {
  const currentUser = await getUser(request);
  if (!currentUser || !currentUser.isAdmin) {
    return { error: 'Unauthorized' };
  }
  const formData = await request.formData();
  const action = formData.get('action');
  const id = formData.get('id');
  try {
    if (action === 'delete') {
      await prisma.user.delete({ where: { id: parseInt(id as string) } });
      return { success: true, message: 'User Deleted' };
    } else if (action === 'create') {
      const username = formData.get('username');
      const email = formData.get('email');
      const password = formData.get('password');
      const displayName = formData.get('displayName');
      const isAdmin = formData.get('isAdmin') === 'true';
      await prisma.user.create({
        data: {
          username: username as string,
          email: email as string,
          password: await hashPassword(password as string),
          displayName: displayName as string,
          isAdmin
        }
      });
      return { success: true, message: 'User Created' };
    } else if (action === 'update') {
      const displayName = formData.get('displayName');
      const bio = formData.get('bio');
      const isAdmin = formData.get('isAdmin') === 'true';
      await prisma.user.update({
        where: { id: parseInt(id as string) },
        data: {
          displayName: displayName as string,
          bio: bio as string || null,
          isAdmin
        }
      });
      return { success: true, message: 'User Updated' };
    }
    return { error: 'Invalid Action' };
  } catch (error: any) {
    return { error: error.message || 'Action Failed' };
  }
}
export default function AdminUsers() {
  const { currentUser, users, search } = useLoaderData<typeof loader>();
  const fetcher = useFetcher();
  const [showCreateDialog, setShowCreateDialog] = useState(false);
  const [showEditDialog, setShowEditDialog] = useState(false);
  const [selectedUser, setSelectedUser] = useState<any>(null);
  const [searchQuery, setSearchQuery] = useState(search);
  const handleDelete = (id: number) => {
    if (confirm('Are You Sure? This Will Delete All User Data Including Posts And Comments.')) {
      fetcher.submit({ action: 'delete', id: id.toString() }, { method: 'post' });
    }
  };
  return (
    <RootLayout currentUser={currentUser}>
      <div className="max-w-7xl mx-auto p-4">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-3xl font-bold flex items-center gap-2 text-gray-900 dark:text-white">
              <UsersIcon className="h-8 w-8 text-blue-600" />
              User Management
            </h1>
            <p className="text-gray-600 dark:text-gray-400 mt-1">Total: {users.length} Users</p>
          </div>
          <Button onClick={() => setShowCreateDialog(true)}>
            <Plus className="h-4 w-4 mr-2" />
            Create User
          </Button>
        </div>
        <div className="mb-4">
          <Form method="get">
            <Input type="text" name="search" placeholder="Search By Username, Email, Or Name..." defaultValue={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} />
          </Form>
        </div>
        <div className="bg-white dark:bg-gray-900 rounded-lg border border-gray-200 dark:border-gray-800 overflow-hidden">
          <table className="w-full">
            <thead className="bg-gray-50 dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700">
              <tr>
                <th className="px-4 py-3 text-left text-xs font-semibold uppercase text-gray-700 dark:text-gray-300">ID</th>
                <th className="px-4 py-3 text-left text-xs font-semibold uppercase text-gray-700 dark:text-gray-300">User</th>
                <th className="px-4 py-3 text-left text-xs font-semibold uppercase text-gray-700 dark:text-gray-300">Email</th>
                <th className="px-4 py-3 text-left text-xs font-semibold uppercase text-gray-700 dark:text-gray-300">Joined</th>
                <th className="px-4 py-3 text-left text-xs font-semibold uppercase text-gray-700 dark:text-gray-300">Role</th>
                <th className="px-4 py-3 text-right text-xs font-semibold uppercase text-gray-700 dark:text-gray-300">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
              {users.map((user: any) => (
                <tr key={user.id} className="hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors">
                  <td className="px-4 py-3 text-sm text-gray-900 dark:text-white">{user.id}</td>
                  <td className="px-4 py-3">
                    <div>
                      <p className="font-semibold text-gray-900 dark:text-white">{user.displayName}</p>
                      <p className="text-sm text-gray-600 dark:text-gray-400">@{user.username}</p>
                    </div>
                  </td>
                  <td className="px-4 py-3 text-sm text-gray-900 dark:text-white">{user.email}</td>
                  <td className="px-4 py-3 text-sm text-gray-600 dark:text-gray-400">{formatDate(user.createdAt)}</td>
                  <td className="px-4 py-3">
                    {user.isAdmin && (
                      <span className="inline-flex items-center gap-1 px-2 py-1 bg-red-100 dark:bg-red-900/20 text-red-700 dark:text-red-400 text-xs font-semibold rounded">
                        <Shield className="h-3 w-3" />
                        Admin
                      </span>
                    )}
                    {!user.isAdmin && (
                      <span className="px-2 py-1 bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-400 text-xs font-semibold rounded">User</span>
                    )}
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center justify-end gap-2">
                      <button onClick={() => { setSelectedUser(user); setShowEditDialog(true); }} className="text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-900/20 p-2 rounded transition-colors">
                        <Edit className="h-4 w-4" />
                      </button>
                      <button onClick={() => handleDelete(user.id)} disabled={user.id === currentUser?.id} className="text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 p-2 rounded transition-colors disabled:opacity-50 disabled:cursor-not-allowed">
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <Dialog open={showCreateDialog} onOpenChange={setShowCreateDialog}>
          <DialogContent>
            <DialogHeader>
              <h2 className="text-xl font-bold text-gray-900 dark:text-white">Create New User</h2>
            </DialogHeader>
            <fetcher.Form method="post" className="space-y-4" onSubmit={() => setShowCreateDialog(false)}>
              <input type="hidden" name="action" value="create" />
              <div>
                <label className="block text-sm font-medium mb-1 text-gray-700 dark:text-gray-300">Username</label>
                <Input type="text" name="username" required />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1 text-gray-700 dark:text-gray-300">Email</label>
                <Input type="email" name="email" required />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1 text-gray-700 dark:text-gray-300">Password</label>
                <Input type="password" name="password" required />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1 text-gray-700 dark:text-gray-300">Display Name</label>
                <Input type="text" name="displayName" required />
              </div>
              <div className="flex items-center gap-2">
                <input type="checkbox" name="isAdmin" value="true" id="createAdmin" />
                <label htmlFor="createAdmin" className="text-sm font-medium text-gray-700 dark:text-gray-300">Admin User</label>
              </div>
              <div className="flex gap-2 justify-end">
                <Button type="button" variant="outline" onClick={() => setShowCreateDialog(false)}>Cancel</Button>
                <Button type="submit">Create User</Button>
              </div>
            </fetcher.Form>
          </DialogContent>
        </Dialog>
        <Dialog open={showEditDialog} onOpenChange={setShowEditDialog}>
          <DialogContent>
            <DialogHeader>
              <h2 className="text-xl font-bold text-gray-900 dark:text-white">Edit User</h2>
            </DialogHeader>
            {selectedUser && (
              <fetcher.Form method="post" className="space-y-4" onSubmit={() => setShowEditDialog(false)}>
                <input type="hidden" name="action" value="update" />
                <input type="hidden" name="id" value={selectedUser.id} />
                <div>
                  <label className="block text-sm font-medium mb-1 text-gray-700 dark:text-gray-300">Display Name</label>
                  <Input type="text" name="displayName" defaultValue={selectedUser.displayName} required />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1 text-gray-700 dark:text-gray-300">Bio</label>
                  <Input type="text" name="bio" defaultValue={selectedUser.bio || ''} />
                </div>
                <div className="flex items-center gap-2">
                  <input type="checkbox" name="isAdmin" value="true" id="editAdmin" defaultChecked={selectedUser.isAdmin} />
                  <label htmlFor="editAdmin" className="text-sm font-medium text-gray-700 dark:text-gray-300">Admin User</label>
                </div>
                <div className="flex gap-2 justify-end">
                  <Button type="button" variant="outline" onClick={() => setShowEditDialog(false)}>Cancel</Button>
                  <Button type="submit">Update User</Button>
                </div>
              </fetcher.Form>
            )}
          </DialogContent>
        </Dialog>
      </div>
    </RootLayout>
  )
}