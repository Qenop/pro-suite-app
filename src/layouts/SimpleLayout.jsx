// src/layouts/SimpleLayout.jsx
import React from "react";
import { Link, Outlet } from 'react-router-dom';
import { logout } from '../utils/logout';

const SimpleLayout = () => {
  return (
    <div className="min-h-screen flex flex-col">
      {/* Sticky Header */}
            <header className="sticky top-0 z-50 bg-white shadow px-6 py-4 flex justify-between items-center">
              <h1 className="text-xl font-bold text-blue-600">PRO SUITE</h1>
              {localStorage.getItem('token') ? (
                <button
                  onClick={logout}
                  className="bg-orange-500 text-white px-4 py-2 rounded hover:bg-indigo-600 transition"
                >
                  Logout
                </button>
              ) : (
                <Link to="/login">
                  <button className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition">
                    Login
                  </button>
                </Link>
              )}
            </header>

      <main className="flex-grow p-4 bg-gray-50">
        <Outlet />
      </main>

      <footer className="bg-white border-t">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6 px-6 py-8 text-md text-black">
          <div>
            <h4 className="font-bold text-blue-800 mb-2">Company</h4>
            <ul className="space-y-1">
              <li><Link to="#" className="hover:underline">About</Link></li>
              <li><Link to="#" className="hover:underline">Careers</Link></li>
              <li><Link to="#" className="hover:underline">Contact</Link></li>
            </ul>
          </div>
          <div>
            <h4 className="font-bold text-blue-800 mb-2">Product</h4>
            <ul className="space-y-1">
              <li><Link to="#" className="hover:underline">Features</Link></li>
              <li><Link to="#" className="hover:underline">Pricing</Link></li>
              <li><Link to="#" className="hover:underline">Documentation</Link></li>
            </ul>
          </div>
          <div>
            <h4 className="font-bold text-blue-800 mb-2">Support</h4>
            <ul className="space-y-1">
              <li><Link to="#" className="hover:underline">Help Center</Link></li>
              <li><Link to="#" className="hover:underline">Terms</Link></li>
              <li><Link to="#" className="hover:underline">Privacy</Link></li>
            </ul>
          </div>
          <div>
            <h4 className="font-bold text-blue-800 mb-2">Connect</h4>
            <ul className="space-y-1">
              <li><Link to="#" className="hover:underline">Facebook</Link></li>
              <li><Link to="#" className="hover:underline">Twitter</Link></li>
              <li><Link to="#" className="hover:underline">Instagram</Link></li>
            </ul>
          </div>
        </div>
        <div className="border-t text-center py-4 text-sm text-black">
          Copyright © {new Date().getFullYear()} ProSuite. All rights reserved.
        </div>
      </footer>
    </div>
  );
};

export default SimpleLayout;
