// src\pages\Dashboard.jsx
import React, { useEffect, useState } from 'react';
import axios from '../api/axiosInstance';
import { Link } from 'react-router-dom';
import {
  Building, Users, Home, Layers, Wallet, CircleDollarSign, TrendingUp, KeyRound,
  LayoutDashboard, UserPlus, Eye, UserCog
} from 'lucide-react';

const Dashboard = () => {
  const [stats, setStats] = useState({
    totalProperties: 0,
    totalTenants: 0,
    totalUnits: 0,
    vacantUnits: 0,
    occupancyRate: "0.0",
    totalExpense: 0,
    totalRevenue: 0,
  });

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const res = await axios.get('/stats/dashboard');
        setStats(res.data);
      } catch (error) {
        console.error('Failed to fetch dashboard stats:', error);
      }
    };
    fetchStats();
  }, []);

  const navCards = [
  { title: 'Add Property', to: '/create-property', icon: Home, color: 'text-green-600' },
  { title: 'Assign Tenant', to: '/assign-tenant', icon: UserPlus, color: 'text-purple-600' },
  { title: 'View Properties', to: '/properties', icon: Eye, color: 'text-blue-600' },
  { title: 'View Tenants', to: '/tenants', icon: Users, color: 'text-yellow-600' },
  { title: 'Manage Users', to: '/users', icon: UserCog, color: 'text-red-600' },
];

  return (
    <div className="p-6 space-y-8">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold text-gray-950 flex items-center gap-2">
          <LayoutDashboard className="w-6 h-6 text-red-600" />
          Dashboard
        </h1>
      </div>

      {/* Stats Summary */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-7 gap-5">
        <StatCard label="All Properties" value={stats.totalProperties} icon={Building} />
        <StatCard label="Total Units" value={stats.totalUnits} icon={Layers} />
        <StatCard label="Vacant Units" value={stats.vacantUnits} icon={KeyRound} />
        <StatCard label="All Tenants" value={stats.totalTenants} icon={Users} />
        <StatCard label="Occupancy" value={`${stats.occupancyRate}%`} icon={TrendingUp} />
        <StatCard label="Revenue" value={stats.totalRevenue} isCurrency icon={CircleDollarSign} />
        <StatCard label="Expenses" value={stats.totalExpense} isCurrency icon={Wallet} />
      </div>

      {/* Navigation Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6">
        {navCards.map(({ title, to, icon: Icon, color }, index) => (
          <Link
            key={index}
            to={to}
            className="bg-white hover:bg-gray-50 shadow-sm border border-gray-200 p-5 rounded-2xl transition transform hover:-translate-y-1"
          >
            <div className="flex items-center gap-3">
              {Icon && <Icon className={`w-6 h-6 ${color}`}/>} {/* Make sure this line is here */}
              <div>
                <h2 className="text-lg font-semibold">{title}</h2>
                <p className="text-sm text-blue-500">Go to {title}</p>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
};

const StatCard = ({ label, value, isCurrency, icon: Icon }) => {
  const formattedValue = isCurrency
    ? new Intl.NumberFormat('en-KE', {
        style: 'currency',
        currency: 'KES',
        minimumFractionDigits: 0,
      }).format(value)
    : value;

  return (
    <div className="bg-white p-4 rounded-2xl shadow-sm border border-gray-200 flex flex-col items-center text-center">
      {Icon && <Icon className="w-6 h-6 text-blue-500 mb-2" />}
      <div className="text-sm text-gray-600">{label}</div>
      <div className="text-xl font-bold text-gray-900 mt-1">{formattedValue}</div>
    </div>
  );
};

export default Dashboard;
