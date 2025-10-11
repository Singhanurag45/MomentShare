// client/src/components/Suggestions.jsx
import { useEffect, useState } from "react";
import api from "../services/api";
import SuggestionItem from "./SuggestionItem.jsx";

const Suggestions = () => {
  const [suggestions, setSuggestions] = useState([]);

  useEffect(() => {
    const fetchSuggestions = async () => {
      try {
        const { data } = await api.get("/users/suggestions"); // We need to create this endpoint
        setSuggestions(data);
      } catch (error) {
        console.error("Failed to fetch suggestions:", error);
      }
    };
    fetchSuggestions();
  }, []);

  return (
    <div className="bg-white border rounded-lg p-4 mt-6">
      <h3 className="font-bold text-gray-700 mb-4">Suggestions For You</h3>
      {suggestions.length > 0 ? (
        <div className="space-y-4">
          {suggestions.map((user) => (
            <SuggestionItem key={user._id} suggestedUser={user} />
          ))}
        </div>
      ) : (
        <p className="text-sm text-gray-400">No new suggestions right now.</p>
      )}
    </div>
  );
};

export default Suggestions;
