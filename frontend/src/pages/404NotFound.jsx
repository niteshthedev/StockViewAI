import React from "react";
import { useNavigate } from "react-router-dom";

const NotFound = () => {
  const navigate = useNavigate();

  const handleGoHome = () => {
    navigate("/"); // Navigate back to home page
  };

  return (
    <div className="flex justify-center items-center h-screen bg-transparent text-secondary">
      <div className="p-6 max-w-lg mx-auto bg-white shadow-lg rounded-lg backdrop-blur-md">
        <h1 className="text-5xl font-bold text-secondary">404</h1>
        <h2 className="text-2xl mt-4">Oops! Page Not Found</h2>
        <p className="mt-2 text-gray-600">
          The page you're looking for doesn't exist. It might have been moved or
          deleted.
        </p>
        <button
          onClick={handleGoHome}
          className="mt-4 px-6 py-2 bg-secondary text-white rounded-lg hover:bg-secondary-dark transition"
        >
          Go to Homepage
        </button>
      </div>
    </div>
  );
};

export default NotFound;
