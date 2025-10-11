import { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import api from "../services/api";
import { Link } from "react-router-dom";

// Components
import {
  HeartIcon as HeartIconOutline,
  ChatBubbleOvalLeftIcon,
} from "@heroicons/react/24/outline";
import { HeartIcon as HeartIconSolid } from "@heroicons/react/24/solid";
import AddComment from "./AddComment"; // ✨ Import the new component

const PostCard = ({ post }) => {
  const { user: currentUser } = useAuth();

  // State for likes
  const [isLiked, setIsLiked] = useState(false);
  const [likeCount, setLikeCount] = useState(0);

  // ✨ State for comments
  const [comments, setComments] = useState([]);

  useEffect(() => {
    if (post && currentUser) {
      setLikeCount(post.likes.length);
      setIsLiked(post.likes.includes(currentUser._id));
      setComments(post.comments || []); // Initialize comments
    }
  }, [post, currentUser]);

  const handleLike = async () => {
    const originalLiked = isLiked;
    const originalLikeCount = likeCount;
    setIsLiked(!isLiked);
    setLikeCount(isLiked ? likeCount - 1 : likeCount + 1);
    try {
      await api.put(`/posts/${post._id}/like`);
    } catch (error) {
      console.error("Failed to like post:", error);
      setIsLiked(originalLiked);
      setLikeCount(originalLikeCount);
    }
  };

  // ✨ Handler to update comments state when a new one is posted
  const handleCommentPosted = (updatedComments) => {
    setComments(updatedComments);
  };

  if (!post || !post.user) return null;

  return (
    <div className="bg-white dark:bg-surface border border-gray-200 dark:border-border rounded-xl shadow-sm">
      {/* Post Header */}
      <div className="flex items-center p-4">
        <Link to={`/${post.user.username}`}>
          <img
            src={post.user.profilePicture}
            alt={post.user.username}
            className="w-10 h-10 rounded-full mr-4 object-cover"
          />
        </Link>
        <Link
          to={`/${post.user.username}`}
          className="font-semibold text-gray-800 dark:text-text-primary"
        >
          {post.user.username}
        </Link>
      </div>

      {/* Post Media */}
      <div>
        {post.mediaType === "image" ? (
          <img src={post.mediaUrl} alt="Post media" className="w-full" />
        ) : (
          <video src={post.mediaUrl} controls className="w-full"></video>
        )}
      </div>

      {/* Post Actions & Details */}
      <div className="p-4">
        <div className="flex items-center space-x-4 mb-2">
          <button onClick={handleLike}>
            {isLiked ? (
              <HeartIconSolid className="h-7 w-7 text-red-500 transition-transform duration-200 ease-in-out transform hover:scale-110" />
            ) : (
              <HeartIconOutline className="h-7 w-7 dark:text-text-primary transition-transform duration-200 ease-in-out transform hover:scale-110" />
            )}
          </button>
          <button>
            <ChatBubbleOvalLeftIcon className="h-7 w-7 dark:text-text-primary" />
          </button>
        </div>
        <div className="font-semibold text-sm dark:text-text-primary">
          {likeCount} likes
        </div>
        <div className="text-sm mt-1">
          <Link
            to={`/${post.user.username}`}
            className="font-semibold mr-2 dark:text-text-primary"
          >
            {post.user.username}
          </Link>
          <span className="dark:text-text-secondary">{post.caption}</span>
        </div>

        {/* ✨ Comments List */}
        <div className="mt-3 text-sm space-y-2">
          {comments.length > 2 && (
            <p className="text-gray-500 dark:text-text-secondary cursor-pointer">
              View all {comments.length} comments
            </p>
          )}
          {comments.slice(0, 2).map((comment) => (
            <div key={comment._id}>
              <Link
                to={`/${comment.user.username}`}
                className="font-semibold mr-2 dark:text-text-primary"
              >
                {comment.user.username}
              </Link>
              <span className="dark:text-text-secondary">{comment.text}</span>
            </div>
          ))}
        </div>

        {/* ✨ Add Comment Form */}
        <AddComment postId={post._id} onCommentPosted={handleCommentPosted} />
      </div>
    </div>
  );
};

export default PostCard;
