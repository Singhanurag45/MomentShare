// client/src/components/FeedSkeleton.jsx

const PostSkeleton = () => (
  <div className="bg-white border rounded-lg shadow-sm p-4">
    <div className="flex items-center mb-4">
      <div className="w-10 h-10 rounded-full bg-gray-200 mr-4"></div>
      <div className="w-32 h-4 bg-gray-200 rounded"></div>
    </div>
    <div className="w-full h-96 bg-gray-200 rounded-lg"></div>
    <div className="mt-4 space-y-2">
      <div className="w-1/4 h-4 bg-gray-200 rounded"></div>
      <div className="w-full h-4 bg-gray-200 rounded"></div>
    </div>
  </div>
);

const FeedSkeleton = () => {
  return (
    <div className="animate-pulse space-y-6 mt-6">
      <PostSkeleton />
      <PostSkeleton />
    </div>
  );
};

export default FeedSkeleton;
