// src\pages\LandlordDashboard.jsx
import React, { useEffect, useState } from 'react';
import { useParams, useNavigate, Outlet } from 'react-router-dom';
import axios from '../api/axiosInstance';

const LandlordDashboard = () => {
  const { propertyId } = useParams();
  const navigate = useNavigate();
  const [property, setProperty] = useState(null);

  useEffect(() => {
    const storedUser = JSON.parse(localStorage.getItem('user'));
    const userPropertyId = storedUser?.propertyId;

    if (!userPropertyId || userPropertyId !== propertyId) {
      console.error('Landlord is not authorized for this property');
      return;
    }

    const fetchProperty = async () => {
      try {
        const res = await axios.get(`/properties/${propertyId}`);
        setProperty(res.data);
      } catch (error) {
        console.error('Failed to fetch property', error);
      }
    };

    fetchProperty();
  }, [propertyId]);

  const goTo = (nextTab) => {
    navigate(`/properties/${propertyId}/${nextTab}`);
  };

  return (
    <div className="p-6 space-y-4">
      <h1 className="text-2xl font-bold text-green-700">Landlord Dashboard</h1>

      <div className="flex space-x-4 border-b border-gray-200 pb-2">
        <button
          onClick={() => goTo('expenses')}
          className={`px-4 py-2 rounded-t-lg ${window.location.pathname.endsWith('/expenses') ? 'bg-green-100 text-green-700' : 'bg-gray-100'}`}
        >
          Expenses
        </button>
        <button
          onClick={() => goTo('reports')}
          className={`px-4 py-2 rounded-t-lg ${window.location.pathname.endsWith('/reports') ? 'bg-green-100 text-green-700' : 'bg-gray-100'}`}
        >
          Reports
        </button>
      </div>

      {/* Render child route here, pass property as context */}
      <Outlet context={{ property }} />
    </div>
  );
};

export default LandlordDashboard;
