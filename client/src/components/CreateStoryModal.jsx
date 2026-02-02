import { useState } from "react";
import { PhotoIcon, XMarkIcon } from "@heroicons/react/24/solid";
// 👇 IMPORTANT: Must import from your services folder, NOT 'axios' directly
import api from "../services/api";

const toBase64 = (file) =>
  new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result);
    reader.onerror = (error) => reject(error);
  });

const CreateStoryModal = ({ onClose, onStoryPosted }) => {
  const [file, setFile] = useState(null);
  const [preview, setPreview] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile) {
      setFile(selectedFile);
      setPreview(URL.createObjectURL(selectedFile));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!file) return;

    setIsSubmitting(true);
    try {
      const mediaFileBase64 = await toBase64(file);
      const mediaType = file.type.startsWith("image") ? "image" : "video";

      const payload = { mediaFile: mediaFileBase64, mediaType };

      // 👇 This call will now include the 'Authorization' header automatically
      await api.post("/stories", payload);

      onStoryPosted(); // Triggers the refresh in HomePage
      onClose();
    } catch (err) {
      console.error("Failed to create story:", err);
      // Alert user if unauthorized or other error
      if (err.response && err.response.status === 401) {
        alert("Session expired. Please log out and log in again.");
      } else {
        alert("Failed to post story. Please try again.");
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/60 z-50 flex justify-center items-center backdrop-blur-sm">
      <div className="bg-white dark:bg-surface w-full max-w-md rounded-xl shadow-2xl overflow-hidden">
        <div className="flex justify-between items-center p-4 border-b dark:border-border">
          <h2 className="text-lg font-bold text-gray-800 dark:text-text-primary">
            Add to your story
          </h2>
          <button
            onClick={onClose}
            className="hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full p-2 transition-colors"
          >
            <XMarkIcon className="h-6 w-6 text-gray-600 dark:text-text-secondary" />
          </button>
        </div>
        <form onSubmit={handleSubmit}>
          <div className="p-4">
            {preview ? (
              <div className="w-full h-80 rounded-lg overflow-hidden bg-black flex items-center justify-center">
                {file.type.startsWith("image") ? (
                  <img
                    src={preview}
                    alt="Preview"
                    className="max-w-full max-h-full object-contain"
                  />
                ) : (
                  <video
                    src={preview}
                    controls
                    className="max-w-full max-h-full"
                  />
                )}
              </div>
            ) : (
              <label
                htmlFor="story-file-upload"
                className="w-full h-80 bg-gray-50 dark:bg-background border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg flex flex-col justify-center items-center cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
              >
                <PhotoIcon className="h-16 w-16 text-gray-400" />
                <p className="text-gray-500 mt-2 font-medium">
                  Select a photo or video
                </p>
              </label>
            )}
            <input
              type="file"
              id="story-file-upload"
              accept="image/*,video/*"
              onChange={handleFileChange}
              className="hidden"
            />
          </div>
          <div className="p-4 border-t dark:border-border bg-gray-50 dark:bg-background/50">
            <button
              type="submit"
              disabled={isSubmitting || !file}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 rounded-xl disabled:bg-blue-300 dark:disabled:bg-blue-900/50 disabled:cursor-not-allowed transition-all shadow-md"
            >
              {isSubmitting ? "Uploading..." : "Share to Story"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateStoryModal;
