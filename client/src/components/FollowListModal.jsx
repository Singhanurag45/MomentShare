import { XMarkIcon } from "@heroicons/react/24/solid";
import { Link } from "react-router-dom";

const FollowListModal = ({ title, users, onClose }) => {
  return (
    <div className="fixed inset-0 bg-black/60 z-50 flex justify-center items-center">
      <div className="bg-white dark:bg-surface w-full max-w-sm rounded-xl shadow-xl flex flex-col h-96">
        {/* Header */}
        <div className="flex justify-between items-center p-4 border-b dark:border-border">
          <h2 className="text-lg font-bold">{title}</h2>
          <button
            onClick={onClose}
            className="hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full p-2"
          >
            <XMarkIcon className="h-6 w-6" />
          </button>
        </div>

        {/* User List */}
        <div className="flex-grow overflow-y-auto">
          {users.length > 0 ? (
            users.map((user) => (
              <div
                key={user._id}
                className="flex items-center justify-between p-3"
              >
                <div className="flex items-center gap-3">
                  <img
                    src={user.profilePicture}
                    alt={user.username}
                    className="w-10 h-10 rounded-full object-cover"
                  />
                  <div>
                    <Link
                      to={`/${user.username}`}
                      onClick={onClose}
                      className="font-semibold text-sm hover:underline"
                    >
                      {user.username}
                    </Link>
                    <p className="text-xs text-gray-500">{user.fullName}</p>
                  </div>
                </div>
                {/* Optional: Add a follow/unfollow button here later */}
              </div>
            ))
          ) : (
            <p className="text-center text-gray-500 p-8">No users to show.</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default FollowListModal;
