import { useNavigate } from "react-router-dom";
import { HeartIcon, ChatBubbleOvalLeftIcon } from "@heroicons/react/24/solid";

const PostGrid = ({ posts }) => {
  const navigate = useNavigate();

  if (posts.length === 0) {
    return (
      <div className="text-center py-20 bg-gray-50 rounded-3xl border-2 border-dashed border-gray-200">
        <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gray-100 mb-4">
          <svg
            className="w-8 h-8 text-gray-400"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
            />
          </svg>
        </div>
        <h2 className="text-xl font-bold text-gray-800 tracking-tight">
          No Moments Shared
        </h2>
        <p className="text-gray-400 text-sm mt-1">
          This user's gallery is currently empty.
        </p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-3 gap-2 md:gap-4">
      {posts.map((post) => (
        <div
          key={post._id}
          onClick={() => navigate(`/posts/${post._id}`)}
          className="group relative aspect-square overflow-hidden cursor-pointer rounded-xl bg-gray-200 shadow-sm"
        >
          {/* Image with subtle zoom on hover */}
          <img
            src={post.mediaUrl}
            alt={post.caption || "Post"}
            className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-110"
          />

          {/* Glassmorphism Hover Overlay */}
          <div className="absolute inset-0 bg-black/30 backdrop-blur-[2px] flex items-center justify-center gap-6 opacity-0 group-hover:opacity-100 transition-all duration-300">
            <div className="flex flex-col items-center transform translate-y-4 group-hover:translate-y-0 transition-transform duration-300 delay-75">
              <div className="flex items-center text-white font-bold drop-shadow-md">
                <HeartIcon className="w-6 h-6 mr-1.5 text-white" />
                <span className="text-lg">{post.likes?.length || 0}</span>
              </div>
              <span className="text-[10px] text-white/80 font-bold uppercase tracking-widest mt-1">
                Likes
              </span>
            </div>

            <div className="flex flex-col items-center transform translate-y-4 group-hover:translate-y-0 transition-transform duration-300 delay-100">
              <div className="flex items-center text-white font-bold drop-shadow-md">
                <ChatBubbleOvalLeftIcon className="w-6 h-6 mr-1.5 text-white" />
                <span className="text-lg">{post.comments?.length || 0}</span>
              </div>
              <span className="text-[10px] text-white/80 font-bold uppercase tracking-widest mt-1">
                Comments
              </span>
            </div>
          </div>

          {/* Subtle bottom gradient for depth when not hovered */}
          <div className="absolute inset-x-0 bottom-0 h-1/4 bg-gradient-to-t from-black/20 to-transparent opacity-60 group-hover:opacity-0 transition-opacity" />
        </div>
      ))}
    </div>
  );
};

export default PostGrid;
