import { useEffect, useState, useRef } from "react";
import {
  PlusIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
} from "@heroicons/react/24/solid";
import { useAuth } from "../context/AuthContext";
import api from "../services/api";
import UserAvatar from "./UserAvatar";

const StoryAvatar = ({ user, size = "w-16 h-16" }) => {
  const [imgError, setImgError] = useState(false);

  const hasValidImage =
    user?.profilePicture && // Checks for null/undefined/empty string
    !imgError;

  // Get the first letter of the username safely
  const initial = user?.username ? user.username.charAt(0).toUpperCase() : "?";

  // Modern gradient for the fallback avatar
  const gradientClass = "bg-gradient-to-br from-violet-500 to-fuchsia-500";

  if (hasValidImage) {
    return (
      <img
        className={`${size} rounded-full object-cover border-2 border-white dark:border-surface`}
        src={user.profilePicture}
        alt={user.username}
        onError={() => setImgError(true)} // If image link breaks, fallback to initials
      />
    );
  }

  // Fallback: Render the Colored Initial
  return (
    <div
      className={`${size} ${gradientClass} rounded-full flex items-center justify-center text-white font-bold text-xl shadow-inner border-2 border-white dark:border-surface`}
    >
      {initial}
    </div>
  );
};

const Stories = ({ onAddStoryClick, onViewStoryClick }) => {
  const { user: currentUser } = useAuth();
  const [storyGroups, setStoryGroups] = useState([]);
  const scrollRef = useRef(null);

  useEffect(() => {
    const fetchStories = async () => {
      try {
        const { data } = await api.get("/stories");
        setStoryGroups(data);
      } catch (error) {
        console.error("Failed to fetch stories:", error);
      }
    };
    fetchStories();
  }, []);

  const scroll = (direction) => {
    scrollRef.current.scrollBy({
      left: direction === "left" ? -300 : 300,
      behavior: "smooth",
    });
  };

  return (
    <div className="bg-white dark:bg-surface border border-gray-100 dark:border-border rounded-xl shadow-sm p-4 relative group">
      <div className="relative flex items-center">
        {/* Left Scroll Button */}
        <button
          onClick={() => scroll("left")}
          className="absolute -left-4 z-10 bg-white/80 dark:bg-surface/80 rounded-full p-1 shadow-md opacity-0 group-hover:opacity-100 transition-opacity"
        >
          <ChevronLeftIcon className="h-5 w-5" />
        </button>

        <div
          ref={scrollRef}
          className="flex space-x-4 overflow-x-auto scrollbar-hide scroll-smooth"
        >
          {/* Create Story (Current User) */}
          <div
            onClick={onAddStoryClick}
            className="flex-shrink-0 flex flex-col items-center space-y-2 cursor-pointer group"
          >
            <div className="relative bg-gradient-to-tr from-primary to-secondary p-0.5 rounded-full group-hover:scale-105 transition-transform">
              <UserAvatar
                user={currentUser}
                size="w-16 h-16"
                textSize="text-xl"
                className="border-2 border-white dark:border-surface"
              />
              <div className="absolute bottom-0 right-0 bg-primary rounded-full p-1 border-2 border-white dark:border-surface">
                <PlusIcon className="h-4 w-4 text-white" />
              </div>
            </div>
            <p className="text-xs w-20 truncate text-center text-gray-600 dark:text-text-secondary">
              Your Story
            </p>
          </div>

          {/* User Stories List */}
          {storyGroups.map((group) => (
            <div
              key={group.userId}
              onClick={() => onViewStoryClick(group)}
              className="flex-shrink-0 flex flex-col items-center space-y-2 cursor-pointer group"
            >
              <div className="bg-gradient-to-tr from-primary to-secondary p-0.5 rounded-full group-hover:scale-105 transition-transform">
                <div className="bg-white dark:bg-background p-0.5 rounded-full">
                  {/* User Avatar Component */}
                  <StoryAvatar user={group} />
                </div>
              </div>
              <p className="text-xs w-20 truncate text-center text-gray-600 dark:text-text-secondary">
                {group.username}
              </p>
            </div>
          ))}
        </div>

        {/* Right Scroll Button */}
        <button
          onClick={() => scroll("right")}
          className="absolute -right-4 z-10 bg-white/80 dark:bg-surface/80 rounded-full p-1 shadow-md opacity-0 group-hover:opacity-100 transition-opacity"
        >
          <ChevronRightIcon className="h-5 w-5" />
        </button>
      </div>
    </div>
  );
};

export default Stories;
