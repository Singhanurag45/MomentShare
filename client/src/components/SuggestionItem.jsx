import { useState } from "react";
import api from "../services/api";
// 👇 Import the UserAvatar component
import UserAvatar from "./UserAvatar";

const SuggestionItem = ({ suggestedUser }) => {
  const [isFollowing, setIsFollowing] = useState(false);

  const handleFollow = async () => {
    // Optimistic update
    setIsFollowing(true);
    try {
      await api.put(`/users/${suggestedUser._id}/follow`);
    } catch (error) {
      console.error("Failed to follow user:", error);
      // Revert on error
      setIsFollowing(false);
    }
  };

  return (
    <div className="flex items-center justify-between">
      <div className="flex items-center space-x-3">
        {/* 👇 Replaced <img> with <UserAvatar /> */}
        <div className="flex-shrink-0">
          <UserAvatar
            user={suggestedUser}
            size="w-10 h-10"
            textSize="text-sm"
          />
        </div>

        <div>
          <p className="font-semibold text-sm text-gray-900 dark:text-text-primary">
            {suggestedUser.username}
          </p>
          <p className="text-xs text-gray-500 dark:text-text-secondary">
            Suggested for you
          </p>
        </div>
      </div>

      <button
        onClick={handleFollow}
        className={`text-xs font-semibold px-3 py-1.5 rounded-full transition-colors ${
          isFollowing
            ? "text-gray-500 bg-gray-100 dark:bg-gray-800 dark:text-gray-400"
            : "text-blue-500 hover:bg-blue-50 dark:hover:bg-blue-900/20"
        }`}
        disabled={isFollowing}
      >
        {isFollowing ? "Following" : "Follow"}
      </button>
    </div>
  );
};

export default SuggestionItem;
