//src\pages\PropertiesPage.jsx
import { useEffect, useState } from "react";
import axios from '../api/axiosInstance';
import { Link } from "react-router-dom";

const PropertiesPage = () => {
  const [properties, setProperties] = useState([]);
  const [filteredProperties, setFilteredProperties] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [sortBy, setSortBy] = useState("name");

  useEffect(() => {
    const fetchProperties = async () => {
      try {
        const response = await axios.get("/properties");
        setProperties(response.data);
        setFilteredProperties(response.data);
      } catch (err) {
        console.error("Error fetching properties:", err);
        setError("Failed to load properties.");
      } finally {
        setLoading(false);
      }
    };

    fetchProperties();
  }, []);

  useEffect(() => {
    let filtered = [...properties];

    if (searchTerm.trim()) {
      filtered = filtered.filter((p) =>
        p.propertyName.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (sortBy === "name") {
      filtered.sort((a, b) => a.propertyName.localeCompare(b.propertyName));
    } else if (sortBy === "type") {
      filtered.sort((a, b) => a.propertyType.localeCompare(b.propertyType));
    }

    setFilteredProperties(filtered);
  }, [searchTerm, sortBy, properties]);

  const handleDelete = async (propertyId) => {
    const confirmDelete = window.confirm("Are you sure you want to delete this property?");
    if (!confirmDelete) return;

    try {
      await axios.delete(`/properties/${propertyId}`);
      setProperties((prev) => prev.filter((p) => p._id !== propertyId));
    } catch (err) {
      console.error("Error deleting property:", err);
      alert("Failed to delete property. Please try again.");
    }
  };

  if (loading) return <p>Loading properties...</p>;
  if (error) return (
    <div className="text-red-600">
      <p>{error}</p>
      <button onClick={() => window.location.reload()} className="text-blue-600 underline">Retry</button>
    </div>
  );

  return (
    <div className="p-4">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-2xl font-semibold">All Properties</h2>
        <Link
          to="/create-property"
          className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
        >
          Add Property
        </Link>
      </div>

      <div className="flex flex-col md:flex-row md:items-center md:space-x-4 mb-6 space-y-2 md:space-y-0">
        <input
          type="text"
          placeholder="Search by name..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="border px-3 py-2 rounded w-full md:w-1/3"
        />
        <select
          value={sortBy}
          onChange={(e) => setSortBy(e.target.value)}
          className="border px-3 py-2 rounded w-full md:w-auto"
        >
          <option value="name">Sort by Name</option>
          <option value="type">Sort by Type</option>
        </select>
      </div>

      <div className="grid gap-4 grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
        {filteredProperties.length > 0 ? (
          filteredProperties.map((property) => {
            const unitTypes = [
              ...new Set(property.units?.map((u) => u.type) || []),
            ];

            return (
              <div
                key={property._id}
                className="border p-4 rounded shadow hover:shadow-md transition relative"
              >
                <h3 className="text-xl font-bold">{property.propertyName}</h3>
                <p className="text-sm text-gray-600">{property.address}</p>
                <p className="text-sm">Type: {property.propertyType}</p>
                <p className="text-sm">
                  Unit Types: {unitTypes.length > 0 ? unitTypes.join(", ") : "N/A"}
                </p>

                <div className="mt-3 flex justify-between items-center">
                  <Link
                    to={`/properties/${property._id}`}
                    className="text-blue-600 hover:underline text-sm"
                  >
                    Manage
                  </Link>
                  <button
                    onClick={() => handleDelete(property._id)}
                    className="text-red-500 hover:underline text-sm"
                  >
                    Delete
                  </button>
                </div>
              </div>
            );
          })
        ) : (
          <div className="col-span-full text-center text-gray-500">
            <p>No properties found. Add one to get started.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default PropertiesPage;
