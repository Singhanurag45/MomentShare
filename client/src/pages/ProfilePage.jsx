import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import api from "../services/api";
import PostGrid from "./PostGrid";
import FeedSkeleton from "../components/FeedSkeleton";
import { useAuth } from "../context/AuthContext";
import EditProfileModal from "../components/EditProfileModal";
import UserAvatar from "../components/UserAvatar";
import FollowListModal from "../components/FollowListModal"; // 👈 Import the modal

const ProfilePage = () => {
  const { username } = useParams();
  const { user: loggedInUser } = useAuth();

  const [profile, setProfile] = useState(null);
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showEditProfile, setShowEditProfile] = useState(false);
  const [isFollowing, setIsFollowing] = useState(false);

  // 👇 New State for Follow Modal
  const [followModal, setFollowModal] = useState({
    isOpen: false,
    title: "",
    users: [],
  });

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

  // Determine if the logged-in user already follows this profile
  useEffect(() => {
    if (!profile || !loggedInUser) return;
    const followerIds = profile.followers || [];
    const isUserFollowing = followerIds.includes(loggedInUser._id);
    setIsFollowing(isUserFollowing);
  }, [profile, loggedInUser]);

  const handleFollowToggle = async () => {
    if (!profile?._id || !loggedInUser) return;

    try {
      if (isFollowing) {
        await api.put(`/users/${profile._id}/unfollow`);
        setProfile((prev) => ({
          ...prev,
          followers: (prev.followers || []).filter(
            (id) => id !== loggedInUser._id,
          ),
        }));
        setIsFollowing(false);
      } else {
        await api.put(`/users/${profile._id}/follow`);
        setProfile((prev) => ({
          ...prev,
          followers: [...(prev.followers || []), loggedInUser._id],
        }));
        setIsFollowing(true);
      }
    } catch (error) {
      console.error("Failed to toggle follow state:", error);
    }
  };

  // 👇 Function to handle clicking Followers/Following
  const openFollowModal = async (type) => {
    if (!profile?._id) return;
    try {
      // type should be "followers" or "following"
      const endpoint = `/users/${profile._id}/${type}`;
      const { data } = await api.get(endpoint);

      setFollowModal({
        isOpen: true,
        title: type === "followers" ? "Followers" : "Following",
        users: data,
      });
    } catch (error) {
      console.error("Failed to fetch follow list", error);
    }
  };

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
            {isOwnProfile ? (
              <button
                onClick={() => setShowEditProfile(true)}
                className="px-4 py-1.5 border rounded-md text-sm font-medium hover:bg-gray-100 transition"
              >
                Edit Profile
              </button>
            ) : (
              <button
                onClick={handleFollowToggle}
                className={`px-4 py-1.5 rounded-md text-sm font-medium transition ${
                  isFollowing
                    ? "border bg-gray-100 hover:bg-gray-200"
                    : "bg-blue-500 text-white hover:bg-blue-600"
                }`}
              >
                {isFollowing ? "Unfollow" : "Follow"}
              </button>
            )}
          </div>

          {/* Stats - NOW CLICKABLE */}
          <div className="flex justify-center sm:justify-start gap-6 mt-4">
            <div>
              <span className="font-semibold">{posts.length}</span> posts
            </div>

            {/* 👇 CLICKABLE FOLLOWERS */}
            <button
              onClick={() => openFollowModal("followers")}
              className="hover:underline cursor-pointer"
            >
              <span className="font-semibold">
                {profile.followers?.length || 0}
              </span>{" "}
              followers
            </button>

            {/* 👇 CLICKABLE FOLLOWING */}
            <button
              onClick={() => openFollowModal("following")}
              className="hover:underline cursor-pointer"
            >
              <span className="font-semibold">
                {profile.following?.length || 0}
              </span>{" "}
              following
            </button>
          </div>

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

      {/* 👇 Render Follow List Modal */}
      {followModal.isOpen && (
        <FollowListModal
          title={followModal.title}
          users={followModal.users}
          onClose={() => setFollowModal({ ...followModal, isOpen: false })}
        />
      )}
    </div>
  );
};

export default ProfilePage;
