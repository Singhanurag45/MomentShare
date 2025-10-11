import { useState } from "react";
import { PhotoIcon, XMarkIcon } from "@heroicons/react/24/solid";
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
      await api.post("/stories", payload);

      onStoryPosted(); // Signal to refresh stories
      onClose();
    } catch (err) {
      console.error("Failed to create story:", err);
      alert("Failed to post story. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/60 z-50 flex justify-center items-center">
      <div className="bg-white dark:bg-surface w-full max-w-md rounded-xl">
        <div className="flex justify-between items-center p-4 border-b dark:border-border">
          <h2 className="text-lg font-bold text-gray-800 dark:text-text-primary">
            Add to your story
          </h2>
          <button
            onClick={onClose}
            className="hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full p-2"
          >
            <XMarkIcon className="h-6 w-6 text-gray-600 dark:text-text-secondary" />
          </button>
        </div>
        <form onSubmit={handleSubmit}>
          <div className="p-4">
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
              <label
                htmlFor="story-file-upload"
                className="w-full h-80 bg-gray-100 dark:bg-background border-2 border-dashed rounded-lg flex flex-col justify-center items-center cursor-pointer"
              >
                <PhotoIcon className="h-16 w-16 text-gray-400" />
                <p className="text-gray-500 mt-2">Select a photo or video</p>
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
          <div className="p-4 border-t dark:border-border">
            <button
              type="submit"
              disabled={isSubmitting || !file}
              // ✨ CHANGE THIS LINE
              className="w-full bg-blue-500 hover:bg-blue-600 text-white font-bold py-2.5 rounded-lg disabled:bg-blue-300 disabled:cursor-not-allowed transition-colors"
            >
              {isSubmitting ? "Sharing..." : "Share to Story"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateStoryModal;
