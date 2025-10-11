import { useEffect, useState, useRef } from "react";
import {
  PlusIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
} from "@heroicons/react/24/solid";
import { useAuth } from "../context/AuthContext";
import api from "../services/api";

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
        <button
          onClick={() => scroll("left")}
          className="absolute -left-4 z-10 bg-white/80 dark:bg-surface/80 rounded-full p-1 shadow-md opacity-0 group-hover:opacity-100"
        >
          <ChevronLeftIcon className="h-5 w-5" />
        </button>
        <div
          ref={scrollRef}
          className="flex space-x-4 overflow-x-auto scrollbar-hide"
        >
          {/* Add Story Button */}
          <div
            onClick={onAddStoryClick}
            className="flex-shrink-0 flex flex-col items-center space-y-2 cursor-pointer group"
          >
            <div className="relative bg-gradient-to-tr from-primary to-secondary p-0.5 rounded-full group-hover:scale-105 transition-transform">
              <div className="bg-white dark:bg-background p-0.5 rounded-full">
                <img
                  className="h-16 w-16 rounded-full object-cover"
                  src={currentUser.profilePicture}
                  alt="Your Story"
                />
              </div>
              <div className="absolute bottom-0 right-0 bg-primary rounded-full p-1 border-2 border-white dark:border-surface">
                <PlusIcon className="h-4 w-4 text-white" />
              </div>
            </div>
            <p className="text-xs w-20 truncate text-center text-gray-600 dark:text-text-secondary">
              Your Story
            </p>
          </div>

          {/* User Stories */}
          {storyGroups.map((group) => (
            <div
              key={group.userId}
              onClick={() => onViewStoryClick(group)}
              className="flex-shrink-0 flex flex-col items-center space-y-2 cursor-pointer group"
            >
              <div className="bg-gradient-to-tr from-primary to-secondary p-0.5 rounded-full group-hover:scale-105 transition-transform">
                <div className="bg-white dark:bg-background p-0.5 rounded-full">
                  <img
                    className="h-16 w-16 rounded-full object-cover"
                    src={group.profilePicture}
                    alt={group.username}
                  />
                </div>
              </div>
              <p className="text-xs w-20 truncate text-center text-gray-600 dark:text-text-secondary">
                {group.username}
              </p>
            </div>
          ))}
        </div>
        <button
          onClick={() => scroll("right")}
          className="absolute -right-4 z-10 bg-white/80 dark:bg-surface/80 rounded-full p-1 shadow-md opacity-0 group-hover:opacity-100"
        >
          <ChevronRightIcon className="h-5 w-5" />
        </button>
      </div>
    </div>
  );
};

export default Stories;
