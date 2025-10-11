import { useEffect, useState, useCallback } from "react"; // ✨ Import useCallback
import { useParams } from "react-router-dom";
import api from "../services/api";
import { useAuth } from "../context/AuthContext";

import ProfileHeader from "./ProfileHeader";
import PostGrid from "./PostGrid";
import ProfileSkeleton from "./ProfileSkeleton";
import EditProfileModal from "../components/EditProfileModal";

const ProfilePage = () => {
  const [profile, setProfile] = useState(null);
  const [posts, setPosts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);

  const { username } = useParams();
  const { user: currentUser } = useAuth();

  // ✨ Wrap the data fetching logic in a useCallback hook
  const fetchProfile = useCallback(async () => {
    setIsLoading(true);
    try {
      const { data } = await api.get(`/users/${username}`);
      const isFollowed = data.user.followers.includes(currentUser._id);
      setProfile({ ...data.user, isFollowedByCurrentUser: isFollowed });
      setPosts(data.posts);
      setError(null);
    } catch (err) {
      console.error("Failed to fetch profile:", err);
      setError("Could not load the profile. The user may not exist.");
    } finally {
      setIsLoading(false);
    }
  }, [username, currentUser._id]); // Dependencies for the function

  // useEffect now just calls the fetchProfile function
  useEffect(() => {
    fetchProfile();
  }, [fetchProfile]);

  // ✨ This function now simply triggers a refetch
  const handleProfileUpdate = () => {
    fetchProfile(); // Re-fetch the data to get the latest updates
  };

  // ... (handleFollow logic remains the same) ...
  const handleFollow = async () => {
    const originalProfile = profile;
    const isFollowing = profile.isFollowedByCurrentUser;
    setProfile((prevProfile) => ({
      ...prevProfile,
      isFollowedByCurrentUser: !isFollowing,
      followers: isFollowing
        ? prevProfile.followers.filter((id) => id !== currentUser._id)
        : [...prevProfile.followers, currentUser._id],
    }));
    try {
      await api.put(
        `/users/${profile._id}/${isFollowing ? "unfollow" : "follow"}`
      );
    } catch (err) {
      setProfile(originalProfile);
    }
  };

  if (isLoading) return <ProfileSkeleton />;
  if (error)
    return (
      <div className="text-center text-red-500 mt-10 font-medium">{error}</div>
    );
  if (!profile) return null;

  const isOwnProfile = currentUser?.username === profile.username;

  return (
    <>
      {isEditModalOpen && (
        <EditProfileModal
          user={profile}
          onClose={() => setIsEditModalOpen(false)}
          onProfileUpdate={handleProfileUpdate} // This now triggers the refetch
        />
      )}
      <div className="container mx-auto p-4 max-w-4xl">
        <ProfileHeader
          profile={profile}
          postCount={posts.length}
          isOwnProfile={isOwnProfile}
          onFollow={handleFollow}
          onEditProfile={() => setIsEditModalOpen(true)}
        />
        <hr className="my-8 border-gray-200" />
        <PostGrid posts={posts} />
      </div>
    </>
  );
};

export default ProfilePage;
