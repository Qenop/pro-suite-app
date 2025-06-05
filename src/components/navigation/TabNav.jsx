//src\components\navigation\TabNav.jsx
import React, { useState, useEffect } from "react";
import { NavLink } from "react-router-dom";
import { Menu } from "lucide-react";

const allTabs = [
  { name: "Overview", path: "overview", roles: ["admin"] },
  { name: "Edit Property", path: "edit", roles: ["admin"] },
  { name: "Units", path: "units", roles: ["admin"] },
  { name: "Tenants", path: "tenants", roles: ["admin"] },
  { name: "Water Readings", path: "water-readings", roles: ["admin", "caretaker"] },
  { name: "Billings", path: "billings", roles: ["admin"] },
  { name: "Invoices", path: "invoices", roles: ["admin"] },
  { name: "Payments", path: "payments", roles: ["admin"] },
  { name: "Expenses", path: "expenses", roles: ["admin", "landlord"] },
  { name: "Reports", path: "reports", roles: ["admin", "landlord"] },
  { name: "Requests", path: "requests", roles: ["admin" ] },
  { name: "Users", path: "users", roles: ["admin"] },
];

const TabNav = ({ propertyId }) => {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [userRole, setUserRole] = useState(null);

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      try {
        const parsedUser = JSON.parse(storedUser);
        setUserRole(parsedUser.role);
      } catch {
        console.error("Invalid user data in localStorage");
      }
    }
  }, []);

  const visibleTabs = allTabs.filter((tab) => tab.roles.includes(userRole));

  return (
    <div className="sticky top-0 bg-white z-10 border-b shadow-sm">
      {/* Mobile dropdown toggle */}
      <div className="md:hidden flex justify-between items-center p-2">
        <h3 className="text-lg font-semibold">Navigation</h3>
        <button onClick={() => setMobileOpen(!mobileOpen)} className="p-1">
          <Menu className="w-6 h-6" />
        </button>
      </div>

      {/* Mobile dropdown menu */}
      {mobileOpen && (
        <div className="md:hidden border-t">
          {visibleTabs.map((tab) => (
            <NavLink
              key={tab.path}
              to={`/properties/${propertyId}/${tab.path}`}
              className={({ isActive }) =>
                `block px-4 py-2 text-sm ${isActive ? "text-blue-600 font-medium" : "text-gray-700"}`
              }
              onClick={() => setMobileOpen(false)}
            >
              {tab.name}
            </NavLink>
          ))}
        </div>
      )}

      {/* Horizontal scrollable tab bar */}
      <div className="hidden md:flex overflow-x-auto whitespace-nowrap border-t">
        {visibleTabs.map((tab) => (
          <NavLink
            key={tab.path}
            to={`/properties/${propertyId}/${tab.path}`}
            className={({ isActive }) =>
              `px-4 py-3 text-sm font-medium border-b-2 ${
                isActive ? "border-blue-600 text-blue-600" : "border-transparent text-gray-600 hover:text-black"
              }`
            }
          >
            {tab.name}
          </NavLink>
        ))}
      </div>
    </div>
  );
};

export default TabNav;

