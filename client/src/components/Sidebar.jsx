import React from "react";
import { Link } from "react-router-dom";
import Suggestions from "./Suggestions";
import ExploreTags from "./ExploreTags";
import Footer from "./Footer";
import UserAvatar from "./UserAvatar";

const Sidebar = ({ user }) => {
  return (
    <aside className="hidden md:block w-full">
      <div className="sticky top-24 space-y-6">
        {/* User Card */}
        {user && (
          <Link
            to={`/${user.username}`}
            className="flex items-center gap-4 bg-white dark:bg-surface p-4 rounded-2xl shadow-sm border dark:border-border hover:bg-gray-50 dark:hover:bg-surface/80 transition"
          >
            <div className="flex-shrink-0">
              <UserAvatar user={user} size="w-14 h-14" textSize="text-xl" />
            </div>

            <div className="leading-tight">
              <p className="font-semibold text-gray-900 dark:text-text-primary">
                {user.username}
              </p>
              <p className="text-sm text-gray-500 dark:text-text-secondary truncate max-w-[180px]">
                {user.email}
              </p>
            </div>
          </Link>
        )}

        {/* Suggestions */}
        <Suggestions />

        {/* Explore Tags */}
        <ExploreTags />

      </div>
    </aside>
  );
};

export default Sidebar;
