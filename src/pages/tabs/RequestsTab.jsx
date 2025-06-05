//src\pages\tabs\RequestsTab.jsx
import React, { useState } from 'react';

// Sample mock data for categorized requests
const mockRequests = [
  {
    id: 1,
    category: 'Utilities',
    type: 'Plumbing',
    request: 'Water leakage in apartment 5B',
    status: 'Pending',
  },
  {
    id: 2,
    category: 'Utilities',
    type: 'Electrical',
    request: 'Light bulb replacement in hallway',
    status: 'Resolved',
  },
  {
    id: 3,
    category: 'Payments',
    type: 'Late Payment',
    request: 'Tenant in unit 12 has not paid rent this month',
    status: 'Pending',
  },
  {
    id: 4,
    category: 'Security',
    type: 'Access Control',
    request: 'Broken security camera at the front entrance',
    status: 'Pending',
  },
  {
    id: 5,
    category: 'Billing & Leasing',
    type: 'Lease Renewal',
    request: 'Tenant in 3A requests a lease renewal',
    status: 'Resolved',
  },
  {
    id: 6,
    category: 'General Inquiries',
    type: 'Maintenance Inquiry',
    request: 'Request for general maintenance on the property',
    status: 'In Progress',
  },
];

const RequestsTab = () => {
  const [selectedCategory, setSelectedCategory] = useState('Utilities');

  // Filter requests based on category
  const filteredRequests = mockRequests.filter(request => request.category === selectedCategory);

  return (
    <div className="p-4 bg-white rounded-md shadow-sm">
      {/* Category Selection */}
      <div className="flex space-x-4 mb-6">
        {['Utilities', 'Payments', 'Security', 'Billing & Leasing', 'General Inquiries'].map(category => (
          <button
            key={category}
            onClick={() => setSelectedCategory(category)}
            className={`px-4 py-2 rounded-md ${
              selectedCategory === category ? 'bg-cyan-700 text-white' : 'bg-gray-200'
            }`}
          >
            {category}
          </button>
        ))}
      </div>

      {/* Request List for Selected Category */}
      <div>
        <h3 className="text-lg font-semibold mb-4">{selectedCategory} Requests</h3>
        {filteredRequests.length > 0 ? (
          filteredRequests.map((request) => (
            <div key={request.id} className="mb-4 p-4 border rounded-md">
              <p className="font-medium">{request.type}</p>
              <p>{request.request}</p>
              <p className="text-sm text-gray-500">Status: {request.status}</p>
            </div>
          ))
        ) : (
          <p className="text-gray-500">No requests under this category.</p>
        )}
      </div>
    </div>
  );
};

export default RequestsTab;
