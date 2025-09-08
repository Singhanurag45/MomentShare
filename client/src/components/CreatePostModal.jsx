import { useState } from "react";
import { PhotoIcon, XMarkIcon } from "@heroicons/react/24/solid";
import api from "../services/api";
import UserAvatar from "./UserAvatar";

const CreatePostModal = ({ user, onClose }) => {
  const [caption, setCaption] = useState("");
  const [file, setFile] = useState(null);
  const [preview, setPreview] = useState(null);
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [aiSuggestions, setAiSuggestions] = useState(null);
  const [isAiLoading, setIsAiLoading] = useState(false);
  const [aiError, setAiError] = useState("");

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile) {
      setFile(selectedFile);
      setPreview(URL.createObjectURL(selectedFile));
      setAiSuggestions(null);
      setAiError("");
    }
  };

  const toBase64 = (file) =>
    new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result);
      reader.onerror = (error) => reject(error);
    });

  const handleGetAiSuggestions = async () => {
    if (!file || !file.type.startsWith("image")) {
      setError("AI suggestions are only available for images.");
      return;
    }

    setError("");
    setAiError("");
    setIsAiLoading(true);

    try {
      const mediaFileBase64 = await toBase64(file);
      const cleanBase64 = mediaFileBase64.includes(",")
        ? mediaFileBase64.split(",")[1]
        : mediaFileBase64;

      const { data } = await api.post("/ai/generate-captions", {
        imageBase64: cleanBase64,
        mimeType: file.type,
      });

      setAiSuggestions(data);
    } catch (err) {
      console.error("Failed to get AI suggestions:", err);

      if (err?.response?.status === 429) {
        setAiError(
          "AI suggestions are temporarily rate limited. Please try again in a moment."
        );
      } else {
        setAiError(
          "Could not fetch AI suggestions right now. Please try again."
        );
      }
    } finally {
      setIsAiLoading(false);
    }
  };

  const handleApplyCaption = (text) => {
    if (!text) return;
    setCaption(text);
  };

  const handleApplyCaptionWithHashtags = (captionText) => {
    if (!captionText || !aiSuggestions?.hashtags?.length) {
      handleApplyCaption(captionText);
      return;
    }

    const hashtagsLine = aiSuggestions.hashtags.join(" ");
    handleApplyCaption(`${captionText}\n\n${hashtagsLine}`);
  };

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

            {preview && file?.type?.startsWith("image") && (
              <div className="flex flex-col gap-3">
                <button
                  type="button"
                  onClick={handleGetAiSuggestions}
                  disabled={isAiLoading}
                  className="w-full flex items-center justify-center gap-2 bg-purple-600 hover:bg-purple-700 text-white font-semibold py-2.5 px-4 rounded-xl disabled:bg-purple-300 dark:disabled:bg-purple-900/40 disabled:cursor-not-allowed transition-all shadow-sm hover:shadow-md"
                >
                  {isAiLoading && (
                    <span className="h-4 w-4 border-2 border-white/60 border-t-transparent rounded-full animate-spin" />
                  )}
                  <span>
                    {isAiLoading ? "Getting AI suggestions..." : "Get AI Suggestions"}
                  </span>
                </button>

                {aiError && (
                  <p className="text-red-500 text-xs text-center font-medium bg-red-50 dark:bg-red-900/10 py-1.5 px-2 rounded-lg">
                    {aiError}
                  </p>
                )}

                {aiSuggestions && (
                  <div className="space-y-2">
                    <p className="text-xs font-semibold text-gray-500 dark:text-text-secondary">
                      AI caption suggestions
                    </p>
                    <div className="flex flex-wrap gap-2">
                      {aiSuggestions.captions?.heartfelt && (
                        <button
                          type="button"
                          onClick={() =>
                            handleApplyCaptionWithHashtags(
                              aiSuggestions.captions.heartfelt
                            )
                          }
                          className="px-3 py-1.5 text-xs rounded-full border border-purple-200 dark:border-purple-800 bg-purple-50 dark:bg-purple-900/30 text-purple-800 dark:text-purple-100 hover:bg-purple-100 dark:hover:bg-purple-900/60 transition"
                        >
                          Heartfelt: {aiSuggestions.captions.heartfelt}
                        </button>
                      )}
                      {aiSuggestions.captions?.funny && (
                        <button
                          type="button"
                          onClick={() =>
                            handleApplyCaptionWithHashtags(
                              aiSuggestions.captions.funny
                            )
                          }
                          className="px-3 py-1.5 text-xs rounded-full border border-purple-200 dark:border-purple-800 bg-purple-50 dark:bg-purple-900/30 text-purple-800 dark:text-purple-100 hover:bg-purple-100 dark:hover:bg-purple-900/60 transition"
                        >
                          Funny: {aiSuggestions.captions.funny}
                        </button>
                      )}
                      {aiSuggestions.captions?.short && (
                        <button
                          type="button"
                          onClick={() =>
                            handleApplyCaptionWithHashtags(
                              aiSuggestions.captions.short
                            )
                          }
                          className="px-3 py-1.5 text-xs rounded-full border border-purple-200 dark:border-purple-800 bg-purple-50 dark:bg-purple-900/30 text-purple-800 dark:text-purple-100 hover:bg-purple-100 dark:hover:bg-purple-900/60 transition"
                        >
                          Short: {aiSuggestions.captions.short}
                        </button>
                      )}
                    </div>

                    {aiSuggestions.hashtags?.length > 0 && (
                      <div className="space-y-1">
                        <p className="text-xs font-semibold text-gray-500 dark:text-text-secondary">
                          Hashtags
                        </p>
                        <div className="flex flex-wrap gap-1.5">
                          {aiSuggestions.hashtags.slice(0, 8).map((tag, idx) => (
                            <button
                              key={idx}
                              type="button"
                              onClick={() =>
                                setCaption(
                                  (prev) =>
                                    `${prev ? `${prev.trim()}\n\n` : ""}${tag}`
                                )
                              }
                              className="px-2.5 py-1 text-[11px] rounded-full border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 text-gray-700 dark:text-text-primary hover:bg-gray-100 dark:hover:bg-gray-700 transition"
                            >
                              {tag}
                            </button>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </div>
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
