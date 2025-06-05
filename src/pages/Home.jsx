import React from 'react';
import { Link } from 'react-router-dom';

const Home = () => {
  const isLoggedIn = !!localStorage.getItem('token');

  return (
    <div
      className="relative min-h-screen bg-cover bg-center bg-no-repeat"
      style={{ backgroundImage: "url('/assets/pro.jpg')" }} // Use public/assets folder
    >
      {/* Dark overlay */}
      <div className="absolute inset-0 bg-gray-400 bg-opacity-80" />

      {/* Content Card */}
      <div className="relative z-10 flex items-center justify-center min-h-screen px-4">
        <div className="bg-white bg-opacity-90 backdrop-blur-md shadow-2xl rounded-2xl p-10 max-w-md w-full text-center">
          <h2 className="text-4xl font-extrabold text-indigo-700 mb-4">Welcome to ProSuite</h2>
          <p className="text-gray-900 mb-6">
            {isLoggedIn ? 'You are logged in.' : 'Please log in to access your dashboard.'}
          </p>

          <div className="flex flex-col sm:flex-row justify-center items-center gap-4">
            <Link
              to="/login"
              className="w-full sm:w-auto bg-orange-500 text-white px-6 py-3 rounded-xl hover:bg-blue-500 transition-all shadow-md"
            >
              Manage
            </Link>
            <Link
              to="/selling"
              className="w-full sm:w-auto bg-gray-300 text-gray-900 px-6 py-3 rounded-xl hover:bg-cyan-600 transition-all shadow-md"
            >
              Selling
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;
