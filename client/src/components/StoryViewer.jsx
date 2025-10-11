import { useState, useEffect } from "react";
import { XMarkIcon } from "@heroicons/react/24/solid";
import { Link } from "react-router-dom";

const StoryViewer = ({ userStoryGroup, onClose }) => {
  const [currentStoryIndex, setCurrentStoryIndex] = useState(0);

  const currentStory = userStoryGroup.stories[currentStoryIndex];

  // Effect to auto-advance stories every 5 seconds
  useEffect(() => {
    if (currentStory.mediaType === "image") {
      const timer = setTimeout(() => {
        handleNext();
      }, 5000); // 5 seconds for images
      return () => clearTimeout(timer);
    }
  }, [currentStoryIndex, userStoryGroup.stories]);

  const handleNext = () => {
    if (currentStoryIndex < userStoryGroup.stories.length - 1) {
      setCurrentStoryIndex(currentStoryIndex + 1);
    } else {
      onClose(); // Close viewer after the last story
    }
  };

  const handlePrev = () => {
    if (currentStoryIndex > 0) {
      setCurrentStoryIndex(currentStoryIndex - 1);
    }
  };

  return (
    <div
      className="fixed inset-0 bg-black/90 z-50 flex justify-center items-center"
      onClick={handleNext}
    >
      {/* --- Main Content --- */}
      <div
        className="relative w-full max-w-sm h-[90vh] bg-neutral-900 rounded-lg overflow-hidden flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Progress Bars */}
        <div className="absolute top-2 left-2 right-2 flex gap-1 z-20">
          {userStoryGroup.stories.map((story, index) => (
            <div
              key={story._id}
              className="h-1 flex-1 bg-white/30 rounded-full"
            >
              <div
                className={`h-full rounded-full ${
                  index <= currentStoryIndex ? "bg-white" : ""
                }`}
                style={{
                  width: index === currentStoryIndex ? "100%" : "0%",
                  transition:
                    index === currentStoryIndex &&
                    currentStory.mediaType === "image"
                      ? "width 5s linear"
                      : "none",
                }}
              ></div>
            </div>
          ))}
        </div>

        {/* Header */}
        <div className="absolute top-5 left-4 z-20 flex items-center gap-3">
          <Link to={`/${userStoryGroup.username}`}>
            <img
              src={userStoryGroup.profilePicture}
              alt={userStoryGroup.username}
              className="w-9 h-9 rounded-full object-cover"
            />
          </Link>
          <Link
            to={`/${userStoryGroup.username}`}
            className="font-semibold text-white text-sm"
          >
            {userStoryGroup.username}
          </Link>
        </div>

        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-3 z-20 text-white"
        >
          <XMarkIcon className="h-7 w-7" />
        </button>

        {/* Media Display */}
        {currentStory.mediaType === "image" ? (
          <img
            src={currentStory.mediaUrl}
            alt="Story"
            className="w-full h-full object-contain"
          />
        ) : (
          <video
            src={currentStory.mediaUrl}
            autoPlay
            onEnded={handleNext}
            className="w-full h-full object-contain"
          />
        )}

        {/* Navigation Overlays */}
        <div className="absolute inset-0 flex">
          <div className="w-1/3 h-full" onClick={handlePrev}></div>
          <div className="w-2/3 h-full" onClick={handleNext}></div>
        </div>
      </div>
    </div>
  );
};

export default StoryViewer;
