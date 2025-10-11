// client/src/components/SuggestionItem.jsx
import { useState } from "react";
import api from "../services/api";

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
        <img
          src={suggestedUser.profilePicture}
          alt={suggestedUser.username}
          className="w-10 h-10 rounded-full object-cover"
        />
        <div>
          <p className="font-semibold text-sm">{suggestedUser.username}</p>
          <p className="text-xs text-gray-500">Suggested for you</p>
        </div>
      </div>
      <button
        onClick={handleFollow}
        className={`text-sm font-semibold ${
          isFollowing ? "text-gray-500" : "text-blue-500 hover:text-blue-700"
        }`}
        disabled={isFollowing}
      >
        {isFollowing ? "Following" : "Follow"}
      </button>
    </div>
  );
};

export default SuggestionItem;
