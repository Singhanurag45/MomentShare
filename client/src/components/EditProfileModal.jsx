import { useState, useRef } from "react";
import { XMarkIcon } from "@heroicons/react/24/solid";
import api from "../services/api";

// Helper function to convert an image file to a Base64 string for the API
const toBase64 = (file) =>
  new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result);
    reader.onerror = (error) => reject(error);
  });

const EditProfileModal = ({ user, onClose, onProfileUpdate }) => {
  // State for all form fields, initialized with the current user's data
  const [fullName, setFullName] = useState(user.fullName || "");
  const [country, setCountry] = useState(user.country || "");
  const [bio, setBio] = useState(user.bio || "");

  // State for image handling and form submission status
  const [preview, setPreview] = useState(user.profilePicture);
  const [selectedFile, setSelectedFile] = useState(null);
  const [isSaving, setIsSaving] = useState(false);
  const fileInputRef = useRef(null);

  // Updates the image preview when a new file is selected
  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setSelectedFile(file);
      setPreview(URL.createObjectURL(file));
    }
  };

  // Handles the form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSaving(true);
    try {
      // Step 1: Update the picture if a new one was selected
      if (selectedFile) {
        const imageBase64 = await toBase64(selectedFile);
        await api.put("/users/picture", { image: imageBase64 });
      }

      // Step 2: Update the text-based details
      const detailsPayload = { bio, fullName, country };
      await api.put("/users/details", detailsPayload);

      // Step 3: Signal the profile page to refetch the updated data and close the modal
      onProfileUpdate();
      onClose();
    } catch (error) {
      console.error("Failed to update profile:", error);
      alert("There was an error updating your profile. Please try again.");
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/60 z-50 flex justify-center items-center p-4">
      <div className="bg-white w-full max-w-lg rounded-xl shadow-xl">
        <div className="flex justify-between items-center p-4 border-b">
          <h2 className="text-xl font-bold">Edit Profile</h2>
          <button
            onClick={onClose}
            className="hover:bg-gray-100 rounded-full p-2"
          >
            <XMarkIcon className="h-6 w-6" />
          </button>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="p-6 space-y-6 max-h-[70vh] overflow-y-auto">
            {/* --- Profile Picture Section --- */}
            <div className="flex items-center space-x-6">
              <img
                src={preview}
                alt="Profile"
                className="w-20 h-20 rounded-full object-cover"
              />
              <div>
                <p className="font-semibold text-lg">{user.username}</p>
                <button
                  type="button"
                  onClick={() => fileInputRef.current.click()}
                  className="text-sm font-semibold text-blue-500 hover:text-blue-700"
                >
                  Change Photo
                </button>
                <input
                  type="file"
                  accept="image/*"
                  ref={fileInputRef}
                  onChange={handleFileChange}
                  className="hidden"
                />
              </div>
            </div>

            <div>
              <label
                htmlFor="fullName"
                className="block text-sm font-medium text-gray-700"
              >
                Full Name
              </label>
              <input
                type="text"
                id="fullName"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
                placeholder="Your full name"
              />
            </div>

            {/* --- Country Input --- */}
            <div>
              <label
                htmlFor="country"
                className="block text-sm font-medium text-gray-700"
              >
                Country
              </label>
              <input
                type="text"
                id="country"
                value={country}
                onChange={(e) => setCountry(e.target.value)}
                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
                placeholder="Your country"
              />
            </div>

            {/* --- Bio Input --- */}
            <div>
              <label
                htmlFor="bio"
                className="block text-sm font-medium text-gray-700"
              >
                Bio
              </label>
              <textarea
                id="bio"
                rows={3}
                value={bio}
                onChange={(e) => setBio(e.target.value)}
                maxLength={150}
                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
                placeholder="Tell us about yourself..."
              />
              <p className="text-xs text-gray-400 text-right">
                {bio.length} / 150
              </p>
            </div>

          </div>

          {/* --- Form Actions --- */}
          <div className="px-6 py-4 bg-gray-50 border-t rounded-b-xl text-right">
            <button
              type="submit"
              disabled={isSaving}
              className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded-lg disabled:bg-blue-300 transition-colors"
            >
              {isSaving ? "Saving..." : "Save Changes"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditProfileModal;
