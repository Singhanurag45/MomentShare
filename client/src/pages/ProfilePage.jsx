import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import api from "../services/api";
import PostGrid from "./PostGrid";
import FeedSkeleton from "../components/FeedSkeleton";
import { useAuth } from "../context/AuthContext";
import EditProfileModal from "../components/EditProfileModal";
import UserAvatar from "../components/UserAvatar";


const ProfilePage = () => {
  const { username } = useParams();
  const { user: loggedInUser } = useAuth();

  const [profile, setProfile] = useState(null);
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showEditProfile, setShowEditProfile] = useState(false);

  const isOwnProfile = loggedInUser?.username === username;

  const fetchProfile = async () => {
    try {
      setLoading(true);
      const { data } = await api.get(`/users/${username}`);
      setProfile(data.user);
      setPosts(data.posts || []);
      setError(null);
    } catch (err) {
      console.error("Profile fetch failed:", err);
      setError("User not found");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProfile();
  }, [username]);

  if (loading) {
    return (
      <div className="max-w-4xl mx-auto pt-24 px-4">
        <FeedSkeleton />
      </div>
    );
  }

  if (error) {
    return (
      <p className="text-center text-red-500 font-medium mt-32">{error}</p>
    );
  }

  if (!profile) return null;

  return (
    <div className="max-w-4xl mx-auto pt-24 px-4">
      {/* Profile Header */}
      <div className="flex flex-col sm:flex-row gap-8 items-center sm:items-start mb-10">
        
        <div className="flex-shrink-0">
           <UserAvatar 
             user={profile} 
             size="w-32 h-32" 
             textSize="text-6xl"
             className="border-4 border-white shadow-md"
           />
        </div>

        {/* Info */}
        <div className="flex-1 text-center sm:text-left">
          <div className="flex flex-col sm:flex-row items-center gap-4">
            <h2 className="text-2xl font-semibold">{profile.username}</h2>

            {isOwnProfile && (
              <button
                onClick={() => setShowEditProfile(true)}
                className="px-4 py-1.5 border rounded-md text-sm font-medium hover:bg-gray-100 transition"
              >
                Edit Profile
              </button>
            )}
          </div>

          {/* Stats */}
          <div className="flex justify-center sm:justify-start gap-6 mt-4">
            <div>
              <span className="font-semibold">{posts.length}</span> posts
            </div>
            <div>
              <span className="font-semibold">
                {profile.followers?.length || 0}
              </span>{" "}
              followers
            </div>
            <div>
              <span className="font-semibold">
                {profile.following?.length || 0}
              </span>{" "}
              following
            </div>
          </div>

          {/* Bio */}
          {profile.bio && (
            <p className="mt-4 text-sm text-gray-700 whitespace-pre-line">
              {profile.bio}
            </p>
          )}
        </div>
      </div>

      <div className="border-t mb-6" />

      <PostGrid posts={posts} />

      {/* Edit Profile Modal */}
      {showEditProfile && (
        <EditProfileModal
          user={profile}
          onClose={() => setShowEditProfile(false)}
          onProfileUpdate={fetchProfile}
        />
      )}
    </div>
  );
};

export default ProfilePage;
