import {
  HeartIcon,
  ChatBubbleOvalLeftIcon,
} from "@heroicons/react/24/solid";

const PostGrid = ({ posts }) => {
  if (posts.length === 0) {
    return (
      <div className="text-center py-16">
        <h2 className="text-2xl font-bold text-gray-800">
          No Posts Yet
        </h2>
        <p className="text-gray-500 mt-2">
          This user hasn’t shared any photos or videos.
        </p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-3 gap-1 sm:gap-2 md:gap-4">
      {posts.map((post) => (
        <div
          key={post._id}
          className="group relative aspect-square overflow-hidden cursor-pointer rounded-lg bg-gray-100"
        >
          <img
            src={post.mediaUrl}
            alt={post.caption || "Post"}
            className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
          />

          {/* Hover Overlay */}
          <div className="absolute inset-0 bg-black/50 flex items-center justify-center gap-6 opacity-0 group-hover:opacity-100 transition-opacity">
            <div className="flex items-center text-white font-semibold">
              <HeartIcon className="w-6 h-6 mr-1" />
              {post.likes?.length || 0}
            </div>
            <div className="flex items-center text-white font-semibold">
              <ChatBubbleOvalLeftIcon className="w-6 h-6 mr-1" />
              {post.comments?.length || 0}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default PostGrid;
