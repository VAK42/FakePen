import { Link, useLocation, Form } from 'react-router';
import { Home, Search, Bell, Mail, User, Bookmark, LogOut, Users, Settings, Compass, Shield } from 'lucide-react';
import { cn } from '~/utils/formatters';
interface SidebarProps {
  currentUser?: {
    id: number;
    username: string;
    displayName: string;
    avatarUrl?: string | null;
    isAdmin?: boolean;
  };
}
export function Sidebar({ currentUser }: SidebarProps) {
  const location = useLocation();
  const navItems = [
    { icon: Home, label: 'Home', path: '/' },
    { icon: Compass, label: 'Explore', path: '/explore' },
    { icon: Search, label: 'Search', path: '/search' },
    { icon: Bell, label: 'Notifications', path: '/notifications' },
    { icon: Mail, label: 'Messages', path: '/messages' },
    { icon: Bookmark, label: 'Bookmarks', path: '/bookmarks' },
    { icon: Settings, label: 'Settings', path: '/settings' },
    { icon: User, label: 'Profile', path: currentUser ? `/users/${currentUser.username}` : '/login' }
  ];
  if (currentUser?.isAdmin) {
    navItems.push({ icon: Shield, label: 'Admin', path: '/admin' });
  }
  return (
    <div className="w-64 h-screen sticky top-0 border-r border-gray-200 dark:border-gray-800 p-4 flex flex-col">
      <div className="mb-8">
        <Link to="/" className="text-2xl font-bold text-blue-600 flex items-center gap-2">
          <Users className="h-8 w-8" />
          <span>FakePen</span>
        </Link>
      </div>
      <nav className="flex-1 space-y-2">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = location.pathname === item.path;
          return (
            <Link key={item.path} to={item.path} className={cn('flex items-center gap-4 px-4 py-3 rounded-xl transition-colors font-medium', isActive ? 'bg-blue-50 dark:bg-blue-900/20 text-blue-600' : 'hover:bg-gray-100 dark:hover:bg-gray-800')}>
              <Icon className="h-6 w-6" />
              <span>{item.label}</span>
            </Link>
          )
        })}
      </nav>
      {currentUser && (
        <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-800">
          <Form method="post" action="/logout">
            <button type="submit" className="w-full flex items-center gap-4 px-4 py-3 rounded-xl hover:bg-red-50 dark:hover:bg-red-900/20 text-red-600 font-medium transition-colors">
              <LogOut className="h-6 w-6" />
              <span>Logout</span>
            </button>
          </Form>
        </div>
      )}
    </div>
  )
}