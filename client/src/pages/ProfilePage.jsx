import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import api from "../services/api";
import PostGrid from "../pages/PostGrid";
import FeedSkeleton from "../components/FeedSkeleton";
import { useAuth } from "../context/AuthContext";

const ProfilePage = () => {
  const { username } = useParams();
  const { user: loggedInUser } = useAuth();

  const [profile, setProfile] = useState(null);
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const isOwnProfile = loggedInUser?.username === username;

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        setLoading(true);
        const { data } = await api.get(`/users/${username}`);
        setProfile(data.user);
        setPosts(data.posts || []);
      } catch (err) {
        console.error("Profile fetch failed:", err);
        setError("User not found");
      } finally {
        setLoading(false);
      }
    };

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
      <p className="text-center text-red-500 font-medium mt-32">
        {error}
      </p>
    );
  }

  if (!profile) return null;

  return (
    <div className="max-w-4xl mx-auto pt-24 px-4">

      {/* Profile Header */}
      <div className="flex flex-col sm:flex-row gap-8 items-center sm:items-start mb-10">

        {/* Avatar */}
        <img
          src={profile.avatar || "/default-avatar.png"}
          alt={profile.username}
          className="w-32 h-32 rounded-full object-cover border"
        />

        {/* User Info */}
        <div className="flex-1 text-center sm:text-left">

          <div className="flex flex-col sm:flex-row items-center gap-4">
            <h2 className="text-2xl font-semibold">
              {profile.username}
            </h2>

            {isOwnProfile && (
              <Link
                to="/edit-profile"
                className="px-4 py-1.5 border rounded-md text-sm font-medium hover:bg-gray-100 transition"
              >
                Edit Profile
              </Link>
            )}
          </div>

          {/* Stats */}
          <div className="flex justify-center sm:justify-start gap-6 mt-4">
            <div>
              <span className="font-semibold">{posts.length}</span>{" "}
              posts
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

      {/* Divider */}
      <div className="border-t mb-6" />

      {/* Posts Grid */}
      <PostGrid posts={posts} />
    </div>
  );
};

export default ProfilePage;
