//\src\pages\PropertyDetailsPage.jsx
import React, { useEffect, useState, useCallback } from "react";
import { useParams, Outlet, Link, useLocation, useNavigate } from "react-router-dom";
import axios from '../api/axiosInstance';
import TabNav from "../components/navigation/TabNav";

const PropertyDetailsPage = () => {
  const { id } = useParams();
  const [property, setProperty] = useState(null);
  const [loading, setLoading] = useState(true);
  const location = useLocation();
  const navigate = useNavigate();

  const fetchProperty = useCallback(async () => {
    try {
      const response = await axios.get(`/properties/${id}`);
      setProperty(response.data);
    } catch (err) {
      console.error("Failed to load property:", err);
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => {
    fetchProperty();
  }, [fetchProperty]);

  // Redirect to overview if at base path (/properties/:id)
  useEffect(() => {
    if (location.pathname === `/properties/${id}`) {
      navigate(`overview`, { replace: true });
    }
  }, [id, location.pathname, navigate]);

  if (loading) return <p className="p-4 text-gray-500">Loading...</p>;
  if (!property) return <p className="p-4 text-red-500">Property not found.</p>;

  return (
    <div className="max-w-6xl mx-auto px-4 py-6">
      <Link
        to="/properties"
        className="text-sm text-blue-600 hover:underline inline-block mb-4"
      >
        ← Back to Properties
      </Link>

      <div className="mb-4">
        <h2 className="text-2xl font-bold">{property.propertyName}</h2>
        <p className="text-gray-600">{property.address}</p>
      </div>

      {/* Tab Navigation */}
      <TabNav propertyId={id} />

      {/* Render Current Tab */}
      <div className="mt-6">
        <Outlet context={{ property, refreshProperty: fetchProperty }} />
      </div>
    </div>
  );
};

export default PropertyDetailsPage;