import React from "react";
import defaultAvatar from "../assets/avatar.png";

const ProfileHeader = ({
  profile,
  postCount,
  isOwnProfile,
  onFollow,
  onEditProfile,
  onShowFollowers,
  onShowFollowing,
}) => {
  return (
    <header className="flex flex-col sm:flex-row items-center sm:items-start gap-6 p-4">
      <img
        src={
          profile.profilePicture ||
          defaultAvatar
        }
        alt={profile.username}
        className="w-28 h-28 md:w-36 md:h-36 rounded-full object-cover border-2 border-gray-200 shadow-sm"
        onError={(e) => {
          e.target.src = defaultAvatar;
        }}
      />

      {/* Profile Info */}
      <div className="flex-1 w-full">
        {/* Username + Button */}
        <div className="flex flex-col sm:flex-row sm:items-center gap-4 mb-4">
          <h1 className="text-2xl font-semibold text-gray-800">
            {profile.username}
          </h1>

          {isOwnProfile ? (
            <button
              onClick={onEditProfile}
              className="px-4 py-1.5 border rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-100 transition"
            >
              Edit Profile
            </button>
          ) : (
            <button
              onClick={onFollow}
              className={`px-5 py-1.5 rounded-lg text-sm font-semibold transition ${
                profile.isFollowedByCurrentUser
                  ? "bg-gray-200 text-gray-800 hover:bg-gray-300"
                  : "bg-blue-500 text-white hover:bg-blue-600"
              }`}
            >
              {profile.isFollowedByCurrentUser ? "Unfollow" : "Follow"}
            </button>
          )}
        </div>

        {/* Stats */}
        <div className="flex gap-6 mb-4 text-gray-800">
          <div>
            <span className="font-semibold">{postCount}</span> posts
          </div>

          <button onClick={onShowFollowers} className="hover:text-blue-500">
            <span className="font-semibold">{profile.followers.length}</span>{" "}
            followers
          </button>

          <button onClick={onShowFollowing} className="hover:text-blue-500">
            <span className="font-semibold">{profile.following.length}</span>{" "}
            following
          </button>
        </div>

        {/* Name & Bio */}
        <div className="space-y-1">
          <p className="font-semibold text-gray-900">
            {profile.fullName || profile.username}
          </p>
          {profile.bio && (
            <p className="text-gray-600 leading-snug max-w-md">{profile.bio}</p>
          )}
        </div>
      </div>
    </header>
  );
};

export default ProfileHeader;
