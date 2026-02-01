// client/src/components/CreatePostPrompt.jsx

import {
  PhotoIcon,
  VideoCameraIcon,
  SparklesIcon,
} from "@heroicons/react/24/outline";
import defaultAvatar from "../assets/avatar.png";
import UserAvatar from "./UserAvatar";

const CreatePostPrompt = ({ user }) => {
  return (
    <div className="bg-white dark:bg-surface border border-gray-100 dark:border-border rounded-2xl shadow-sm p-4">
      <div className="flex items-center space-x-4">
        <div className="flex-shrink-0">
          <UserAvatar user={user} size="w-12 h-12" textSize="text-xl" />
        </div>

        <div className="flex-grow bg-gray-100 dark:bg-background hover:bg-gray-200 dark:hover:bg-gray-800 cursor-pointer text-left text-gray-500 dark:text-text-secondary px-4 py-3 rounded-full transition">
          What's new, {user?.username}?
        </div>
      </div>
      <div className="flex justify-around items-center mt-4 pt-3 border-t border-gray-100 dark:border-border">
        <button className="flex items-center space-x-2 text-sm text-gray-600 dark:text-text-secondary hover:text-primary dark:hover:text-primary transition">
          <PhotoIcon className="h-6 w-6 text-green-500" />
          <span>Photo</span>
        </button>
        <button className="flex items-center space-x-2 text-sm text-gray-600 dark:text-text-secondary hover:text-primary dark:hover:text-primary transition">
          <VideoCameraIcon className="h-6 w-6 text-red-500" />
          <span>Video</span>
        </button>
        <button className="flex items-center space-x-2 text-sm text-gray-600 dark:text-text-secondary hover:text-primary dark:hover:text-primary transition">
          <SparklesIcon className="h-6 w-6 text-yellow-500" />
          <span>Feeling/Activity</span>
        </button>
      </div>
    </div>
  );
};

export default CreatePostPrompt;
