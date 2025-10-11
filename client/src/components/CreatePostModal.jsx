// client/src/components/CreatePostModal.jsx
import { useState } from "react";
import { PhotoIcon, XMarkIcon } from "@heroicons/react/24/solid";
import api from "../services/api";

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
      // Create a preview URL for the selected image/video
      setPreview(URL.createObjectURL(selectedFile));
    }
  };

  // This function converts the file to a Base64 string for sending
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

      // ✨ The API call to your backend
      await api.post("/posts", payload);

      // On success, close the modal
      onClose();
      // You might want to refresh the feed here as well
      window.location.reload(); // Simple way to refresh
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
              <img
                src={user.profilePicture}
                alt={user.username}
                className="w-10 h-10 rounded-full object-cover"
              />
              <p className="font-semibold text-gray-800 dark:text-text-primary">
                {user.username}
              </p>
            </div>

            <textarea
              value={caption}
              onChange={(e) => setCaption(e.target.value)}
              placeholder="Write a caption..."
              rows={3}
              className="w-full bg-transparent text-lg outline-none text-gray-700 dark:text-text-primary placeholder-gray-400 dark:placeholder-text-secondary"
            />

            {preview ? (
              <div className="w-full h-80 rounded-lg overflow-hidden">
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
              </div>
            ) : (
              <div className="w-full h-80 bg-gray-100 dark:bg-background border-2 border-dashed border-gray-300 dark:border-border rounded-lg flex flex-col justify-center items-center">
                <PhotoIcon className="h-16 w-16 text-gray-400 dark:text-gray-600" />
                <p className="text-gray-500 dark:text-text-secondary mt-2">
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
            <label
              htmlFor="file-upload"
              className="w-full text-center block bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded-lg cursor-pointer"
            >
              Select from computer
            </label>

            {error && (
              <p className="text-red-500 text-sm text-center">{error}</p>
            )}
          </div>
          <div className="p-4 border-t dark:border-border">
            <button
              type="submit"
              disabled={isSubmitting || !file}
              // ✨ CHANGE THIS LINE
              className="w-full bg-blue-500 hover:bg-blue-600 text-white font-bold py-2.5 px-4 rounded-lg disabled:bg-blue-300 disabled:cursor-not-allowed transition-colors"
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
