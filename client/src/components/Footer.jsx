import React from "react";

const Footer = () => {
  return (
    <footer className="mt-8 px-4 pb-6">
      
      {/* Links Row */}
      <div className="flex flex-wrap justify-center gap-4 text-xs font-medium text-gray-400 dark:text-gray-500 mb-4">
        <a href="#" className="hover:text-gray-600 dark:hover:text-gray-300 transition-colors">About</a>
        <a href="#" className="hover:text-gray-600 dark:hover:text-gray-300 transition-colors">Privacy</a>
        <a href="#" className="hover:text-gray-600 dark:hover:text-gray-300 transition-colors">Terms</a>
        <a href="#" className="hover:text-gray-600 dark:hover:text-gray-300 transition-colors">Help</a>
      </div>

      {/* Copyright & Dev Credit */}
      <div className="text-center space-y-1">
        <p className="text-xs text-gray-400 dark:text-gray-600">
          © 2025 MomentShare • All rights reserved.
        </p>
        <p className="text-xs text-gray-500 dark:text-gray-500">
          Developed by{" "}
          <a
            href="https://www.linkedin.com/in/anurag-singh-9598b4207/"
            target="_blank"
            rel="noopener noreferrer"
            className="font-semibold text-blue-500 hover:text-blue-600 dark:hover:text-blue-400 hover:underline transition-colors"
          >
            Anurag Singh
          </a>
        </p>
      </div>
    </footer>
  );
};

export default Footer;