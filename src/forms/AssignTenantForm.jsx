//src\forms\AssignTenantForm.jsx
import { useState, useEffect } from 'react';
import axios from '../api/axiosInstance';

export default function AssignTenantForm() {
  // === State: General ===
  const [properties, setProperties] = useState([]);
  const [loading, setLoading] = useState(true);

  // === State: Selections ===
  const [selectedPropertyId, setSelectedPropertyId] = useState('');
  const [selectedUnitId, setSelectedUnitId] = useState('');

  // === State: Form ===
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    email: '', // Added field for Email
    idNumber: '', // Added field for ID Number
    leaseStartDate: '',
    rent: '',
    deposit: '',
    initialWaterReading: '',
  });

  const [submitting, setSubmitting] = useState(false);
  const [message, setMessage] = useState('');

  // === Effect: Fetch Properties ===
  useEffect(() => {
    const fetchProperties = async () => {
      try {
        const response = await axios.get('/properties');
        setProperties(response.data || []);
      } catch (error) {
        console.error('Failed to fetch properties:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchProperties();
  }, []);

  // === Effect: Auto-dismiss message ===
  useEffect(() => {
    if (message) {
      const timer = setTimeout(() => setMessage(''), 5000);
      return () => clearTimeout(timer);
    }
  }, [message]);

  // === Derived Data ===
  const selectedProperty = properties.find((p) => p._id === selectedPropertyId) || null;

  // Flatten unitIds and enrich with unitType info
  const vacantUnits =
    selectedProperty?.units?.flatMap((unitType) =>
      unitType.unitIds
        .filter((unit) => unit.status === 'vacant')
        .map((unit) => ({
          ...unit,
          type: unitType.type,
          rent: unitType.rent,
          deposit: unitType.deposit,
        }))
    ) ?? [];

  const selectedUnit = vacantUnits.find((unit) => unit.unitId === selectedUnitId) || null;

  // === Effect: Auto-fill Rent & Deposit ===
  useEffect(() => {
    if (
      selectedUnit &&
      (formData.rent !== selectedUnit.rent || formData.deposit !== selectedUnit.deposit)
    ) {
      setFormData((prev) => ({
        ...prev,
        rent: selectedUnit.rent || '',
        deposit: selectedUnit.deposit || '',
      }));
    }
  }, [selectedUnit, formData.rent, formData.deposit]);

  // === Handlers ===
  const handleChange = (field, value) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Basic Validation (optional)
    if (!formData.name?.trim() || !formData.phone?.trim() || !formData.idNumber?.trim() || !formData.email?.trim()) {
      setMessage('name, phone, ID number, and email are required.');
      return;
    }

    // Email Validation (basic)
    const emailPattern = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    if (!emailPattern.test(formData.email.trim())) {
      setMessage('Please provide a valid email address.');
      return;
    }

    // Phone Number Validation
    const phonePattern = /^[0-9]{10,13}$/;
    if (!phonePattern.test(formData.phone.trim())) {
      setMessage('Please provide a valid phone number (10-13 digits).');
      return;
    }

    // Ensure initialWaterReading is provided if water billing is metered
    if (selectedProperty?.utilities?.water === 'Metered' && !formData.initialWaterReading) {
      setMessage('Please provide the initial water meter reading.');
      return;
    }

    // Flatten the payload structure to match the backend expectations
    const payload = {
      propertyId: selectedPropertyId,
      unitId: selectedUnitId,
      name: formData.name.trim(),  // Flatten name to name
      phone: formData.phone.trim(),    // Flatten phone to phone
      email: formData.email.trim(),    // Include email address
      idNumber: formData.idNumber.trim(),  // Include the ID number
      leaseStartDate: formData.leaseStartDate,
      rent: Number(formData.rent),
      deposit: Number(formData.deposit),
      ...(selectedProperty?.utilities?.water === 'Metered' && {
        initialWaterReading: Number(formData.initialWaterReading),
      }),
    };

    console.log("Submitting tenant with payload:", payload);

    try {
      setSubmitting(true);
      setMessage('');  // Reset any previous message
      const response = await axios.post('/tenants', payload);
      setMessage('✅ Tenant assigned successfully!');
      console.log('Tenant created:', response.data);

      // Reset form state after successful submission
      setSelectedPropertyId('');
      setSelectedUnitId('');
      setFormData({
        name: '',
        phone: '',
        email: '',  // Reset email address
        idNumber: '',  // Reset ID number
        leaseStartDate: '',
        rent: '',
        deposit: '',
        initialWaterReading: '',
      });
    } catch (error) {
      console.error('Tenant creation failed:', error.response?.data || error.message);
      setMessage(`❌ Failed to assign tenant: ${error.response?.data?.message || error.message}`);
    } finally {
      setSubmitting(false);
    }
  };

  // === UI: Loading State ===
  if (loading) {
    return <div className="p-4 text-center">Loading properties...</div>;
  }

  // === Render ===
  return (
    <div className="max-w-xl mx-auto p-6 bg-white rounded-xl shadow space-y-6">
      <h2 className="text-2xl font-bold">Assign Tenant</h2>

      {message && (
        <div
          className={`p-2 text-center rounded ${message.startsWith('✅') ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}
        >
          {message}
        </div>
      )}

      {/* === Form === */}
      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Tenant Info */}
        <div>
          <label htmlFor="name" className="block font-medium mb-1">Name</label>
          <input
            id="name"
            type="text"
            className="w-full border rounded p-2"
            value={formData.name}
            onChange={(e) => handleChange('name', e.target.value.trimStart())}
            required
          />
        </div>

        <div>
          <label htmlFor="phone" className="block font-medium mb-1">Phone</label>
          <input
            id="phone"
            type="tel"
            pattern="[0-9]{10,13}"
            maxLength={13}
            className="w-full border rounded p-2"
            value={formData.phone}
            onChange={(e) => handleChange('phone', e.target.value.trimStart())}
            required
          />
        </div>

        <div>
          <label htmlFor="email" className="block font-medium mb-1">Email</label>
          <input
            id="email"
            type="email"
            className="w-full border rounded p-2"
            value={formData.email}
            onChange={(e) => handleChange('email', e.target.value.trimStart())}
            required
          />
        </div>

        <div>
          <label htmlFor="idNumber" className="block font-medium mb-1">ID Number</label>
          <input
            id="idNumber"
            type="text"
            className="w-full border rounded p-2"
            value={formData.idNumber}
            onChange={(e) => handleChange('idNumber', e.target.value.trimStart())}
            required
          />
        </div>

        <div>
          <label htmlFor="leaseStartDate" className="block font-medium mb-1">Lease Start Date</label>
          <input
            id="leaseStartDate"
            type="date"
            className="w-full border rounded p-2"
            value={formData.leaseStartDate}
            onChange={(e) => handleChange('leaseStartDate', e.target.value)}
            required
          />
        </div>

        {/* Property Selector */}
        <div>
          <label htmlFor="propertySelect" className="block font-medium mb-1">Property</label>
          <select
            id="propertySelect"
            className="w-full border rounded p-2"
            value={selectedPropertyId}
            onChange={async (e) => {
              setSelectedPropertyId(e.target.value);
              setSelectedUnitId('');
              setFormData((prev) => ({
                ...prev,
                rent: '',
                deposit: '',
                initialWaterReading: '',
              }));
            }}
            required
          >
            <option value="">Select a property</option>
            {properties.map((property) => (
              <option key={property._id} value={property._id}>
                {property.propertyName} - {property.address}
              </option>
            ))}
          </select>
        </div>

        {/* Unit Selector */}
        {selectedPropertyId && (
          <>
            {vacantUnits.length > 0 ? (
              <div>
                <label htmlFor="unitSelect" className="block font-medium mb-1">Unit</label>
                <select
                  id="unitSelect"
                  className="w-full border rounded p-2"
                  value={selectedUnitId}
                  onChange={(e) => setSelectedUnitId(e.target.value)}
                  required
                >
                  <option value="">Select a unit</option>
                  {vacantUnits
                    .sort((a, b) => a.unitId.localeCompare(b.unitId))
                    .map((unit) => (
                      <option key={unit._id} value={unit.unitId}>
                        {unit.unitId} ({unit.type})
                      </option>
                    ))}
                </select>
              </div>
            ) : (
              <p className="text-sm text-red-500">No vacant units available in this property.</p>
            )}
          </>
        )}

        {/* Rent & Deposit */}
        <div className="flex gap-4">
          <div className="flex-1">
            <label htmlFor="rent" className="block font-medium mb-1">Expected Rent</label>
            <input
              id="rent"
              type="number"
              className="w-full border rounded p-2"
              value={formData.rent}
              onChange={(e) => handleChange('rent', e.target.value)}
              required
            />
          </div>
          <div className="flex-1">
            <label htmlFor="deposit" className="block font-medium mb-1">Expected Deposit</label>
            <input
              id="deposit"
              type="number"
              className="w-full border rounded p-2"
              value={formData.deposit}
              onChange={(e) => handleChange('deposit', e.target.value)}
              required
            />
          </div>
        </div>
        {/* Water Reading (if metered) */}
        {selectedProperty?.utilities?.water === 'Metered' && (
          <div>
            <label htmlFor="initialWaterReading" className="block font-medium mb-1">
              Initial Water Reading (m³)
            </label>
            <input
              id="initialWaterReading"
              type="number"
              className="w-full border rounded p-2"
              value={formData.initialWaterReading}
              onChange={(e) => handleChange('initialWaterReading', e.target.value)}
              required
            />
          </div>
        )}

        {/* Submit Button */}
        <button
          type="submit"
          className="w-full bg-blue-500 text-white py-2 rounded mt-4"
          disabled={submitting}
        >
          {submitting ? 'Assigning...' : 'Assign Tenant'}
        </button>
      </form>
    </div>
  );
}
