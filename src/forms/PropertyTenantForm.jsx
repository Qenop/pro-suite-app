//src\forms\PropertyTenantForm.jsx
import React, { useState, useEffect } from "react";
import axios from '../api/axiosInstance';

const PropertyTenantForm = ({ propertyId, onTenantAdded, onCancel }) => {
  const [property, setProperty] = useState(null);
  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    email: "",
    idNumber: "",
    leaseStartDate: "",
    unitId: "",
    gender: "",
    occupation: "",
    emergencyContactName: "",
    emergencyContactPhone: "",
    emergencyContactRelation: "",
    notes: "",
  });
  const [rent, setRent] = useState("");
  const [deposit, setDeposit] = useState("");
  const [profilePicture, setProfilePicture] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchProperty = async () => {
      setLoading(true);
      try {
        const res = await axios.get(`/properties/${propertyId}`);
        setProperty(res.data);
      } catch {
        setError("Failed to load property data.");
      } finally {
        setLoading(false);
      }
    };

    if (propertyId) {
      fetchProperty();
    }
  }, [propertyId]);

  const vacantUnits = property?.units
    ? property.units.flatMap((unitType) =>
        unitType.unitIds
          .filter((unitIdObj) => unitIdObj.status.toLowerCase() === "vacant")
          .map((unitIdObj) => ({
            _id: unitIdObj._id,
            unitId: unitIdObj.unitId,
            type: unitType.type,
            rent: unitType.rent,
            deposit: unitType.deposit,
          }))
      )
    : [];

  const handleChange = (e) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleUnitChange = (e) => {
    const selectedUnitId = e.target.value;
    setFormData((prev) => ({ ...prev, unitId: selectedUnitId }));

    const selectedUnit = vacantUnits.find((u) => u.unitId === selectedUnitId);
    if (selectedUnit) {
      setRent(selectedUnit.rent);
      setDeposit(selectedUnit.deposit);
    } else {
      setRent("");
      setDeposit("");
    }
  };

  const handleFileChange = (e) => {
    setProfilePicture(e.target.files[0]);
  };

  const handleSubmit = async (e) => {
  e.preventDefault();
  setError("");

  const data = new FormData();

  // Append all regular form data except emergency contact fields
  for (const key in formData) {
    if (!key.startsWith("emergencyContact")) {
      data.append(key, formData[key]);
    }
  }

  data.append("propertyId", propertyId);
  data.append("rent", rent);
  data.append("deposit", deposit);

  // Append emergencyContact as a JSON string
  const emergencyContact = {
    name: formData.emergencyContactName,
    phone: formData.emergencyContactPhone,
    relation: formData.emergencyContactRelation,
  };
  data.append("emergencyContact", JSON.stringify(emergencyContact));

  if (profilePicture) {
    data.append("profilePicture", profilePicture);
  }

  try {
    await axios.post("/tenants", data, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
    onTenantAdded();
  } catch (err) {
    if (err.response?.data?.message) {
      setError(err.response.data.message);
    } else {
      setError("Failed to add tenant. Please try again.");
    }
  }
  };


  if (loading) return <p>Loading property data...</p>;

  return (
    <form onSubmit={handleSubmit} className="space-y-6 p-4 bg-white shadow rounded-md">
      {error && <p className="text-red-600">{error}</p>}

      {/* Personal Info */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <input
          type="text"
          name="name"
          placeholder="Full Name"
          value={formData.name}
          onChange={handleChange}
          required
          className="input"
        />
        <input
          type="tel"
          name="phone"
          placeholder="Phone Number"
          value={formData.phone}
          onChange={handleChange}
          required
          className="input"
        />
        <input
          type="email"
          name="email"
          placeholder="Email"
          value={formData.email}
          onChange={handleChange}
          className="input"
        />
        <input
          type="text"
          name="idNumber"
          placeholder="ID Number"
          value={formData.idNumber}
          onChange={handleChange}
          required
          className="input"
        />
        <div className="flex flex-col">
          <label htmlFor="leaseStartDate" className="text-sm text-gray-700 mb-1">
            Lease Start Date
          </label>
          <input
            type="date"
            name="leaseStartDate"
            id="leaseStartDate"
            value={formData.leaseStartDate}
            onChange={handleChange}
            required
            className="input"
          />
        </div>

        <select
          name="unitId"
          value={formData.unitId}
          onChange={handleUnitChange}
          required
          className="input"
        >
          <option value="">Select Unit</option>
          {vacantUnits
            .sort((a, b) => a.unitId.localeCompare(b.unitId))
            .map((unit) => (
              <option key={unit._id} value={unit.unitId}>
                {unit.unitId} ({unit.type}) - Rent: {unit.rent}
              </option>
            ))}
        </select>
        <select
          name="gender"
          value={formData.gender}
          onChange={handleChange}
          required
          className="input"
        >
          <option value="">Select Gender</option>
          <option value="Male">Male</option>
          <option value="Female">Female</option>
          <option value="Other">Other</option>
        </select>
        <input
          type="text"
          name="occupation"
          placeholder="Occupation"
          value={formData.occupation}
          onChange={handleChange}
          className="input"
        />
      </div>

      {/* Emergency Contact */}
      <fieldset className="border border-gray-200 p-4 rounded">
        <legend className="text-sm font-medium text-gray-700 mb-2">Emergency Contact</legend>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <input
            type="text"
            name="emergencyContactName"
            placeholder="Name"
            value={formData.emergencyContactName}
            onChange={handleChange}
            className="input"
          />
          <input
            type="tel"
            name="emergencyContactPhone"
            placeholder="Phone"
            value={formData.emergencyContactPhone}
            onChange={handleChange}
            className="input"
          />
          <input
            type="text"
            name="emergencyContactRelation"
            placeholder="Relation"
            value={formData.emergencyContactRelation}
            onChange={handleChange}
            className="input"
          />
        </div>
      </fieldset>

      {/* Profile Picture */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Profile Picture</label>
        <input
          type="file"
          name="profilePicture"
          accept="image/*"
          onChange={handleFileChange}
          className="input"
        />
        {profilePicture && (
          <img
            src={URL.createObjectURL(profilePicture)}
            alt="Profile Preview"
            className="w-20 h-20 rounded-full mt-2"
          />
        )}
      </div>

      {/* Notes */}
      <div>
        <textarea
          name="notes"
          placeholder="Additional notes about the tenant..."
          value={formData.notes}
          onChange={handleChange}
          rows={3}
          className="input w-full"
        />
      </div>

      {/* Buttons */}
      <div className="flex space-x-2">
        <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded">
          Add Tenant
        </button>
        <button type="button" onClick={onCancel} className="bg-gray-300 px-4 py-2 rounded">
          Cancel
        </button>
      </div>
    </form>
  );
};

export default PropertyTenantForm;
