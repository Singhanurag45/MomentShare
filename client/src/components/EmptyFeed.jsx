import { NewspaperIcon, UserGroupIcon } from "@heroicons/react/24/outline";

const EmptyFeed = () => {
  return (
    <div className="flex flex-col items-center justify-center text-center bg-white dark:bg-surface border border-dashed border-gray-300 dark:border-gray-700 rounded-3xl p-10 mt-6 min-h-[300px]">
      {/* Icon Wrapper with Gradient */}
      <div className="bg-blue-50 dark:bg-blue-900/20 p-6 rounded-full mb-6 animate-pulse">
        <NewspaperIcon className="h-16 w-16 text-blue-500 dark:text-blue-400" />
      </div>

      <h2 className="text-2xl font-bold text-gray-800 dark:text-text-primary mb-3">
        Your Feed is Quiet
      </h2>

      <p className="text-gray-500 dark:text-text-secondary max-w-sm leading-relaxed mb-6">
        It looks like you haven't followed anyone yet, or the people you follow
        haven't posted lately.
      </p>

      {/* Helper Badge */}
      <div className="inline-flex items-center gap-2 px-4 py-2 bg-gray-50 dark:bg-background rounded-full border border-gray-100 dark:border-gray-700">
        <UserGroupIcon className="h-4 w-4 text-purple-500" />
        <span className="text-sm font-medium text-gray-600 dark:text-gray-300">
          Check the "Suggestions" panel to find friends!
        </span>
      </div>
    </div>
  );
};

export default EmptyFeed;
