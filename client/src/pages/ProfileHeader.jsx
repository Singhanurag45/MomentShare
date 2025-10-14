import React from "react";

const ProfileHeader = ({
  profile,
  postCount,
  isOwnProfile,
  onFollow,
  onEditProfile,
  onShowFollowers,
  onShowFollowing
}) => {
  // Determine the text for the follow/unfollow button
  const followButtonText = profile.isFollowedByCurrentUser
    ? "Unfollow"
    : "Follow";

  return (
    <header className="flex flex-col sm:flex-row items-center p-4">
      {/* Profile Picture */}
      <img
        src={
          profile.profilePicture ||
          `https://i.pravatar.cc/150?u=${profile.username}` // Fallback image
        }
        alt={profile.username}
        className="w-24 h-24 md:w-36 md:h-36 rounded-full object-cover mr-0 sm:mr-8 mb-4 sm:mb-0 flex-shrink-0 border-2 border-gray-200 shadow-sm"
      />

      <div className="flex flex-col items-center sm:items-start w-full">
        {/* Username and Action Button */}
        <div className="flex items-center mb-4">
          <h1 className="text-2xl font-light text-gray-800">
            {profile.username}
          </h1>

          {isOwnProfile ? (
            // If it's the user's own profile, show "Edit Profile" button
            <button
              onClick={onEditProfile}
              className="ml-4 px-4 py-1 border font-semibold rounded text-sm text-gray-700 hover:bg-gray-100 transition-colors"
            >
              Edit Profile
            </button>
          ) : (
            // Otherwise, show the "Follow" or "Unfollow" button
            <button
              onClick={onFollow}
              className={`ml-4 px-4 py-1 font-semibold rounded text-sm transition-colors ${
                profile.isFollowedByCurrentUser
                  ? "bg-gray-200 text-black hover:bg-gray-300"
                  : "bg-blue-500 text-white hover:bg-blue-600"
              }`}
            >
              {followButtonText}
            </button>
          )}
        </div>

        {/* Profile Stats: Posts, Followers, Following */}
        <div className="flex space-x-6 mb-4">
          <div>
            <span className="font-semibold">{postCount}</span> posts
          </div>
          {/* ✨ Make these clickable */}
          <button onClick={onShowFollowers} className="hover:text-primary">
            <span className="font-semibold">{profile.followers.length}</span>{" "}
            followers
          </button>
          <button onClick={onShowFollowing} className="hover:text-primary">
            <span className="font-semibold">{profile.following.length}</span>{" "}
            following
          </button>
        </div>
        
        {/* Full Name and Bio */}
        <div>
          <p className="font-semibold text-gray-900">
            {profile.fullName || profile.username}
          </p>
          <p className="text-gray-600">{profile.bio}</p>
        </div>
      </div>
    </header>
  );
};

export default ProfileHeader;
