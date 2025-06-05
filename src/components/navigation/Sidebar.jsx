//src\components\navigation\Sidebar.jsx
import React from "react";
import { NavLink } from "react-router-dom";

const Sidebar = ({ isOpen, toggleSidebar }) => {
  const navItems = [
    { to: "/dashboard", label: "🧭 Dashboard" },
    { to: "/properties", label: "🏘 Properties" },
    { to: "/tenants", label: "👥 Tenants" },
    { to: "/assign-tenant", label: "📝 Assign Tenant" },
    { to: "/create-property", label: "🏢 Add Property" },
    { to: "/users", label: "👤 Users" },
  ];

  return (
    <>
      {/* Overlay (mobile only) */}
      {isOpen && (
        <div
          className="fixed inset-0 z-40 bg-black bg-opacity-30"
          onClick={toggleSidebar}
        />
      )}

      <aside
        className={`fixed z-50 md:static top-0 left-0 h-full min-h-screen w-64 bg-cyan-800 text-white shadow transition-transform duration-200 ease-in-out
        ${isOpen ? "translate-x-0" : "-translate-x-full"} md:translate-x-0 md:flex md:flex-col p-4`}
      >
        <h2 className="text-xl font-bold text-white mb-6">MENU</h2>
        <nav className="flex flex-col space-y-2">
          {navItems.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              onClick={toggleSidebar}
              className={({ isActive }) =>
                `flex items-center gap-2 px-3 py-2 rounded transition ${
                  isActive
                    ? "bg-white text-blue-700 font-semibold"
                    : "hover:bg-gray-950"
                }`
              }
            >
              {item.label}
            </NavLink>
          ))}
        </nav>
      </aside>
    </>
  );
};

export default Sidebar;
