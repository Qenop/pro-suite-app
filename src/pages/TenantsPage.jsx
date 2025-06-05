//src\pages\TenantsPage.jsx
import React, { useState, useEffect } from 'react';
import axios from '../api/axiosInstance';
import { useNavigate } from 'react-router-dom';

const TenantsPage = () => {
  const [tenants, setTenants] = useState([]);
  const [properties, setProperties] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [search, setSearch] = useState('');
  const [unitSearch, setUnitSearch] = useState('');
  const [filter, setFilter] = useState({ propertyId: '' });
  const navigate = useNavigate();

  // Fetch tenants based on filters
  useEffect(() => {
    const fetchTenants = async () => {
      try {
        setLoading(true);

        const query = `?search=${search}&propertyId=${filter.propertyId}&unitId=${unitSearch}`;
        const res = await axios.get(`/tenants${query}`);

        const propertyMap = {};
        properties.forEach((p) => {
          propertyMap[p._id] = p.name;
        });

        const enrichedTenants = res.data.map((tenant) => ({
          ...tenant,
          propertyName: propertyMap[tenant.propertyId] || '—',
        }));

        setTenants(enrichedTenants);
      } catch (err) {
        console.error('Error fetching tenants:', err);
        setError('Failed to load tenants.');
      } finally {
        setLoading(false);
      }
    };

    if (properties.length > 0) fetchTenants();
  }, [search, filter, unitSearch, properties]);

  // Fetch properties for filter dropdown
  useEffect(() => {
    const fetchProperties = async () => {
      try {
        const res = await axios.get('/properties');
        setProperties(res.data);
      } catch (err) {
        console.error('Error fetching properties:', err);
      }
    };
    fetchProperties();
  }, []);

  return (
    <div className="container mx-auto p-4">
      <div className="mb-4 flex justify-between items-center">
        <h1 className="text-xl font-bold">All Tenants</h1>
        <button
          onClick={() => navigate('/assign-tenant')}
          className="bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded"
        >
          + Add Tenant
        </button>
      </div>

      <div className="mb-4 flex gap-4">
        <input
          type="text"
          placeholder="Search by Name..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="border p-2 rounded w-full max-w-xs"
        />
        <input
          type="text"
          placeholder="Search by Unit ID"
          value={unitSearch}
          onChange={(e) => setUnitSearch(e.target.value)}
          className="border p-2 rounded w-full max-w-xs"
        />

        <select
          value={filter.propertyId}
          onChange={(e) => setFilter({ ...filter, propertyId: e.target.value })}
          className="border p-2 rounded"
        >
          <option value="">All Properties</option>
          {properties.map((prop) => (
            <option key={prop._id} value={prop._id}>
              {prop.propertyName|| prop._id}
            </option>
          ))}
        </select>
      </div>

      {loading ? (
        <p>Loading tenants...</p>
      ) : error ? (
        <p className="text-red-500">{error}</p>
      ) : (
        <table className="min-w-full table-auto border-collapse">
          <thead>
            <tr>
              <th className="border p-2">Name</th>
              <th className="border p-2">Phone</th>
              <th className="border p-2">Unit</th>
              <th className="border p-2 text-center">Action</th>
            </tr>
          </thead>
          <tbody>
            {tenants.length === 0 ? (
              <tr>
                <td colSpan="4" className="text-center p-4">
                  No tenants found.
                </td>
              </tr>
            ) : (
              tenants.map((tenant) => (
                <tr key={tenant._id}>
                <td className="border p-2">{tenant.name}</td>
                <td className="border p-2">{tenant.phone}</td>
                <td className="border p-2">{tenant.unitId}</td>
                <td className="border p-2 text-center">
                  <div className="flex justify-center space-x-2">
                    <button
                      onClick={() => navigate(`/tenants/${tenant._id}`)}
                      className="bg-gray-950 hover:bg-orange-400 text-white py-1 px-3 rounded"
                    > 👤
                      Profile
                    </button>
                  </div>
                </td>
              </tr>
              ))
            )}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default TenantsPage;
