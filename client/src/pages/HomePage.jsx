import { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext";
import api from "../services/api";

import Stories from "../components/Stories";
import PostCard from "../components/PostCard";
import CreatePostPrompt from "../components/CreatePostPrompt";
import FeedSkeleton from "../components/FeedSkeleton";
import EmptyFeed from "../components/EmptyFeed";

import CreatePostModal from "../components/CreatePostModal";
import CreateStoryModal from "../components/CreateStoryModal";
import StoryViewer from "../components/StoryViewer";
import Sidebar from "../components/Sidebar";
import Footer from "../components/Footer";

const HomePage = () => {
  const { user } = useAuth();

  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [isPostModalOpen, setIsPostModalOpen] = useState(false);
  const [isStoryModalOpen, setIsStoryModalOpen] = useState(false);
  const [viewingStories, setViewingStories] = useState(null);
  const [storyRefetchTrigger, setStoryRefetchTrigger] = useState(0);

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
        <p className="text-center text-red-500 font-medium mt-10">
          {error}
        </p>
      );
    if (posts.length === 0) return <EmptyFeed />;
    return posts.map((post) => (
      <PostCard key={post._id} post={post} />
    ));
  };

  return (
    <>
      {/* Modals */}
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

      {isStoryModalOpen && (
        <CreateStoryModal
          onClose={() => setIsStoryModalOpen(false)}
          onStoryPosted={() =>
            setStoryRefetchTrigger((prev) => prev + 1)
          }
        />
      )}

      {viewingStories && (
        <StoryViewer
          userStoryGroup={viewingStories}
          onClose={() => setViewingStories(null)}
        />
      )}

      {/* Page Layout */}
      <div className="min-h-screen bg-gray-100 dark:bg-background">
        <div className="max-w-6xl mx-auto px-4 py-6">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            
            {/* Feed Section */}
            <div className="lg:col-span-2 space-y-6">
              <div className="bg-white dark:bg-card rounded-xl shadow-sm p-4">
                <Stories
                  key={storyRefetchTrigger}
                  onAddStoryClick={() => setIsStoryModalOpen(true)}
                  onViewStoryClick={setViewingStories}
                />
              </div>

              <div
                onClick={() => setIsPostModalOpen(true)}
                className="cursor-pointer bg-white dark:bg-card rounded-xl shadow-sm"
              >
                <CreatePostPrompt user={user} />
              </div>

              <div className="space-y-6">{renderContent()}</div>
            </div>

            {/* Sidebar */}
            <div className="hidden lg:block sticky top-24 h-fit">
              <Sidebar user={user} />
            </div>

          </div>
        </div>

        <Footer />
      </div>
    </>
  );
};

export default HomePage;
