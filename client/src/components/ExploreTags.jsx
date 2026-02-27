import { HashtagIcon, ArrowTrendingUpIcon } from "@heroicons/react/24/outline";

// Mock data
const tags = [
  "technology",
  "travel",
  "foodie",
  "developerlife",
  "bookworm",
  "fitness",
  "photography",
  "art",
];

const ExploreTags = () => {
  return (
    <div className="bg-white dark:bg-surface p-5 rounded-3xl shadow-sm border border-gray-100 dark:border-border mt-6">
      {/* Header */}
      <div className="flex items-center gap-2 mb-4 border-b border-gray-50 dark:border-gray-800 pb-2">
        <ArrowTrendingUpIcon className="h-5 w-5 text-purple-500" />
        <h2 className="text-lg font-bold text-gray-800 dark:text-text-primary">
          Explore Tags
        </h2>
      </div>

      {/* Tags Grid */}
      <div className="flex flex-wrap gap-2">
        {tags.map((tag) => (
          <a
            href={`#${tag}`}
            key={tag}
            className="group flex items-center gap-1 px-3 py-1.5 bg-gray-50 dark:bg-background border border-gray-100 dark:border-gray-700 rounded-xl text-sm font-medium text-gray-600 dark:text-text-secondary hover:bg-blue-50 dark:hover:bg-blue-900/20 hover:text-blue-600 dark:hover:text-blue-400 hover:border-blue-200 dark:hover:border-blue-800 transition-all duration-200"
          >
            <HashtagIcon className="h-3 w-3 opacity-50 group-hover:opacity-100" />
            {tag}
          </a>
        ))}
      </div>

      <button className="w-full mt-4 text-xs font-semibold text-blue-500 hover:text-blue-600 dark:hover:text-blue-400 hover:underline transition-colors">
        Show more tags
      </button>
    </div>
  );
};

export default ExploreTags;
