const ProfileSkeleton = () => {
  return (
    <div className="min-h-screen bg-gray-100">
      <div className="max-w-5xl mx-auto px-4 py-6 animate-pulse">
        <div className="bg-white rounded-xl p-6 shadow-sm">
          
          {/* Header */}
          <div className="flex flex-col sm:flex-row items-center gap-6">
            <div className="w-28 h-28 md:w-36 md:h-36 rounded-full bg-gray-300" />

            <div className="flex-1 w-full space-y-4">
              <div className="h-6 w-40 bg-gray-300 rounded" />

              <div className="flex gap-6">
                <div className="h-4 w-20 bg-gray-300 rounded" />
                <div className="h-4 w-24 bg-gray-300 rounded" />
                <div className="h-4 w-24 bg-gray-300 rounded" />
              </div>

              <div className="h-4 w-32 bg-gray-300 rounded" />
              <div className="h-4 w-64 bg-gray-300 rounded" />
            </div>
          </div>

          <hr className="my-6" />

          {/* Grid Skeleton */}
          <div className="grid grid-cols-3 gap-2 md:gap-4">
            {Array.from({ length: 9 }).map((_, i) => (
              <div
                key={i}
                className="aspect-square bg-gray-300 rounded-lg"
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfileSkeleton;
