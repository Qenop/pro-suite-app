// src\pages\CreateTenantPage.jsx
import React from 'react';
import AssignTenantForm from '../forms/AssignTenantForm';

export default function CreateTenantPage() {
  return (
    <div className="max-w-4xl mx-auto p-6 bg-white rounded-xl shadow-md space-y-6">
      <h1 className="text-3xl font-bold text-center">Create Tenant</h1>
      <p className="text-lg text-center text-gray-600">
        Assign a tenant to a property and unit. Fill in the required details below.
      </p>

      {/* Render the AssignTenantForm component */}
      <AssignTenantForm />
    </div>
  );
}
