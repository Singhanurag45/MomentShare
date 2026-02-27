import { useState } from "react";
import api from "../services/api";

const AddComment = ({ postId, onCommentPosted }) => {
  const [text, setText] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!text.trim()) return;

    setIsSubmitting(true);
    try {
      const { data: updatedComments } = await api.post(
        `/posts/${postId}/comment`,
        { text }
      );
      onCommentPosted(updatedComments); // Send the full updated list of comments back to the parent
      setText(""); // Clear the input field
    } catch (error) {
      console.error("Failed to post comment:", error);
      alert("Could not post comment. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="flex items-center gap-2 pt-3 border-t border-gray-100 dark:border-border mt-3"
    >
      <input
        type="text"
        value={text}
        onChange={(e) => setText(e.target.value)}
        placeholder="Add a comment..."
        className="flex-grow bg-transparent text-sm outline-none dark:text-text-secondary dark:placeholder-text-secondary"
      />
      <button
        type="submit"
        disabled={isSubmitting || !text.trim()}
        className="text-sm font-semibold text-blue-500 hover:text-blue-700 disabled:text-blue-300 disabled:cursor-not-allowed"
      >
        {isSubmitting ? "Posting..." : "Post"}
      </button>
    </form>
  );
};

export default AddComment;
