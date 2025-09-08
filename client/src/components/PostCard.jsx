import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import api from "../services/api";
import UserAvatar from "./UserAvatar";
import {
  HeartIcon as HeartOutline,
  ChatBubbleOvalLeftIcon,
} from "@heroicons/react/24/outline";
import { HeartIcon as HeartSolid, TrashIcon } from "@heroicons/react/24/solid";
import AddComment from "./AddComment";

const PostCard = ({ post, onDeleted }) => {
  const { user: currentUser } = useAuth();
  const [isLiked, setIsLiked] = useState(false);
  const [likeCount, setLikeCount] = useState(0);
  const [comments, setComments] = useState([]);

  useEffect(() => {
    if (post && currentUser) {
      setLikeCount(post.likes?.length || 0);
      setIsLiked(post.likes?.includes(currentUser._id));
      setComments(post.comments || []);
    }
  }, [post, currentUser]);

  const handleLike = async () => {
    const prevLiked = isLiked;
    const prevCount = likeCount;
    setIsLiked(!prevLiked);
    setLikeCount(prevLiked ? prevCount - 1 : prevCount + 1);
    try {
      await api.put(`/posts/${post._id}/like`);
    } catch (err) {
      setIsLiked(prevLiked);
      setLikeCount(prevCount);
    }
  };

  const handleCommentPosted = (updatedComments) => {
    setComments(updatedComments);
  };

  const handleDelete = async () => {
    if (!post || !currentUser) return;
    const isOwner =
      post.user._id?.toString?.() === currentUser._id ||
      post.user === currentUser._id;
    if (!isOwner) return;

    const confirmDelete = window.confirm(
      "Are you sure you want to delete this post?",
    );
    if (!confirmDelete) return;

    try {
      await api.delete(`/posts/${post._id}`);
      if (onDeleted) onDeleted(post._id);
    } catch (error) {
      console.error("Failed to delete post:", error);
      alert("Could not delete the post. Please try again.");
    }
  };

  if (!post || !post.user) return null;

  return (
    <div className="bg-white dark:bg-surface border dark:border-border rounded-xl shadow-sm overflow-hidden mb-6">
      <div className="flex items-center justify-between px-4 py-3">
        <div className="flex items-center gap-3">
          <Link to={`/${post.user.username}`}>
            <UserAvatar
              user={post.user}
              size="w-10 h-10"
              textSize="text-sm"
              className="border"
            />
          </Link>
          <Link
            to={`/${post.user.username}`}
            className="font-semibold text-gray-900 dark:text-text-primary hover:underline"
          >
            {post.user.username}
          </Link>
        </div>

        {/* Delete button only for owner */}
        {currentUser &&
          (post.user._id?.toString?.() === currentUser._id ||
            post.user === currentUser._id) && (
            <button
              onClick={handleDelete}
              className="text-red-500 hover:text-red-600 flex items-center gap-1 text-sm"
            >
              <TrashIcon className="w-4 h-4" />
              Delete
            </button>
          )}
      </div>

      {post.mediaUrl && (
        <div className="bg-black">
          {post.mediaType === "image" ? (
            <img
              src={post.mediaUrl}
              alt="Post"
              className="w-full max-h-[600px] object-cover"
            />
          ) : (
            <video
              src={post.mediaUrl}
              controls
              className="w-full max-h-[600px]"
            />
          )}
        </div>
      )}

      <div className="px-4 pt-3 pb-3">
        <div className="flex items-center gap-4">
          <button onClick={handleLike} aria-label="Like post">
            {isLiked ? (
              <HeartSolid className="w-7 h-7 text-red-500 active:scale-90 transition" />
            ) : (
              <HeartOutline className="w-7 h-7 dark:text-text-primary hover:scale-110 transition" />
            )}
          </button>
          <ChatBubbleOvalLeftIcon className="w-7 h-7 dark:text-text-primary cursor-pointer hover:scale-110 transition" />
        </div>
        <p className="font-semibold text-sm mt-2 dark:text-text-primary">
          {likeCount} likes
        </p>
        {post.caption && (
          <p className="text-sm mt-1">
            <Link
              to={`/${post.user.username}`}
              className="font-semibold mr-2 dark:text-text-primary"
            >
              {post.user.username}
            </Link>
            <span className="dark:text-text-secondary">{post.caption}</span>
          </p>
        )}
        <div className="mt-3 space-y-1 text-sm">
          {comments.length > 2 && (
            <p className="text-gray-500 dark:text-text-secondary cursor-pointer">
              View all {comments.length} comments
            </p>
          )}
          {comments.slice(0, 2).map((comment) => (
            <p key={comment._id}>
              <Link
                to={`/${comment.user.username}`}
                className="font-semibold mr-2 dark:text-text-primary"
              >
                {comment.user.username}
              </Link>
              <span className="dark:text-text-secondary">{comment.text}</span>
            </p>
          ))}
        </div>
        <div className="mt-3 border-t dark:border-gray-800 pt-3">
          <AddComment postId={post._id} onCommentPosted={handleCommentPosted} />
        </div>
      </div>
    </div>
  );
};
export default PostCard;
