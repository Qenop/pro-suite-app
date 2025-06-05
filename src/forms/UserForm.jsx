//src\forms\UserForm.jsx
import { useState, useEffect } from 'react';
import axios from '../api/axiosInstance';

const UserForm = ({ onSuccess, defaultPropertyId = '' }) => {
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    phone: '',
    role: '',
    propertyId: defaultPropertyId,
    password: '',
  });

  const [properties, setProperties] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!defaultPropertyId) {
      // Fetch properties only if propertyId is not fixed
      const fetchProperties = async () => {
        try {
          const res = await axios.get('/properties');
          setProperties(res.data);
        } catch (err) {
          console.error('Failed to load properties', err);
        }
      };
      fetchProperties();
    }
  }, [defaultPropertyId]);

  // Effect to auto-fill landlord info if role is landlord and property selected
  useEffect(() => {
    if (formData.role === 'landlord' && formData.propertyId) {
      const selectedProperty = properties.find(
        (p) => p._id === formData.propertyId
      );

      if (selectedProperty && selectedProperty.landlord) {
        setFormData((prev) => ({
          ...prev,
          fullName: selectedProperty.landlord.name || '',
          email: selectedProperty.landlord.email || '',
          phone: selectedProperty.landlord.phone || '',
        }));
      }
    }
  }, [formData.role, formData.propertyId, properties]);

  const handleChange = (e) => {
    const { name, value } = e.target;

    // Prevent changing propertyId if fixed by defaultPropertyId prop
    if (name === 'propertyId' && defaultPropertyId) {
      return;
    }

    // Prevent editing landlord fields manually when role is landlord
    if (
      formData.role === 'landlord' &&
      ['fullName', 'email', 'phone'].includes(name)
    ) {
      return;
    }

    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const res = await axios.post('/users', formData);
      if (onSuccess) onSuccess(res.data);
    } catch (err) {
      console.error(err);
      setError(err.response?.data?.message || 'Failed to create user');
    } finally {
      setLoading(false);
    }
  };

  const isLandlord = formData.role === 'landlord';

  return (
    <div className="p-6 max-w-xl mx-auto bg-white rounded-xl shadow border border-gray-200">
      <h1 className="text-xl font-semibold mb-4">Create New User</h1>

      {error && <div className="text-red-600 text-sm mb-4">{error}</div>}

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium">Full Name</label>
          <input
            type="text"
            name="fullName"
            value={formData.fullName}
            onChange={handleChange}
            required
            disabled={isLandlord}
            className={`w-full mt-1 p-2 border rounded ${
              isLandlord ? 'bg-gray-100 cursor-not-allowed' : ''
            }`}
          />
        </div>

        <div>
          <label className="block text-sm font-medium">Email</label>
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            required
            disabled={isLandlord}
            className={`w-full mt-1 p-2 border rounded ${
              isLandlord ? 'bg-gray-100 cursor-not-allowed' : ''
            }`}
          />
        </div>

        <div>
          <label className="block text-sm font-medium">Phone</label>
          <input
            type="text"
            name="phone"
            value={formData.phone}
            onChange={handleChange}
            required
            disabled={isLandlord}
            className={`w-full mt-1 p-2 border rounded ${
              isLandlord ? 'bg-gray-100 cursor-not-allowed' : ''
            }`}
          />
        </div>

        {!defaultPropertyId && (
          <div>
            <label className="block text-sm font-medium mt-4">Assign to Property</label>
            <select
              name="propertyId"
              value={formData.propertyId}
              onChange={handleChange}
              required
              className="w-full mt-1 p-2 border rounded"
            >
              <option value="">-- Select Property --</option>
              {properties.map((property) => (
                <option key={property._id} value={property._id}>
                  {property.propertyName}
                </option>
              ))}
            </select>
          </div>
        )}

        <div>
          <label className="block text-sm font-medium">User Role</label>
          <select
            name="role"
            value={formData.role}
            onChange={handleChange}
            required
            className="w-full mt-1 p-2 border rounded"
          >
            <option value="">-- Select Role --</option>
            <option value="caretaker">Caretaker</option>
            <option value="landlord">Landlord</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium">Password</label>
          <input
            type="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            required
            className="w-full mt-1 p-2 border rounded"
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 disabled:opacity-50 mt-4"
        >
          {loading ? 'Saving...' : 'Create User'}
        </button>
      </form>
    </div>
  );
};

export default UserForm;
