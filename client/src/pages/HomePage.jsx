import { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext";
import api from "../services/api";

// Import all necessary components
import Stories from "../components/Stories.jsx";
import PostCard from "../components/PostCard";
import Suggestions from "../components/Suggestions";
import CreatePostPrompt from "../components/CreatePostPrompt.jsx";

import FeedSkeleton from "../components/FeedSkeleton.jsx";
import EmptyFeed from "../components/EmptyFeed.jsx";
import ExploreTags from "../components/ExploreTags.jsx";
import CreatePostModal from "../components/CreatePostModal";

import CreateStoryModal from "../components/CreateStoryModal";
import StoryViewer from "../components/StoryViewer";
import Footer from "../components/Footer"; 
import Sidebar from "../components/Sidebar";

const HomePage = () => {
  const { user } = useAuth();

  // State for posts and feed loading
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // State for modals
  const [isPostModalOpen, setIsPostModalOpen] = useState(false);
  const [isStoryModalOpen, setIsStoryModalOpen] = useState(false);
  const [viewingStories, setViewingStories] = useState(null); // For story viewer

  // State to trigger a refetch of stories
  const [storyRefetchTrigger, setStoryRefetchTrigger] = useState(0);

  // --- Data Fetching ---
  const fetchFeed = async () => {
    try {
      const { data } = await api.get("/posts/feed");
      setPosts(data);
      setError(null);
    } catch (err) {
      console.error("Failed to fetch feed:", err);
      setError("Could not load your feed. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    document.title = "Home • MomentShare";
    fetchFeed();
  }, []);

  // --- Event Handlers ---
  const handlePostCreated = () => {
    setIsPostModalOpen(false);
    fetchFeed();
  };

  const handleStoryPosted = () => {
    setStoryRefetchTrigger((prev) => prev + 1); // Trigger Stories component to refetch
  };

  const handleViewStories = (storyGroup) => {
    setViewingStories(storyGroup); // Set the story group to be viewed
  };

  const handleCloseViewer = () => {
    setViewingStories(null); // Close the viewer
  };

  // --- Content Rendering ---
  const renderContent = () => {
    if (loading) return <FeedSkeleton />;
    if (error)
      return (
        <p className="text-center text-red-500 mt-10 font-medium">{error}</p>
      );
    if (posts.length === 0) return <EmptyFeed />;
    return posts.map((post) => <PostCard key={post._id} post={post} />);
  };

  return (
    <>
      {/* --- Modals --- */}
      {isPostModalOpen && (
        <CreatePostModal
          user={user}
          onClose={() => setIsPostModalOpen(false)}
          onPostCreated={handlePostCreated}
        />
      )}
      {isStoryModalOpen && (
        <CreateStoryModal
          onClose={() => setIsStoryModalOpen(false)}
          onStoryPosted={handleStoryPosted}
        />
      )}
      {/* ✨ This now renders the story viewer when a story is selected */}
      {viewingStories && (
        <StoryViewer
          userStoryGroup={viewingStories}
          onClose={handleCloseViewer}
        />
      )}

      {/* --- Main Page Layout --- */}
      <div className="bg-gray-50 dark:bg-background min-h-screen">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-7xl mx-auto px-4 py-6">
          {/* Main Feed */}
          <div className="md:col-span-2 space-y-6">
            <Stories
              key={storyRefetchTrigger}
              onAddStoryClick={() => setIsStoryModalOpen(true)}
              // ✨ This now correctly opens the viewer instead of an alert
              onViewStoryClick={handleViewStories}
            />
            <div
              onClick={() => setIsPostModalOpen(true)}
              className="cursor-pointer"
            >
              <CreatePostPrompt user={user} />
            </div>
            <div className="space-y-6">{renderContent()}</div>
          </div>

          {/* Sidebar */}
          <Sidebar user={user} />
          
        </div>
      </div>
    </>
  );
};

export default HomePage;
