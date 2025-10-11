const ProfileSkeleton = () => {
  return (
    <div className="container mx-auto p-4 max-w-4xl animate-pulse">
      {/* Header Skeleton */}
      <div className="flex flex-col sm:flex-row items-center p-4">
        <div className="w-24 h-24 md:w-36 md:h-36 rounded-full bg-gray-300 mr-0 sm:mr-8 mb-4 sm:mb-0 flex-shrink-0"></div>
        <div className="flex flex-col items-center sm:items-start w-full">
          <div className="h-8 w-48 bg-gray-300 rounded mb-4"></div>
          <div className="flex space-x-6 mb-4">
            <div className="h-4 w-20 bg-gray-300 rounded"></div>
            <div className="h-4 w-20 bg-gray-300 rounded"></div>
            <div className="h-4 w-20 bg-gray-300 rounded"></div>
          </div>
          <div className="h-4 w-32 bg-gray-300 rounded mb-2"></div>
          <div className="h-4 w-64 bg-gray-300 rounded"></div>
        </div>
      </div>
      <hr className="my-8" />
      {/* Post Grid Skeleton */}
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-1 md:gap-4">
        {Array.from({ length: 6 }).map((_, index) => (
          <div key={index} className="aspect-square bg-gray-300 rounded"></div>
        ))}
      </div>
    </div>
  );
};

export default ProfileSkeleton;
