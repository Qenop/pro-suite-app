// src\pages\tabs\TenantsTab.jsx
import React, { useEffect, useState } from "react";
import { useOutletContext } from "react-router-dom";
import axios from '../../api/axiosInstance';
import { Link } from "react-router-dom";
import PropertyTenantForm from "../../forms/PropertyTenantForm"; // adjust path if needed

const TenantsTab = () => {
  const { property } = useOutletContext();
  const [tenants, setTenants] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [showForm, setShowForm] = useState(false);
  const [refreshFlag, setRefreshFlag] = useState(false);

  const [searchName, setSearchName] = useState("");
  const [unitFilter, setUnitFilter] = useState("");

  useEffect(() => {
    const fetchTenants = async () => {
      try {
        const res = await axios.get(`/tenants?propertyId=${property._id}`);
        setTenants(res.data);
        setError("");
      } catch (err) {
        console.error("Failed to fetch tenants:", err);
        setError("Failed to load tenants for this property.");
      } finally {
        setLoading(false);
      }
    };

    fetchTenants();
  }, [property._id, refreshFlag]);

  const handleDeleteTenant = async (tenantId) => {
    const confirmDelete = window.confirm("Are you sure you want to delete this tenant?");
    if (!confirmDelete) return;

    try {
      await axios.delete(`/tenants/${tenantId}`);
      setTenants((prev) => prev.filter((tenant) => tenant._id !== tenantId));
    } catch (err) {
      console.error("Error deleting tenant:", err);
      alert("Failed to delete tenant. See console for details.");
    }
  };

  const filteredTenants = tenants
    .filter((t) =>
      searchName ? t.name.toLowerCase().includes(searchName.toLowerCase()) : true
    )
    .filter((t) => (unitFilter ? t.unitId === unitFilter : true));

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h3 className="text-xl font-semibold">Tenants Assigned to {property?.propertyName}</h3>
        <button
          className="bg-cyan-700 text-white px-4 py-2 rounded hover:bg-black"
          onClick={() => setShowForm(true)}
        >
          Add Tenant
        </button>
      </div>

      {showForm && (
        <div className="mt-4 p-4 border rounded bg-gray-50">
          <PropertyTenantForm
            propertyId={property._id}
            onTenantAdded={() => {
              setShowForm(false);
              setRefreshFlag((prev) => !prev); // trigger refetch
            }}
            onCancel={() => setShowForm(false)}
          />
        </div>
      )}

      {/* Filters */}
      <div className="flex flex-wrap gap-4 items-end mt-4">
        <div>
          <label className="block text-sm font-medium text-gray-800">Search by Name</label>
          <input
            type="text"
            value={searchName}
            onChange={(e) => setSearchName(e.target.value)}
            placeholder="e.g. John"
            className="mt-1 block w-48 border border-gray-300 rounded px-2 py-1"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-800">Filter by Unit ID</label>
          <select
            value={unitFilter}
            onChange={(e) => setUnitFilter(e.target.value)}
            className="mt-1 block w-40 border border-gray-300 rounded px-2 py-1"
          >
            <option value="">All Units</option>
            {[...new Set(tenants.map((t) => t.unitId))].map((unitId) => (
              <option key={unitId} value={unitId}>
                {unitId}
              </option>
            ))}
          </select>
        </div>
      </div>

      {loading ? (
        <p>Loading tenants...</p>
      ) : error ? (
        <p className="text-red-600">{error}</p>
      ) : filteredTenants.length === 0 ? (
        <p>No tenants match your filters.</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full border border-gray-300">
            <thead className="bg-gray-100">
              <tr>
                <th className="px-4 py-2 border">Name</th>
                <th className="px-4 py-2 border">Unit</th>
                <th className="px-4 py-2 border">Phone</th>
                <th className="px-4 py-2 border">Email</th>
                <th className="px-4 py-2 border">ID Number</th>
                <th className="px-4 py-2 border">Lease Start</th>
                <th className="px-4 py-2 border">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredTenants.map((tenant) => (
                <tr key={tenant._id} className="hover:bg-gray-50">
                  <td className="border px-4 py-2">{tenant.name}</td>
                  <td className="border px-4 py-2">{tenant.unitId}</td>
                  <td className="border px-4 py-2">{tenant.phone}</td>
                  <td className="border px-4 py-2">{tenant.email}</td>
                  <td className="border px-4 py-2">{tenant.idNumber}</td>
                  <td className="border px-4 py-2">
                    {new Date(tenant.leaseStartDate).toLocaleDateString()}
                  </td>
                  <td className="border px-4 py-2 space-x-2">
                    <Link
                      to={`/tenants/${tenant._id}`}
                      className="text-blue-600 hover:underline"
                    >
                      View Profile
                    </Link>
                    <button
                      className="text-red-600 hover:underline"
                      onClick={() => handleDeleteTenant(tenant._id)}
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default TenantsTab;
