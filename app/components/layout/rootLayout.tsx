import { TrendsSidebar } from './trendsSidebar';
import { Sidebar } from './sidebar';
interface RootLayoutProps {
  children: React.ReactNode;
  currentUser: any;
  trendingTags?: Array<{ tag: string; count: number }>;
}
export function RootLayout({ children, currentUser, trendingTags }: RootLayoutProps) {
  return (
    <div className="min-h-screen bg-white dark:bg-gray-950 text-gray-900 dark:text-gray-100">
      <div className="flex max-w-7xl mx-auto">
        <Sidebar currentUser={currentUser} />
        <div className="flex-1">
          {children}
        </div>
        <TrendsSidebar trendingTags={trendingTags} />
      </div>
    </div>
  )
}