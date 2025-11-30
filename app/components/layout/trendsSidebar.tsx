interface TrendTag {
  tag: string;
  count: number;
}
interface TrendsSidebarProps {
  trendingTags?: TrendTag[];
}
export function TrendsSidebar({ trendingTags = [] }: TrendsSidebarProps) {
  if (trendingTags.length === 0) {
    return null;
  }
  return (
    <div className="space-y-4">
      <div className="bg-white dark:bg-gray-900 rounded-lg p-4 border border-gray-200 dark:border-gray-800">
        <h2 className="font-bold text-lg mb-3 text-gray-900 dark:text-white">Trending Tags</h2>
        <div className="space-y-2">
          {trendingTags.map(({ tag, count }) => (
            <a key={tag} href={`/hashtag/${tag.slice(1)}`} className="block p-2 hover:bg-gray-50 dark:hover:bg-gray-800 rounded">
              <div className="font-semibold text-blue-600">{tag}</div>
              <div className="text-sm text-gray-600 dark:text-gray-400">{count} Posts</div>
            </a>
          ))}
        </div>
      </div>
    </div>
  )
}