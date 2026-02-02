import { useEffect, useState, useRef } from "react";
import {
  PlusIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
} from "@heroicons/react/24/solid";
import { useAuth } from "../context/AuthContext";
import api from "../services/api";
import UserAvatar from "./UserAvatar";

// 👇 Added 'refreshTrigger' prop here
const Stories = ({ onAddStoryClick, onViewStoryClick, refreshTrigger }) => {
  const { user: currentUser } = useAuth();
  const [storyGroups, setStoryGroups] = useState([]);
  const scrollRef = useRef(null);

  // Logic to separate "My Story" from "Friends' Stories"
  const myStoryGroup = storyGroups.find((g) => g.userId === currentUser._id);
  const otherStories = storyGroups.filter((g) => g.userId !== currentUser._id);

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

    // 👇 Added 'refreshTrigger' to dependencies so it runs again when this changes
  }, [currentUser, refreshTrigger]);

  const scroll = (direction) => {
    if (scrollRef.current) {
      scrollRef.current.scrollBy({
        left: direction === "left" ? -300 : 300,
        behavior: "smooth",
      });
    }
  };

  return (
    <div className="bg-white dark:bg-surface border border-gray-100 dark:border-border rounded-2xl shadow-sm p-5 relative group mb-6">
      <h3 className="text-gray-500 dark:text-text-secondary font-semibold text-sm mb-4 px-1">
        Stories
      </h3>

      <div className="relative flex items-center">
        {/* Left Scroll Button */}
        <button
          onClick={() => scroll("left")}
          className="absolute -left-3 z-10 bg-white/90 dark:bg-surface/90 backdrop-blur-sm p-1.5 rounded-full shadow-md border border-gray-100 dark:border-gray-700 opacity-0 group-hover:opacity-100 transition-all duration-300 hover:scale-110 text-gray-700 dark:text-gray-300"
        >
          <ChevronLeftIcon className="h-5 w-5" />
        </button>

        <div
          ref={scrollRef}
          className="flex space-x-5 overflow-x-auto scrollbar-hide scroll-smooth py-1 px-1"
        >
          {/* YOUR STORY BUBBLE */}
          <div className="flex-shrink-0 flex flex-col items-center space-y-2 cursor-pointer group/story">
            <div className="relative">
              {/* Click Logic: If story exists -> View. If not -> Add. */}
              <div
                onClick={() =>
                  myStoryGroup
                    ? onViewStoryClick(myStoryGroup)
                    : onAddStoryClick()
                }
                className={`p-1 rounded-full border-2 transition-colors duration-300 
                   ${
                     myStoryGroup
                       ? "border-purple-500 bg-gradient-to-tr from-yellow-400 to-fuchsia-600 p-[3px]" // Active Story
                       : "border-dashed border-gray-300 dark:border-gray-600 hover:border-primary" // No Story
                   }`}
              >
                <div className="bg-white dark:bg-surface p-[2px] rounded-full">
                  <UserAvatar
                    user={currentUser}
                    size="w-16 h-16"
                    textSize="text-2xl"
                    className="border-2 border-white dark:border-surface"
                  />
                </div>
              </div>

              {/* Plus Icon - Always opens Add Modal */}
              <div
                onClick={(e) => {
                  e.stopPropagation();
                  onAddStoryClick();
                }}
                className="absolute bottom-0 right-0 bg-blue-500 text-white rounded-full p-1 border-[3px] border-white dark:border-surface shadow-sm hover:scale-110 transition-transform cursor-pointer"
              >
                <PlusIcon className="h-3.5 w-3.5 stroke-2" />
              </div>
            </div>

            <p className="text-xs font-medium w-20 truncate text-center text-gray-700 dark:text-gray-300">
              Your Story
            </p>
          </div>

          {/* OTHER STORIES */}
          {otherStories.map((group) => (
            <div
              key={group.userId}
              onClick={() => onViewStoryClick(group)}
              className="flex-shrink-0 flex flex-col items-center space-y-2 cursor-pointer group/story"
            >
              <div className="p-[3px] rounded-full bg-gradient-to-tr from-yellow-400 via-orange-500 to-fuchsia-600 group-hover/story:scale-105 transition-transform duration-300">
                <div className="bg-white dark:bg-surface p-[2px] rounded-full">
                  <UserAvatar
                    user={group}
                    size="w-16 h-16"
                    textSize="text-2xl"
                  />
                </div>
              </div>
              <p className="text-xs font-medium w-20 truncate text-center text-gray-700 dark:text-gray-300 group-hover/story:text-primary transition-colors">
                {group.username}
              </p>
            </div>
          ))}
        </div>

        {/* Right Scroll Button */}
        <button
          onClick={() => scroll("right")}
          className="absolute -right-3 z-10 bg-white/90 dark:bg-surface/90 backdrop-blur-sm p-1.5 rounded-full shadow-md border border-gray-100 dark:border-gray-700 opacity-0 group-hover:opacity-100 transition-all duration-300 hover:scale-110 text-gray-700 dark:text-gray-300"
        >
          <ChevronRightIcon className="h-5 w-5" />
        </button>
      </div>
    </div>
  );
};

export default Stories;
