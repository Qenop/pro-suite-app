//src\pages\tabs\UsersTab.jsx
import { useCallback, useEffect, useState } from 'react';
import axios from '../../api/axiosInstance';
import UserForm from '../../forms/UserForm';
import { useOutletContext } from 'react-router-dom';

const UsersTab = () => {
  const { property } = useOutletContext(); // 👈 Gets property from context
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [showForm, setShowForm] = useState(false);

  const fetchUsers = useCallback(async () => {
    if (!property?._id) return;
    setLoading(true);
    setError('');
    try {
      const res = await axios.get(`/users/by-property/${property._id}`);
      setUsers(res.data);
    } catch  {
      setError('Failed to load users for this property.');
    } finally {
      setLoading(false);
    }
  }, [property]);

  useEffect(() => {
    fetchUsers();
  }, [fetchUsers]);

  const handleUserCreated = () => {
    fetchUsers();
    setShowForm(false);
  };

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-semibold">Users for {property.propertyName}</h2>
        <button
          onClick={() => setShowForm((prev) => !prev)}
          className="px-4 py-2 bg-cyan-700 text-white rounded hover:bg-black"
        >
          {showForm ? 'Cancel' : 'Add User'}
        </button>
      </div>

      {/* Form Section */}
      <div
        style={{
          maxHeight: showForm ? '1000px' : '0',
          overflow: 'hidden',
          transition: 'max-height 0.5s ease',
        }}
      >
        {showForm && (
          <UserForm onSuccess={handleUserCreated} defaultPropertyId={property._id} />
        )}
      </div>

      {/* Error/Loading */}
      {loading && <p>Loading users...</p>}
      {error && <p className="text-red-600">{error}</p>}

      {/* Users Table */}
      {!loading && !error && (
        <table className="min-w-full border border-gray-300 rounded shadow mt-4">
          <thead className="bg-gray-100">
            <tr>
              <th className="p-2 border">Full Name</th>
              <th className="p-2 border">Email</th>
              <th className="p-2 border">Phone</th>
              <th className="p-2 border">Role</th>
              <th className="p-2 border">Actions</th>
            </tr>
          </thead>
          <tbody>
            {users.length === 0 && (
              <tr>
                <td colSpan="5" className="p-4 text-center text-gray-500">
                  No users assigned to this property.
                </td>
              </tr>
            )}
            {users.map((user) => (
              <tr key={user._id} className="hover:bg-gray-50">
                <td className="p-2 border">{user.fullName}</td>
                <td className="p-2 border">{user.email}</td>
                <td className="p-2 border">{user.phone}</td>
                <td className="p-2 border capitalize">{user.role}</td>
                <td className="p-2 border space-x-2">
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

export default UsersTab;
