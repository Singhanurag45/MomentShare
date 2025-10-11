import React from "react";

const Footer = () => {
  return (
    <footer className="text-xs text-gray-500 dark:text-text-secondary text-center mt-8 space-y-2">
      <p>© 2025 MomentShare • All rights reserved.</p>
      <p>
        Developed by{" "}
        <a
          href="https://www.linkedin.com/in/anurag-singh-9598b4207/"
          target="_blank"
          rel="noopener noreferrer"
          className="font-semibold text-primary hover:underline"
        >
          Anurag Singh
        </a>
      </p>
    </footer>
  );
};

export default Footer;
