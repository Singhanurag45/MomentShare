import { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext";
import api from "../services/api";

import PostCard from "../components/PostCard";
import CreatePostPrompt from "../components/CreatePostPrompt";
import EmptyFeed from "../components/EmptyFeed";
import Stories from "../components/Stories";

import CreatePostModal from "../components/CreatePostModal";
import CreateStoryModal from "../components/CreateStoryModal";
// 👇 Import the new Viewer
import StoryViewerModal from "../components/StoryViewerModal";

import Sidebar from "../components/Sidebar";
import Footer from "../components/Footer";
import FeedSkeleton from "../components/FeedSkeleton";

const HomePage = () => {
  const { user } = useAuth();
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [isPostModalOpen, setIsPostModalOpen] = useState(false);
  const [isStoryModalOpen, setIsStoryModalOpen] = useState(false);
  const [storyRefetchTrigger, setStoryRefetchTrigger] = useState(0);

  // 👇 New State to track which story group is open
  const [viewingStoryGroup, setViewingStoryGroup] = useState(null);

  const fetchFeed = async () => {
    try {
      const { data } = await api.get("/posts/feed");
      setPosts(data);
      setError(null);
    } catch (err) {
      setError("Could not load your feed.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    document.title = "Home • MomentShare";
    fetchFeed();
  }, []);

  const renderContent = () => {
    if (loading) return <FeedSkeleton />;
    if (error)
      return (
        <p className="text-center text-red-500 font-medium mt-10">{error}</p>
      );
    if (posts.length === 0) return <EmptyFeed />;

    // ✅ FIX ISSUE 1: Force unique keys by combining ID + Index
    return posts.map((post, index) => (
      <PostCard key={`${post._id}-${index}`} post={post} />
    ));
  };

  return (
    <>
      {/* Create Post Modal */}
      {isPostModalOpen && (
        <CreatePostModal
          user={user}
          onClose={() => setIsPostModalOpen(false)}
          onPostCreated={() => {
            setIsPostModalOpen(false);
            fetchFeed();
          }}
        />
      )}

      {/* Create Story Modal */}
      {isStoryModalOpen && (
        <CreateStoryModal
          onClose={() => setIsStoryModalOpen(false)}
          onStoryPosted={() => setStoryRefetchTrigger((prev) => prev + 1)}
        />
      )}

      {/* ✅ FIX ISSUE 2: Render Story Viewer Modal */}
      {viewingStoryGroup && (
        <StoryViewerModal
          storyGroup={viewingStoryGroup}
          onClose={() => setViewingStoryGroup(null)}
        />
      )}

      {/* Page Layout */}
      <div className="min-h-screen bg-gray-100 dark:bg-background">
        <div className="max-w-6xl mx-auto px-4 py-6">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Feed Section */}
            <div className="lg:col-span-2 space-y-6">

              <div className="bg-white dark:bg-card rounded-xl shadow-sm">
                <CreatePostPrompt
                  user={user}
                  onStoryClick={() => setIsStoryModalOpen(true)}
                  onPostClick={() => setIsPostModalOpen(true)}
                />
              </div>

              <div className="space-y-6">{renderContent()}</div>
            </div>

            {/* Sidebar */}
            <div className="hidden lg:block sticky top-24 h-fit">
              <Sidebar user={user} />
              <Footer />
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default HomePage;
