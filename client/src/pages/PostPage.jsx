import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import api from "../services/api";
import PostCard from "../components/PostCard";
import FeedSkeleton from "../components/FeedSkeleton";

const PostPage = () => {
  const { postId } = useParams();
  const [post, setPost] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchPost = async () => {
      try {
        const { data } = await api.get(`/posts/${postId}`);
        setPost(data);
      } catch (err) {
        console.error("Failed to fetch post:", err);
        setError("Could not load the post. It may have been deleted.");
      } finally {
        setLoading(false);
      }
    };
    fetchPost();
  }, [postId]);

  if (loading)
    return (
      <div className="max-w-xl mx-auto py-8">
        <FeedSkeleton />
      </div>
    );
  if (error)
    return (
      <p className="text-center text-red-500 mt-10 font-medium">{error}</p>
    );

  return (
    <div className="max-w-xl mx-auto py-8">
      {post ? <PostCard post={post} /> : <p>Post not found.</p>}
    </div>
  );
};

export default PostPage;
