import { useEffect, useState } from "react";
import api from "../services/api";
import SuggestionItem from "./SuggestionItem.jsx";

const Suggestions = () => {
  const [suggestions, setSuggestions] = useState([]);

  useEffect(() => {
    const fetchSuggestions = async () => {
      try {
        const { data } = await api.get("/users/suggestions");
        setSuggestions(data);
      } catch (error) {
        console.error("Failed to fetch suggestions:", error);
      }
    };
    fetchSuggestions();
  }, []);

  return (
    // 👇 Updated styles to match your HomePage design (Shadow, Borders, Dark Mode)
    <div className="bg-white dark:bg-surface border border-gray-100 dark:border-border rounded-2xl p-4 mt-6 shadow-sm">
      <h3 className="font-bold text-gray-700 dark:text-text-primary mb-4 text-sm">
        Suggestions For You
      </h3>

      {suggestions.length > 0 ? (
        <div className="space-y-4">
          {suggestions.map((user) => (
            <SuggestionItem key={user._id} suggestedUser={user} />
          ))}
        </div>
      ) : (
        <p className="text-sm text-gray-400 text-center py-2">
          No new suggestions right now.
        </p>
      )}
    </div>
  );
};

export default Suggestions;
