// src/components/UserAvatar.jsx
import { useState } from "react";

const UserAvatar = ({
  user,
  size = "w-10 h-10",
  textSize = "text-lg",
  className = "",
}) => {
  const [imgError, setImgError] = useState(false);

  // Check if image exists and hasn't failed to load
  const hasValidImage =
    user?.profilePicture &&
    !user.profilePicture.includes("via.placeholder.com") && 
    !imgError;

  const initial = user?.username ? user.username.charAt(0).toUpperCase() : "?";

  const gradientClass = "bg-gradient-to-br from-violet-500 to-fuchsia-500";

  if (hasValidImage) {
    return (
      <img
        src={user.profilePicture}
        alt={user.username}
        className={`${size} rounded-full object-cover border border-gray-200 dark:border-gray-700 ${className}`}
        onError={() => setImgError(true)}
      />
    );
  }

  // Fallback: Colored Initial
  return (
    <div
      className={`${size} ${gradientClass} rounded-full flex items-center justify-center text-white font-bold ${textSize} shadow-sm border border-white dark:border-gray-700 ${className}`}
    >
      {initial}
    </div>
  );
};

export default UserAvatar;
