//src\pages\UsersPage.jsx
import { useState, useEffect } from 'react';
import axios from '../api/axiosInstance';
import UserForm from '../forms/UserForm';

const UsersPage = () => {
  const [showForm, setShowForm] = useState(false);
  const [users, setUsers] = useState([]);
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // Filters state
  const [filterName, setFilterName] = useState('');
  const [filterRole, setFilterRole] = useState('');
  const [filterProperty, setFilterProperty] = useState('');

  // Fetch all users with property populated
  const fetchUsers = async () => {
    setLoading(true);
    setError('');
    try {
      const res = await axios.get('/users');
      setUsers(res.data);
      setFilteredUsers(res.data); // initial filtered list = all users
    } catch {
      setError('Failed to load users');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  // Filter users when any filter changes or users change
  useEffect(() => {
    let filtered = users;

    if (filterName.trim() !== '') {
      filtered = filtered.filter((u) =>
        u.fullName.toLowerCase().includes(filterName.toLowerCase())
      );
    }

    if (filterRole !== '') {
      filtered = filtered.filter((u) => u.role === filterRole);
    }

    if (filterProperty !== '') {
      filtered = filtered.filter(
        (u) => u.propertyId && u.propertyId.propertyName === filterProperty
      );
    }

    setFilteredUsers(filtered);
  }, [filterName, filterRole, filterProperty, users]);

  // Unique roles & properties for filters
  const uniqueRoles = Array.from(new Set(users.map((u) => u.role))).filter(Boolean);
  const uniqueProperties = Array.from(
    new Set(users.map((u) => u.propertyId?.propertyName).filter(Boolean))
  );

  // Callback after user creation to refresh list and close form
  const handleUserCreated = () => {
    fetchUsers();
    setShowForm(false);
  };

  return (
    <div className="max-w-6xl mx-auto p-6">
      <h1 className="text-2xl font-semibold mb-4">Users Management</h1>

      <button
        onClick={() => setShowForm((prev) => !prev)}
        className="mb-4 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition"
      >
        {showForm ? 'Cancel' : 'Add User'}
      </button>

      {/* Slide down animation for form */}
      <div
        style={{
          maxHeight: showForm ? '1000px' : '0',
          overflow: 'hidden',
          transition: 'max-height 0.5s ease',
        }}
      >
        {showForm && <UserForm onSuccess={handleUserCreated} />}
      </div>

      {/* Filters */}
      <div className="flex flex-wrap gap-4 mb-4">
        <input
          type="text"
          placeholder="Filter by user name"
          value={filterName}
          onChange={(e) => setFilterName(e.target.value)}
          className="border border-gray-300 rounded px-3 py-2 flex-grow min-w-[200px]"
        />

        <select
          value={filterRole}
          onChange={(e) => setFilterRole(e.target.value)}
          className="border border-gray-300 rounded px-3 py-2"
        >
          <option value="">All Roles</option>
          {uniqueRoles.map((role) => (
            <option key={role} value={role}>
              {role.charAt(0).toUpperCase() + role.slice(1)}
            </option>
          ))}
        </select>

        <select
          value={filterProperty}
          onChange={(e) => setFilterProperty(e.target.value)}
          className="border border-gray-300 rounded px-3 py-2"
        >
          <option value="">All Properties</option>
          {uniqueProperties.map((property) => (
            <option key={property} value={property}>
              {property}
            </option>
          ))}
        </select>
      </div>

      {loading && <p>Loading users...</p>}
      {error && <p className="text-red-600">{error}</p>}

      {!loading && !error && (
        <table className="min-w-full border border-gray-300 rounded shadow">
          <thead className="bg-gray-100">
            <tr>
              <th className="p-2 border border-gray-300">Full Name</th>
              <th className="p-2 border border-gray-300">Email</th>
              <th className="p-2 border border-gray-300">Phone</th>
              <th className="p-2 border border-gray-300">Role</th>
              <th className="p-2 border border-gray-300">Assigned Property</th>
              <th className="p-2 border border-gray-300">Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredUsers.length === 0 && (
              <tr>
                <td colSpan="6" className="p-4 text-center text-gray-500">
                  No users found.
                </td>
              </tr>
            )}
            {filteredUsers.map((user) => (
              <tr key={user._id} className="hover:bg-gray-50">
                <td className="p-2 border border-gray-300">{user.fullName}</td>
                <td className="p-2 border border-gray-300">{user.email}</td>
                <td className="p-2 border border-gray-300">{user.phone}</td>
                <td className="p-2 border border-gray-300 capitalize">{user.role}</td>
                <td className="p-2 border border-gray-300">
                  {user.propertyId ? user.propertyId.propertyName || 'N/A' : 'N/A'}
                </td>
                <td className="p-2 border border-gray-300 space-x-2">
                  <button className="text-sm text-blue-600 hover:underline">Edit</button>
                  <button className="text-sm text-red-600 hover:underline">Delete</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default UsersPage;
