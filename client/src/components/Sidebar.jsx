import React from "react";
import Suggestions from "./Suggestions";
import ExploreTags from "./ExploreTags";
import Footer from "./Footer";

const Sidebar = ({ user }) => {
  return (
    <aside className="hidden md:block">
      <div className="sticky top-24 w-full space-y-6">
        {user && (
          <div className="flex items-center space-x-4 bg-white dark:bg-surface p-4 rounded-2xl shadow-sm border dark:border-border">
            <img
              src={user.profilePicture}
              alt={user.username}
              className="w-16 h-16 rounded-full object-cover"
            />
            <div>
              <p className="font-bold text-gray-900 dark:text-text-primary text-lg">
                {user.username}
              </p>
              <p className="text-sm text-gray-500 dark:text-text-secondary">
                {user.email}
              </p>
            </div>
          </div>
        )}
        <Suggestions />
        <ExploreTags />
        <Footer />
      </div>
    </aside>
  );
};

export default Sidebar;
