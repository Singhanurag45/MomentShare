import { HeartIcon, ChatBubbleOvalLeftIcon } from "@heroicons/react/24/solid";

const PostGrid = ({ posts }) => {
  if (posts.length === 0) {
    return (
      <div className="text-center py-10">
        <h2 className="text-2xl font-bold">No Posts Yet</h2>
        <p className="text-gray-500">
          This user hasn't shared any photos or videos.
        </p>
      </div>
    );
  }
  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 gap-1 md:gap-4">
      {posts.map((post) => (
        <div
          key={post._id}
          className="group relative aspect-square cursor-pointer"
        >
          <img
            src={post.mediaUrl}
            alt={post.caption}
            className="w-full h-full object-cover"
          />
          {/* Overlay shown on hover */}
          <div className="absolute inset-0 bg-black bg-opacity-40 flex items-center justify-center space-x-4 opacity-0 group-hover:opacity-100 transition-opacity">
            <div className="flex items-center text-white">
              <HeartIcon className="w-6 h-6 mr-1" />
              <span className="font-bold">{post.likes?.length || 0}</span>
            </div>
            <div className="flex items-center text-white">
              <ChatBubbleOvalLeftIcon className="w-6 h-6 mr-1" />
              <span className="font-bold">{post.comments?.length || 0}</span>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default PostGrid;
