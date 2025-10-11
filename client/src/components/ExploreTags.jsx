// client/src/components/ExploreTags.jsx

// Mock data
const tags = [
  "technology",
  "travel",
  "foodie",
  "developerlife",
  "bookworm",
  "fitness",
];

const ExploreTags = () => {
  return (
    <div className="bg-white dark:bg-surface p-4 rounded-2xl shadow-sm border border-gray-100 dark:border-border transition-shadow hover:shadow-lg">
      <h2 className="text-lg font-semibold text-gray-700 dark:text-gray-200 mb-3">
        Explore Tags
      </h2>
      <div className="flex flex-wrap gap-2">
        {tags.map((tag) => (
          <a
            href="#"
            key={tag}
            className="px-3 py-1 bg-gray-100 dark:bg-gray-800 text-sm text-gray-700 dark:text-gray-300 rounded-full hover:bg-indigo-100 dark:hover:bg-primary/50 hover:text-primary dark:hover:text-white transition"
          >
            #{tag}
          </a>
        ))}
      </div>
    </div>
  );
};

export default ExploreTags;
