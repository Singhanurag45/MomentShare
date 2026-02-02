import { useState, useEffect } from "react";
import {
  XMarkIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
} from "@heroicons/react/24/solid";
import UserAvatar from "./UserAvatar";

const StoryViewerModal = ({ storyGroup, onClose }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const stories = storyGroup.stories || [];
  const currentStory = stories[currentIndex];

  // Auto-advance stories every 5 seconds (optional)
  useEffect(() => {
    const timer = setTimeout(() => {
      handleNext();
    }, 5000);
    return () => clearTimeout(timer);
  }, [currentIndex]);

  const handleNext = () => {
    if (currentIndex < stories.length - 1) {
      setCurrentIndex((prev) => prev + 1);
    } else {
      onClose(); // Close if it was the last story
    }
  };

  const handlePrev = () => {
    if (currentIndex > 0) {
      setCurrentIndex((prev) => prev - 1);
    }
  };

  if (!currentStory) return null;

  return (
    <div className="fixed inset-0 bg-black z-[60] flex items-center justify-center">
      {/* Close Button */}
      <button
        onClick={onClose}
        className="absolute top-4 right-4 z-50 text-white p-2 rounded-full hover:bg-white/20"
      >
        <XMarkIcon className="h-8 w-8" />
      </button>

      {/* Main Content Container */}
      <div className="relative w-full h-full md:w-[400px] md:h-[85vh] bg-gray-900 md:rounded-xl overflow-hidden shadow-2xl flex flex-col">
        {/* Progress Bars */}
        <div className="absolute top-2 left-0 w-full px-2 flex gap-1 z-20">
          {stories.map((_, idx) => (
            <div
              key={idx}
              className="h-1 flex-1 bg-white/30 rounded-full overflow-hidden"
            >
              <div
                className={`h-full bg-white transition-all duration-300 ${
                  idx < currentIndex
                    ? "w-full"
                    : idx === currentIndex
                      ? "w-full animate-progress"
                      : "w-0"
                }`}
              />
            </div>
          ))}
        </div>

        {/* User Header */}
        <div className="absolute top-6 left-0 w-full p-4 flex items-center gap-3 z-20 bg-gradient-to-b from-black/60 to-transparent">
          <UserAvatar user={storyGroup} size="w-10 h-10" textSize="text-sm" />
          <span className="text-white font-semibold text-sm drop-shadow-md">
            {storyGroup.username}
          </span>
        </div>

        {/* Navigation Touch Areas */}
        <div className="absolute inset-0 flex z-10">
          <div className="w-1/3 h-full" onClick={handlePrev} />
          <div className="w-2/3 h-full" onClick={handleNext} />
        </div>

        {/* Media Display */}
        <div className="flex-1 flex items-center justify-center bg-black">
          {currentStory.mediaType === "video" ? (
            <video
              src={currentStory.mediaUrl}
              className="w-full h-full object-contain"
              autoPlay
              controls={false}
            />
          ) : (
            <img
              src={currentStory.mediaUrl}
              className="w-full h-full object-contain"
              alt="Story"
            />
          )}
        </div>
      </div>
    </div>
  );
};

export default StoryViewerModal;
