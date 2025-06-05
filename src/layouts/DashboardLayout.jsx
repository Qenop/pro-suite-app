//src\layouts\DashboardLayout.jsx
import React, { useState } from "react";
import Sidebar from "../components/navigation/Sidebar";
import { Outlet } from "react-router-dom";

const DashboardLayout = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const toggleSidebar = () => setIsSidebarOpen(!isSidebarOpen);

  return (
    <div className="flex min-h-screen">
      <Sidebar isOpen={isSidebarOpen} toggleSidebar={toggleSidebar} />

      <div className="flex-1 flex flex-col">
        {/* Header */}
        <header className="sticky top-0 z-50 bg-white shadow px-6 py-4 flex justify-between items-center">
          <div className="flex items-center gap-4">
            {/* Hamburger for mobile */}
            <button
              onClick={toggleSidebar}
              className="md:hidden p-2 rounded hover:bg-gray-100"
            >
              <svg className="w-6 h-6 text-gray-700" fill="none" stroke="currentColor" strokeWidth={2}
                   viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round"
                      d="M4 6h16M4 12h16M4 18h16"/>
              </svg>
            </button>
            <h1 className="text-xl font-bold">
              <span className="text-gray-900">PRO</span>{' '}
              <span className="text-indigo-600">SUITE</span>
            </h1>
          </div>

          <button
            onClick={() => {
              localStorage.removeItem("token");
              window.location.href = "/home";
            }}
            className="bg-orange-500 text-white px-4 py-2 rounded hover:bg-cyan-800 transition"
          >
            Logout
          </button>
        </header>

        {/* Main Content */}
        <main className="flex-grow bg-gray-50 p-4">
          <Outlet />
        </main>

        {/* Footer */}
        <footer className="bg-white border-t">
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6 px-6 py-8 text-md text-gray-900">
            {/* Same 4-column structure */}
            <div>
              <h4 className="font-bold text-indigo-800 mb-2">Company</h4>
              <ul className="space-y-1">
                <li><a href="#">About</a></li>
                <li><a href="#">Careers</a></li>
                <li><a href="#">Contact</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-bold text-indigo-800 mb-2">Product</h4>
              <ul className="space-y-1">
                <li><a href="#">Features</a></li>
                <li><a href="#">Pricing</a></li>
                <li><a href="#">Documentation</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-bold text-indigo-800 mb-2">Support</h4>
              <ul className="space-y-1">
                <li><a href="#">Help Center</a></li>
                <li><a href="#">Terms</a></li>
                <li><a href="#">Privacy</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-bold text-indigo-800 mb-2">Connect</h4>
              <ul className="space-y-1">
                <li><a href="#">Facebook</a></li>
                <li><a href="#">Twitter</a></li>
                <li><a href="#">Instagram</a></li>
              </ul>
            </div>
          </div>
          <div className="border-t text-center py-4 text-md text-black">
            Copyright &copy; {new Date().getFullYear()} ProSuite. All rights reserved.
          </div>
        </footer>
      </div>
    </div>
  );
};

export default DashboardLayout;
