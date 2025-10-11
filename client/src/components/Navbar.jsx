import { Link, useNavigate } from "react-router-dom";
import {
  HomeIcon,
  UserCircleIcon,
  ArrowLeftOnRectangleIcon,
  PlusCircleIcon,
  BellIcon,
} from "@heroicons/react/24/outline";

import { useAuth } from "../context/AuthContext";
import SearchBar from "./SearchBar"; // ✨ Import
import Notifications from "./Notifications"; 

const Navbar = ({ onOpenCreatePostModal }) => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <nav className="fixed top-0 left-0 right-0 bg-white shadow-md z-20">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <Link to="/" className="flex items-center gap-2">
            <img
              src="/logo.png"
              alt="MomentShare Logo"
              className="h-10 w-10 rounded-full object-cover border-2 border-blue-500 shadow-sm"
            />
            <h1 className="text-2xl font-bold font-serif hidden sm:inline">
              <span className="text-blue-600">Moment</span>
              <span className="text-gray-800">Share</span>
            </h1>
          </Link>

          {/* Search Bar (center) */}
          <div className="hidden md:block">
            <SearchBar />
          </div>

          {/* Navigation Links */}
          <div className="hidden md:flex items-center space-x-6">
            <Link
              to="/"
              className="flex items-center gap-1 text-gray-700 hover:text-blue-600 transition"
            >
              <HomeIcon className="h-6 w-6" />
              <span className="hidden sm:inline text-sm font-medium">Home</span>
            </Link>

            {/* ✅ Create Post Button triggers modal */}
            <button
              onClick={onOpenCreatePostModal}
              className="flex items-center gap-1 text-gray-700 hover:text-blue-600 transition"
            >
              <PlusCircleIcon className="h-6 w-6" />
              <span className="hidden sm:inline text-sm font-medium">
                Create
              </span>
            </button>

            <button className="flex items-center space-x-1 hover:text-primary">
              <Notifications />
              <span className="hidden lg:inline text-sm">Notification</span>
            </button>

            <Link
              to={`/${user?.username}`}
              className="flex items-center gap-1 text-gray-700 hover:text-blue-600 transition"
            >
              <UserCircleIcon className="h-6 w-6" />
              <span className="hidden sm:inline text-sm font-medium">
                Profile
              </span>
            </Link>

            {/* Logout Button */}
            <button
              onClick={handleLogout}
              className="px-3 py-1.5 bg-blue-500 text-white rounded-lg text-sm font-semibold hover:bg-blue-600 transition"
            >
              Log Out
            </button>
          </div>

          {/* Mobile Menu (icons only) */}
          <div className="md:hidden flex items-center space-x-3">
            {/* ✅ Mobile Create button also opens modal */}
            <button onClick={onOpenCreatePostModal}>
              <PlusCircleIcon className="h-7 w-7 text-gray-700 hover:text-blue-600" />
            </button>
            <button onClick={handleLogout}>
              <UserCircleIcon className="h-7 w-7 text-gray-700 hover:text-blue-600" />
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
