//src\pages\tabs\UnitsTab.jsx
import React, { useEffect, useState } from "react";
import axios from "../../api/axiosInstance";
import { useParams } from "react-router-dom";

const UnitsTab = () => {
  const { id } = useParams(); // property ID from URL
  const [units, setUnits] = useState([]);
  const [tenants, setTenants] = useState([]);
  const [loading, setLoading] = useState(true);

  const [typeFilter, setTypeFilter] = useState("");
  const [statusFilter, setStatusFilter] = useState("");

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch property and units
        const propertyRes = await axios.get(`/properties/${id}`);
        setUnits(propertyRes.data.units || []);

        // Fetch tenants for this property
        const tenantsRes = await axios.get(`/tenants?propertyId=${id}`);
        setTenants(tenantsRes.data || []);
      } catch (err) {
        console.error("Error fetching data:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [id]);

  // Filter units by type and status
  const filteredUnits = units.filter((group) => {
    const matchesType = typeFilter ? group.type === typeFilter : true;
    const hasMatchingUnits = group.unitIds.some((u) =>
      statusFilter ? u.status === statusFilter : true
    );
    return matchesType && hasMatchingUnits;
  });

  // Helper: Add tenant info into filtered unitIds
  const unitsWithTenants = filteredUnits.map((unitGroup) => {
    const updatedUnitIds = unitGroup.unitIds
      .filter((unit) => (statusFilter ? unit.status === statusFilter : true))
      .map((unit) => {
        const tenant = tenants.find((t) => t.unitId === unit.unitId);
        return {
          ...unit,
          tenant: tenant || null,
        };
      });

    return {
      ...unitGroup,
      unitIds: updatedUnitIds,
    };
  });

  return (
    <div className="p-6 bg-white rounded shadow max-w-5xl mx-auto">
      <h2 className="text-xl font-bold mb-4">Units</h2>

      {loading ? (
        <p className="text-gray-500">Loading units...</p>
      ) : units.length === 0 ? (
        <p className="text-gray-500">No units found for this property.</p>
      ) : (
        <>
          {/* Filters */}
          <div className="flex items-center space-x-4 mb-4">
            <div>
              <label className="block text-sm font-medium text-gray-900">
                Filter by Type
              </label>
              <select
                value={typeFilter}
                onChange={(e) => setTypeFilter(e.target.value)}
                className="mt-1 block w-40 border border-gray-300 rounded px-2 py-1"
              >
                <option value="">All Types</option>
                {[...new Set(units.map((u) => u.type))].map((type) => (
                  <option key={type} value={type}>
                    {type}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-900">
                Filter by Status
              </label>
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="mt-1 block w-40 border border-gray-300 rounded px-2 py-1"
              >
                <option value="">All Statuses</option>
                <option value="vacant">Vacant</option>
                <option value="occupied">Occupied</option>
              </select>
            </div>
          </div>

          {/* Table */}
          <div className="overflow-x-auto">
            <table className="min-w-full border text-sm">
              <thead className="bg-gray-300 text-left">
                <tr>
                  <th className="py-2 px-4">Type</th>
                  <th className="py-2 px-4">Rent (KES)</th>
                  <th className="py-2 px-4">Deposit (KES)</th>
                  <th className="py-2 px-4">Unit ID</th>
                  <th className="py-2 px-4">Status</th>
                  <th className="py-2 px-4">Tenant</th>
                </tr>
              </thead>
              <tbody>
                {unitsWithTenants.map((unitGroup) =>
                  unitGroup.unitIds.map((unit, unitIndex) => (
                    <tr key={`${unit.unitId}-${unitIndex}`} className="border-b">
                      {unitIndex === 0 && (
                        <>
                          <td
                            rowSpan={unitGroup.unitIds.length}
                            className="py-2 px-4 font-medium"
                          >
                            {unitGroup.type}
                          </td>
                          <td rowSpan={unitGroup.unitIds.length} className="py-2 px-4">
                            {unitGroup.rent.toLocaleString()}
                          </td>
                          <td rowSpan={unitGroup.unitIds.length} className="py-2 px-4">
                            {unitGroup.deposit.toLocaleString()}
                          </td>
                        </>
                      )}
                      <td className="py-2 px-4">{unit.unitId}</td>
                      <td className="py-2 px-4">{unit.status}</td>
                      <td className="py-2 px-4">
                        {unit.status === "occupied" && unit.tenant
                          ? unit.tenant.name
                          : "-"}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </>
      )}
    </div>
  );
};

export default UnitsTab;

