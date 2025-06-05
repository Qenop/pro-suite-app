//src\pages\tabs\EditPropertyTab.jsx
import React, { useState, useEffect } from "react";
import axios from '../../api/axiosInstance';
import { useOutletContext } from "react-router-dom";

const EditPropertyTab = () => {
  const { property, refreshProperty } = useOutletContext();
  const [formData, setFormData] = useState(null);
  const [formErrors, setFormErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [successMsg, setSuccessMsg] = useState("");
  const [errorMsg, setErrorMsg] = useState("");

  useEffect(() => {
    if (property) {
      setFormData({
        propertyName: property.propertyName || "",
        address: property.address || "",
        propertyType: property.propertyType || "",
        serviceRate: {
          model: property.serviceRate?.model || "",
          value: property.serviceRate?.value || ""
        },
        landlord: {
          name: property.landlord?.name || "",
          email: property.landlord?.email || "",
          phone: property.landlord?.phone || ""
        },
        paymentDetails: {
          bank: property.paymentDetails?.bank || "",
          accountName: property.paymentDetails?.accountName || "",
          accountNumber: property.paymentDetails?.accountNumber || "",
          deadline: property.paymentDetails?.deadline || ""
        },
        utilities: {
          water: property.utilities?.water || "",
          waterRate: property.utilities?.waterRate || "",
          garbage: property.utilities?.garbage || ""
        }
      });
    }
  }, [property]);

  const handleChange = (e, section, field) => {
    const value = e.target.value;
    if (section) {
      setFormData((prev) => ({
        ...prev,
        [section]: { ...prev[section], [field]: value }
      }));
    } else {
      setFormData((prev) => ({ ...prev, [field]: value }));
    }
  };

  const validate = () => {
    const errors = {};
    if (!formData.propertyName) errors.propertyName = "Name is required.";
    if (!formData.address) errors.address = "Address is required.";
    if (!formData.propertyType) errors.propertyType = "Type is required.";

    if (!formData.serviceRate.model || !formData.serviceRate.value) {
      errors.serviceRate = {
        ...(formData.serviceRate.model ? {} : { model: "Model is required." }),
        ...(formData.serviceRate.value ? {} : { value: "Value is required." }),
      };
    }

    return errors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const errors = validate();
    setFormErrors(errors);

    if (Object.keys(errors).length > 0) return;

    try {
      setLoading(true);
      setErrorMsg(""); // Clear previous errors
      setSuccessMsg(""); // Clear previous success

      // Sending the PUT request to update the property
      const response = await axios.put(`/properties/${property._id}`, formData);
      
      // Check if update was successful
      if (response.status === 200) {
        setSuccessMsg("Property updated successfully.");
        
        // Refetch the latest property data
        await refreshProperty();

        // Update the form data with the latest data
        setFormData({
          propertyName: property.propertyName || "",
          address: property.address || "",
          propertyType: property.propertyType || "",
          serviceRate: {
            model: property.serviceRate?.model || "",
            value: property.serviceRate?.value || "",
          },
          landlord: {
            name: property.landlord?.name || "",
            email: property.landlord?.email || "",
            phone: property.landlord?.phone || "",
          },
          paymentDetails: {
            bank: property.paymentDetails?.bank || "",
            accountName: property.paymentDetails?.accountName || "",
            accountNumber: property.paymentDetails?.accountNumber || "",
            deadline: property.paymentDetails?.deadline || "",
          },
          utilities: {
            water: property.utilities?.water || "",
            waterRate: property.utilities?.waterRate || "",
            garbage: property.utilities?.garbage || "",
          },
        });
      } else {
        // If response status isn't 200, set error message
        setErrorMsg("Failed to update property.");
        setSuccessMsg("");
      }
    } catch (err) {
      console.error("Property update error:", err.response || err.message || err);
      setErrorMsg(
        err?.response?.data?.message || "Failed to update property."
      );
      setSuccessMsg("");
    } finally {
      setLoading(false);
    }

  };

  if (!formData) return <p>Loading...</p>;

  return (
    <form onSubmit={handleSubmit} className="p-6 bg-white rounded-lg shadow space-y-6">
      <section>
        <h2 className="text-xl font-semibold mb-2">Basic Info</h2>
        <input
          type="text"
          placeholder="Property Name"
          className="w-full mb-2 border px-3 py-2 rounded"
          value={formData.propertyName}
          onChange={(e) => handleChange(e, null, "propertyName")}
        />
        {formErrors.propertyName && <p className="text-red-600 text-sm">{formErrors.propertyName}</p>}

        <input
          type="text"
          placeholder="Address"
          className="w-full mb-2 border px-3 py-2 rounded"
          value={formData.address}
          onChange={(e) => handleChange(e, null, "address")}
        />
        {formErrors.address && <p className="text-red-600 text-sm">{formErrors.address}</p>}

        <input
          type="text"
          placeholder="Property Type"
          className="w-full mb-2 border px-3 py-2 rounded"
          value={formData.propertyType}
          onChange={(e) => handleChange(e, null, "propertyType")}
        />
        {formErrors.propertyType && <p className="text-red-600 text-sm">{formErrors.propertyType}</p>}
      </section>

      <section>
        <h2 className="text-xl font-semibold mb-2">Service Rate</h2>
        <select
          className="w-full mb-2 border px-3 py-2 rounded"
          value={formData.serviceRate.model}
          onChange={(e) => handleChange(e, "serviceRate", "model")}
        >
          <option value="">Select Model</option>
          <option value="Fixed">Fixed</option>
          <option value="Percent">Percent</option>
        </select>
        {formErrors?.serviceRate?.model && (
          <p className="text-red-600 text-sm">{formErrors.serviceRate.model}</p>
        )}

        {formData.serviceRate.model && (
          <input
            type="number"
            placeholder={formData.serviceRate.model === "Fixed" ? "Amount (Kes.)" : "Percentage (%)"}
            className="w-full mb-2 border px-3 py-2 rounded"
            value={formData.serviceRate.value}
            onChange={(e) => handleChange(e, "serviceRate", "value")}
          />
        )}
        {formErrors?.serviceRate?.value && (
          <p className="text-red-600 text-sm">{formErrors.serviceRate.value}</p>
        )}
      </section>

      <section>
        <h2 className="text-xl font-semibold mb-2">Landlord Info</h2>
        <input
          type="text"
          placeholder="Name"
          className="w-full mb-2 border px-3 py-2 rounded"
          value={formData.landlord.name}
          onChange={(e) => handleChange(e, "landlord", "name")}
        />
        <input
          type="email"
          placeholder="Email"
          className="w-full mb-2 border px-3 py-2 rounded"
          value={formData.landlord.email}
          onChange={(e) => handleChange(e, "landlord", "email")}
        />
        <input
          type="tel"
          placeholder="Phone"
          className="w-full mb-2 border px-3 py-2 rounded"
          value={formData.landlord.phone}
          onChange={(e) => handleChange(e, "landlord", "phone")}
        />
      </section>

      <section>
        <h2 className="text-xl font-semibold mb-2">Payment Details</h2>
        <input
          type="text"
          placeholder="Bank"
          className="w-full mb-2 border px-3 py-2 rounded"
          value={formData.paymentDetails.bank}
          onChange={(e) => handleChange(e, "paymentDetails", "bank")}
        />
        <input
          type="text"
          placeholder="Account Name"
          className="w-full mb-2 border px-3 py-2 rounded"
          value={formData.paymentDetails.accountName}
          onChange={(e) => handleChange(e, "paymentDetails", "accountName")}
        />
        <input
          type="text"
          placeholder="Account Number"
          className="w-full mb-2 border px-3 py-2 rounded"
          value={formData.paymentDetails.accountNumber}
          onChange={(e) => handleChange(e, "paymentDetails", "accountNumber")}
        />
        <input
          type="text"
          placeholder="Payment Deadline"
          className="w-full mb-2 border px-3 py-2 rounded"
          value={formData.paymentDetails.deadline}
          onChange={(e) => handleChange(e, "paymentDetails", "deadline")}
        />
      </section>

      <section>
        <h2 className="text-xl font-semibold mb-2">Utilities</h2>
        <input
          type="text"
          placeholder="Water"
          className="w-full mb-2 border px-3 py-2 rounded"
          value={formData.utilities.water}
          onChange={(e) => handleChange(e, "utilities", "water")}
        />
        <input
          type="text"
          placeholder="Water Rate"
          className="w-full mb-2 border px-3 py-2 rounded"
          value={formData.utilities.waterRate}
          onChange={(e) => handleChange(e, "utilities", "waterRate")}
        />
        <input
          type="text"
          placeholder="Garbage"
          className="w-full mb-2 border px-3 py-2 rounded"
          value={formData.utilities.garbage}
          onChange={(e) => handleChange(e, "utilities", "garbage")}
        />
      </section>

      <button
        type="submit"
        disabled={loading}
        className="bg-cyan-700 text-white px-6 py-2 rounded hover:bg-black"
      >
        {loading ? "Saving..." : "Update Property"}
      </button>

      {successMsg && (
        <p className="mt-3 text-green-600 font-medium">{successMsg}</p>
      )}
      {errorMsg && (
        <p className="mt-3 text-red-600 font-medium">{errorMsg}</p>
      )}
    </form>
  );
};

export default EditPropertyTab;
