import { XMarkIcon } from "@heroicons/react/24/solid";
import { Link } from "react-router-dom";
import UserAvatar from "./UserAvatar"; // 👈 Import Avatar

const FollowListModal = ({ title, users, onClose }) => {
  return (
    <div className="fixed inset-0 bg-black/60 z-50 flex justify-center items-center backdrop-blur-sm p-4">
      <div className="bg-white dark:bg-surface w-full max-w-sm rounded-2xl shadow-xl flex flex-col max-h-[500px]">
        {/* Header */}
        <div className="flex justify-between items-center p-4 border-b dark:border-border">
          <h2 className="text-lg font-bold text-gray-800 dark:text-text-primary">
            {title}
          </h2>
          <button
            onClick={onClose}
            className="hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full p-2 transition-colors"
          >
            <XMarkIcon className="h-6 w-6 text-gray-600 dark:text-text-secondary" />
          </button>
        </div>

        {/* User List */}
        <div className="flex-grow overflow-y-auto p-2">
          {users.length > 0 ? (
            users.map((user) => (
              <Link
                key={user._id}
                to={`/${user.username}`}
                onClick={onClose}
                className="flex items-center justify-between p-3 hover:bg-gray-50 dark:hover:bg-gray-800 rounded-xl transition-colors"
              >
                <div className="flex items-center gap-3">
                  {/* 👇 Use UserAvatar here */}
                  <div className="flex-shrink-0">
                    <UserAvatar
                      user={user}
                      size="w-10 h-10"
                      textSize="text-sm"
                    />
                  </div>

                  <div>
                    <p className="font-semibold text-sm text-gray-900 dark:text-text-primary">
                      {user.username}
                    </p>
                    <p className="text-xs text-gray-500 dark:text-text-secondary">
                      {user.fullName}
                    </p>
                  </div>
                </div>
              </Link>
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
