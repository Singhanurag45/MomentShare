import { useState } from "react";
import { PhotoIcon, XMarkIcon } from "@heroicons/react/24/solid";
import api from "../services/api";
import UserAvatar from "./UserAvatar"; // ✅ Import remains the same

const CreatePostModal = ({ user, onClose }) => {
  const [caption, setCaption] = useState("");
  const [file, setFile] = useState(null);
  const [preview, setPreview] = useState(null);
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile) {
      setFile(selectedFile);
      setPreview(URL.createObjectURL(selectedFile));
    }
  };

  const toBase64 = (file) =>
    new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result);
      reader.onerror = (error) => reject(error);
    });

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!file) {
      setError("Please select an image or video to upload.");
      return;
    }
    setError("");
    setIsSubmitting(true);

    try {
      const mediaFileBase64 = await toBase64(file);
      const mediaType = file.type.startsWith("image") ? "image" : "video";

      const payload = {
        caption,
        mediaFile: mediaFileBase64,
        mediaType,
      };

      await api.post("/posts", payload);
      onClose();
      window.location.reload();
    } catch (err) {
      console.error("Failed to create post:", err);
      setError("Failed to create post. The file might be too large.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex justify-center items-center">
      <div className="bg-white dark:bg-surface w-full max-w-lg rounded-2xl shadow-xl border border-gray-200 dark:border-border">
        <div className="flex justify-between items-center p-4 border-b dark:border-border">
          <h2 className="text-xl font-bold text-gray-800 dark:text-text-primary">
            Create new post
          </h2>
          <button
            onClick={onClose}
            className="hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full p-2"
          >
            <XMarkIcon className="h-6 w-6 text-gray-600 dark:text-text-secondary" />
          </button>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="p-4 space-y-4">
            <div className="flex items-center space-x-3">
              {/* 👇 FIXED: Replaced <img> with <UserAvatar /> */}
              <div className="flex-shrink-0">
                <UserAvatar user={user} size="w-10 h-10" textSize="text-sm" />
              </div>

              <p className="font-semibold text-gray-800 dark:text-text-primary">
                {user.username}
              </p>
            </div>

            <textarea
              value={caption}
              onChange={(e) => setCaption(e.target.value)}
              placeholder="Write a caption..."
              rows={3}
              className="w-full bg-transparent text-lg outline-none text-gray-700 dark:text-text-primary placeholder-gray-400 dark:placeholder-text-secondary resize-none"
            />

            {preview ? (
              <div className="w-full h-80 rounded-lg overflow-hidden relative group">
                {file.type.startsWith("image") ? (
                  <img
                    src={preview}
                    alt="Preview"
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <video
                    src={preview}
                    controls
                    className="w-full h-full object-cover"
                  />
                )}
                {/* Optional: Add a clear button here if you want */}
              </div>
            ) : (
              <div className="w-full h-80 bg-gray-50 dark:bg-background border-2 border-dashed border-gray-300 dark:border-gray-700 rounded-xl flex flex-col justify-center items-center">
                <PhotoIcon className="h-16 w-16 text-gray-300 dark:text-gray-600" />
                <p className="text-gray-400 dark:text-gray-500 mt-2 font-medium">
                  Upload a photo or video
                </p>
              </div>
            )}

            <input
              type="file"
              id="file-upload"
              accept="image/*,video/*"
              onChange={handleFileChange}
              className="hidden"
            />

            {/* Improved Button Styling */}
            {!preview && (
              <label
                htmlFor="file-upload"
                className="w-full text-center block bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 text-gray-700 dark:text-text-primary font-medium py-3 rounded-xl cursor-pointer transition-colors"
              >
                Select from computer
              </label>
            )}

            {error && (
              <p className="text-red-500 text-sm text-center font-medium bg-red-50 dark:bg-red-900/10 py-2 rounded-lg">
                {error}
              </p>
            )}
          </div>

          <div className="p-4 border-t dark:border-border">
            <button
              type="submit"
              disabled={isSubmitting || !file}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-4 rounded-xl disabled:bg-blue-300 dark:disabled:bg-blue-900/40 disabled:cursor-not-allowed transition-all shadow-sm hover:shadow-md"
            >
              {isSubmitting ? "Sharing..." : "Share"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreatePostModal;
