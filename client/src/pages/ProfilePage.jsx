import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import api from "../services/api";
import PostGrid from "./PostGrid";
import FeedSkeleton from "../components/FeedSkeleton";
import { useAuth } from "../context/AuthContext";
import EditProfileModal from "../components/EditProfileModal";
import UserAvatar from "../components/UserAvatar";
import FollowListModal from "../components/FollowListModal";

const ProfilePage = () => {
  const { username } = useParams();
  const { user: loggedInUser } = useAuth();

  const [profile, setProfile] = useState(null);
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showEditProfile, setShowEditProfile] = useState(false);
  const [isFollowing, setIsFollowing] = useState(false);

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

  const openFollowModal = async (type) => {
    if (!profile?._id) return;
    try {
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

  if (loading)
    return (
      <div className="max-w-4xl mx-auto pt-20 px-4">
        <FeedSkeleton />
      </div>
    );
  if (error)
    return (
      <p className="text-center text-red-500 font-medium mt-32">{error}</p>
    );
  if (!profile) return null;

  return (
    <div className="max-w-4xl mx-auto pt-20 px-4 pb-12">
      {/* --- Refined, Tighter Header Card --- */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 md:p-8 mb-6">
        <div className="flex flex-col md:flex-row gap-6 md:gap-10 items-center md:items-start">
          {/* Avatar - Reduced to a professional scale */}
          <div className="relative flex-shrink-0">
            <div className="absolute -inset-1 bg-gradient-to-tr from-blue-400 to-indigo-500 rounded-full blur-sm opacity-20"></div>
            <UserAvatar
              user={profile}
              size="w-24 h-24 md:w-28 md:h-28"
              textSize="text-4xl"
              className="relative border-4 border-white shadow-md"
            />
          </div>

          {/* User Info & Actions */}
          <div className="flex-1 w-full">
            <div className="flex flex-col md:flex-row items-center justify-between gap-2 mb-4">
              <div className="text-center md:text-left">
                <h2 className="text-xl font-bold text-gray-900 tracking-tight">
                  {profile.username}
                </h2>
                <p className="text-[11px] font-bold text-gray-400 uppercase tracking-widest">
                  {profile.fullName || "Member"}
                </p>
              </div>

              <div className="flex gap-2">
                {isOwnProfile ? (
                  <button
                    onClick={() => setShowEditProfile(true)}
                    className="px-5 py-1.5 bg-gray-900 text-white rounded-lg text-xs font-bold hover:bg-black transition-all shadow-sm"
                  >
                    Edit Profile
                  </button>
                ) : (
                  <button
                    onClick={handleFollowToggle}
                    className={`px-6 py-1.5 rounded-lg text-xs font-bold transition-all shadow-sm ${
                      isFollowing
                        ? "bg-gray-100 text-gray-700 border border-gray-200 hover:bg-gray-200"
                        : "bg-blue-600 text-white hover:bg-blue-700"
                    }`}
                  >
                    {isFollowing ? "Following" : "Follow"}
                  </button>
                )}
              </div>
            </div>

            {/* Stats Bar - Compact Layout */}
            <div className="flex justify-center md:justify-start gap-8 py-3 border-y border-gray-50 mb-4">
              <div className="flex items-center gap-1.5">
                <span className="text-base font-bold text-gray-900">
                  {posts.length}
                </span>
                <span className="text-[10px] text-gray-400 font-bold uppercase tracking-widest">
                  Posts
                </span>
              </div>

              <button
                onClick={() => openFollowModal("followers")}
                className="flex items-center gap-1.5 group hover:opacity-80 transition"
              >
                <span className="text-base font-bold text-gray-900 group-hover:text-blue-600">
                  {profile.followers?.length || 0}
                </span>
                <span className="text-[10px] text-gray-400 font-bold uppercase tracking-widest group-hover:text-blue-500">
                  Followers
                </span>
              </button>

              <button
                onClick={() => openFollowModal("following")}
                className="flex items-center gap-1.5 group hover:opacity-80 transition"
              >
                <span className="text-base font-bold text-gray-900 group-hover:text-blue-600">
                  {profile.following?.length || 0}
                </span>
                <span className="text-[10px] text-gray-400 font-bold uppercase tracking-widest group-hover:text-blue-500">
                  Following
                </span>
              </button>
            </div>

            {/* Bio Section */}
            {profile.bio && (
              <div className="max-w-lg text-center md:text-left">
                <p className="text-gray-600 text-[13px] leading-relaxed italic whitespace-pre-line">
                  {profile.bio}
                </p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* --- Section Tab Divider --- */}
      <div className="flex justify-center border-b border-gray-100 mb-6">
        <div className="px-6 py-2 border-b-2 border-gray-900 text-[10px] font-black uppercase tracking-[0.3em] text-gray-900">
          Posts
        </div>
      </div>

      {/* Grid Display */}
      <PostGrid posts={posts} />

      {/* Modals Container */}
      {showEditProfile && (
        <EditProfileModal
          user={profile}
          onClose={() => setShowEditProfile(false)}
          onProfileUpdate={fetchProfile}
        />
      )}

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
