import { useState, useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import api from "../services/api";
import UserAvatar from "./UserAvatar";

const SearchBar = () => {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState([]);
  const [isOpen, setIsOpen] = useState(false);
  const searchRef = useRef(null);

  useEffect(() => {
    if (query.length < 2) {
      setResults([]);
      return;
    }

    const debounceTimer = setTimeout(() => {
      api.get(`/users/search?q=${query}`).then((res) => {
        setResults(res.data);
        setIsOpen(true);
      });
    }, 300); // 300ms delay

    return () => clearTimeout(debounceTimer);
  }, [query]);

  // Effect to handle clicks outside the search bar to close it
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (searchRef.current && !searchRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleResultClick = () => {
    setQuery("");
    setResults([]);
    setIsOpen(false);
  };

  return (
    <div className="relative" ref={searchRef}>
      <input
        type="text"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        onFocus={() => query.length > 1 && setIsOpen(true)}
        placeholder="Search users..."
        className="bg-gray-100 dark:bg-background border dark:border-border rounded-full px-4 py-2 text-sm w-64 focus:outline-none focus:ring-2 focus:ring-primary/50"
      />
      {isOpen && results.length > 0 && (
        <div className="absolute top-12 w-full bg-white dark:bg-surface border dark:border-border rounded-lg shadow-lg max-h-80 overflow-y-auto z-30">
          <ul>
            {results.map((user) => (
              <li key={user._id}>
                <Link
                  to={`/${user.username}`}
                  onClick={handleResultClick}
                  className="flex items-center gap-3 p-3 hover:bg-gray-50 dark:hover:bg-gray-800"
                >
                  <div className="flex-shrink-0">
                     <UserAvatar user={user} size="w-14 h-14" textSize="text-xl" />
                  </div>
                 
                  <span className="font-semibold text-sm">{user.username}</span>
                </Link>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default SearchBar;
