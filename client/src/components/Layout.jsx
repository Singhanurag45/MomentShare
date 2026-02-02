// client/src/components/Layout.jsx

import { useState } from "react";
import { Outlet, useOutletContext } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import Navbar from "./Navbar";
import CreatePostModal from "./CreatePostModal";

const Layout = () => {
  const { user } = useAuth();
  const [isModalOpen, setIsModalOpen] = useState(false);

  const [refetchTrigger, setRefetchTrigger] = useState(0);

  const handlePostCreated = () => {
    setIsModalOpen(false); 
    setRefetchTrigger((prev) => prev + 1); 
  };

  return (
    <>
      {isModalOpen && (
        <CreatePostModal
          user={user}
          onClose={() => setIsModalOpen(false)}
          onPostCreated={handlePostCreated}
        />
      )}

      <div className="bg-gray-50 dark:bg-background min-h-screen">
        <Navbar onOpenCreatePostModal={() => setIsModalOpen(true)} />
        <main className="max-w-7xl mx-auto pt-20 px-4">
          <Outlet
            context={{
              openCreatePostModal: () => setIsModalOpen(true),
              refetchTrigger,
            }}
          />
        </main>
      </div>
    </>
  );
};

export default Layout;
