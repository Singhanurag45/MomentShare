import {
  PhotoIcon,
  VideoCameraIcon,
  FaceSmileIcon,
  PlusCircleIcon, // Icon for Story
} from "@heroicons/react/24/solid";
import UserAvatar from "./UserAvatar";

const CreatePostPrompt = ({ user, onStoryClick, onPostClick }) => {
  return (
    <div className="bg-white dark:bg-surface border border-gray-100 dark:border-border rounded-3xl shadow-sm hover:shadow-md transition-shadow duration-300 p-4 mb-6">
      {/* Top Input Area (Triggers Post Modal) */}
      <div className="flex items-center gap-4 mb-4">
        <div className="flex-shrink-0">
          <UserAvatar
            user={user}
            size="w-12 h-12"
            textSize="text-xl"
            className="ring-2 ring-white dark:ring-surface shadow-sm"
          />
        </div>

        <div className="flex-grow">
          <button
            onClick={onPostClick} // Clicking text opens Post Modal
            className="w-full text-left bg-gray-50 dark:bg-background hover:bg-gray-100 dark:hover:bg-gray-800 border border-transparent hover:border-gray-200 dark:hover:border-gray-700 text-gray-500 dark:text-text-secondary px-5 py-3.5 rounded-2xl transition-all duration-200 ease-in-out group"
          >
            <span className="group-hover:text-gray-700 dark:group-hover:text-gray-300 font-medium transition-colors">
              What's on your mind, {user?.username}?
            </span>
          </button>
        </div>
      </div>

      <div className="h-px bg-gray-100 dark:bg-border mx-2" />

      {/* Bottom Action Buttons */}
      <div className="grid grid-cols-4 gap-1 mt-3">
        {/* 👇 1. STORY BUTTON (Triggers Story Modal) */}
        <button
          onClick={onStoryClick}
          className="flex items-center justify-center gap-1.5 py-2.5 rounded-xl text-gray-600 dark:text-text-secondary hover:bg-purple-50 dark:hover:bg-purple-900/20 transition-colors group"
        >
          <PlusCircleIcon className="h-6 w-6 text-purple-500 group-hover:scale-110 transition-transform duration-200" />
          <span className="text-sm font-semibold group-hover:text-purple-600 dark:group-hover:text-purple-400">
            Story
          </span>
        </button>

        {/* 2. Photo Button (Triggers Post Modal) */}
        <button
          onClick={onPostClick}
          className="flex items-center justify-center gap-1.5 py-2.5 rounded-xl text-gray-600 dark:text-text-secondary hover:bg-green-50 dark:hover:bg-green-900/20 transition-colors group"
        >
          <PhotoIcon className="h-6 w-6 text-green-500 group-hover:scale-110 transition-transform duration-200" />
          <span className="text-sm font-semibold group-hover:text-green-600 dark:group-hover:text-green-400">
            Photo
          </span>
        </button>

        {/* 3. Video Button */}
        <button
          onClick={onPostClick}
          className="flex items-center justify-center gap-1.5 py-2.5 rounded-xl text-gray-600 dark:text-text-secondary hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors group"
        >
          <VideoCameraIcon className="h-6 w-6 text-red-500 group-hover:scale-110 transition-transform duration-200" />
          <span className="text-sm font-semibold group-hover:text-red-600 dark:group-hover:text-red-400">
            Video
          </span>
        </button>

        {/* 4. Feeling Button */}
        <button
          onClick={onPostClick}
          className="flex items-center justify-center gap-1.5 py-2.5 rounded-xl text-gray-600 dark:text-text-secondary hover:bg-yellow-50 dark:hover:bg-yellow-900/20 transition-colors group"
        >
          <FaceSmileIcon className="h-6 w-6 text-yellow-500 group-hover:scale-110 transition-transform duration-200" />
          <span className="text-sm font-semibold group-hover:text-yellow-600 dark:group-hover:text-yellow-400">
            Feeling
          </span>
        </button>
      </div>
    </div>
  );
};

export default CreatePostPrompt;
