//src\forms\PropertyForm.jsx
import { useState } from 'react';
import axios from '../api/axiosInstance';

function PropertyForm() {
  // Form state
  const initialFormData = {
  propertyName: '',
  address: '',
  propertyType: '',
  serviceRate: {
    model: '',
    value: '',
  },
  paymentDetails: {
    accountName: '',
    accountNumber: '',
    bank: '',
    deadline: '',
  },
  landlord: {
    name: '',
    phone: '',
    email: '',
  },
  utilities: {
    water: '',
    waterRate: '',
    garbage: '',
  },
  };

  const [formData, setFormData] = useState(initialFormData);
  const [isSubmitting, setIsSubmitting] = useState(false); // 👈 New
  const [submitStatus, setSubmitStatus] = useState(null); // 👈 New
  
  // Track unit types added
  const [unitTypes, setUnitTypes] = useState([]);
  const [formErrors, setFormErrors] = useState({});    
     
  // Update general field
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // Update nested field
  const handleNestedChange = (e, section) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [section]: {
        ...prev[section],
        [name]: value,
      },
    }));
  };

  // Add unit type 
  const addUnitType = () => {
    setUnitTypes((prev) => [
      ...prev,
      {
        type: '',
        rent: '',
        deposit: '',
        count: '',
        unitIds: [{ unitId: '', status: 'vacant' }], // Initialize with one unit object (unitId and status)
      },
    ]);
  };


  // Handle change for unit fields
  const handleUnitChange = (index, field, value) => {
    setUnitTypes((prevUnits) =>
      prevUnits.map((unit, i) => {
        if (i !== index) return unit;

        const updated = { ...unit, [field]: value };

        if (field === 'count') {
          const count = parseInt(value, 10) || 0;
          const currentUnitIds = [...(unit.unitIds || [])];

          // Resize the unitIds array with default objects
          while (currentUnitIds.length < count) {
            currentUnitIds.push({ unitId: '', status: 'vacant' }); // Initialize with unitId and status
          }
          if (currentUnitIds.length > count) {
            currentUnitIds.splice(count); // Trim to the correct count
          }

          updated.unitIds = currentUnitIds; // Update the unitIds array
        }

        return updated;
      })
    );
  }; 
  
  // Handle individual unit ID input
  const handleUnitIdChange = (unitIndex, idIndex, value) => {
    setUnitTypes((prevUnits) => {
      const updated = [...prevUnits];
      const unit = { ...updated[unitIndex] };

      unit.unitIds = [...(unit.unitIds || [])];
      if (!unit.unitIds[idIndex]) {
        unit.unitIds[idIndex] = { unitId: '', status: 'vacant' }; // Default status
      }

      // Update the unitId value
      unit.unitIds[idIndex].unitId = value;

      updated[unitIndex] = unit;

      return updated;
    });
  };

  // Handle unit status change
  const handleUnitStatusChange = (unitIndex, uidIndex, newStatus) => {
    setUnitTypes((prevUnits) => {
      const updated = [...prevUnits];
      const unit = { ...updated[unitIndex] };

      unit.unitIds = [...(unit.unitIds || [])];
      if (!unit.unitIds[uidIndex]) {
        unit.unitIds[uidIndex] = { unitId: '', status: 'vacant' }; // Default status if not present
      }

      // Update the status of the unitId
      unit.unitIds[uidIndex].status = newStatus;

      updated[unitIndex] = unit;

      return updated;
    });
  };

  //Validate form
  const validateForm = () => {
    const errors = {};
  
    // Property Info
    if (!formData.propertyName.trim()) errors.propertyName = 'Property name is required';
    if (!formData.address.trim()) errors.address = 'Address is required';
    if (!formData.propertyType) errors.propertyType = 'Property type is required';
    if (!formData.serviceRate.model) errors['serviceRate.model'] = 'Select a service rate model';
    if (!formData.serviceRate.value) errors['serviceRate.value'] = 'Enter service rate value';
  
    // Payment Details validation (nested fields)
    const pd = formData.paymentDetails;
    if (!pd.accountName.trim()) errors['paymentDetails.accountName'] = 'Account name is required';
    if (!pd.accountNumber.trim()) errors['paymentDetails.accountNumber'] = 'Account number is required';
    if (!pd.bank.trim()) errors['paymentDetails.bank'] = 'Bank is required';
    if (!pd.deadline) errors['paymentDetails.deadline'] = 'Enter payment due date (1–31)';

    // Landlord validation (nested fields)
    const ll = formData.landlord;
    if (!ll.name.trim()) errors['landlord.name'] = 'Landlord name is required';
    if (!ll.phone.trim() || !/^\+254\d{9}$/.test(ll.phone)) errors['landlord.phone'] = 'Valid phone number required (e.g., +254XXXXXXXXX)';
    if (!ll.email.trim() || !/\S+@\S+\.\S+/.test(ll.email)) errors['landlord.email'] = 'Valid email required';

    // Utility validation (nested fields)
    const utilities = formData.utilities;
    if (!utilities.water) errors['utilities.water'] = 'Water billing method is required';
    if (utilities.water && !utilities.waterRate) errors['utilities.waterRate'] = 'Water rate is required';
    if (!utilities.garbage) errors['utilities.garbage'] = 'Garbage fee is required';

    // Units validation (unit-specific errors)
    unitTypes.forEach((unit, idx) => {
    if (!unit.type) errors[`unit_type_${idx}`] = 'Select unit type';
    if (!unit.rent) errors[`unit_rent_${idx}`] = 'Enter rent';
    if (!unit.deposit) errors[`unit_deposit_${idx}`] = 'Enter deposit';
    if (!unit.count || unit.unitIds.some(id => !id || !id.unitId)) errors[`unit_ids_${idx}`] = 'Enter all unit IDs';
  });
    
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
    }; 

  // Submit handler
  const handleSubmit = async (e) => {
    e.preventDefault();

    setIsSubmitting(true);
    setSubmitStatus(null);

    const errors = validateForm();
    if (Object.keys(errors).length > 0) {
      setFormErrors(errors);
      setIsSubmitting(false);
      return;
    }

    // Prepare the cleaned unitTypes without top-level status
    const updatedUnitTypes = unitTypes.map(unit => {
      // Ensure each unitId object has the correct structure
      const cleanedUnitIds = (unit.unitIds || []).map((uidObj) => ({
        unitId: uidObj.unitId || '',
        status: uidObj.status || 'vacant', // default fallback if missing
      }));

      return {
        type: unit.type,
        rent: unit.rent,
        deposit: unit.deposit,
        count: unit.count,
        unitIds: cleanedUnitIds,
      };
    });

    // Final payload
    const payload = {
      ...formData,
      units: updatedUnitTypes,
    };

    console.log("Submitting payload:", JSON.stringify(payload, null, 2));

    // Proceed with form submission here (e.g. axios.post)

    try {
      const response = await axios.post('/properties', payload);
      console.log('Property saved:', response.data);

      setSubmitStatus('success');
      window.scrollTo({ top: 0, behavior: 'smooth' });

      // Reset form state
      setFormData(initialFormData);
      setUnitTypes([]);
      setFormErrors({});
    } catch (error) {
      console.error('Submission error:', error);
      setSubmitStatus('error');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="max-w-4xl mx-auto p-6 bg-white rounded shadow space-y-6">
      {/* Property Info */}
      <section>
        <h2 className="text-xl font-semibold mb-4">Property Info</h2>

        <input
          name="propertyName"
          type="text"
          placeholder="Property Name"
          className="w-full mb-3 border rounded px-3 py-2"
          value={formData.propertyName}
          onChange={handleChange}
        />
        {formErrors.propertyName && (
          <p className="text-red-600 text-sm">{formErrors.propertyName}</p>
          )}

        <input
          name="address"
          type="text"
          placeholder="Address"
          className="w-full mb-3 border rounded px-3 py-2"
          value={formData.address}
          onChange={handleChange}
        />
        {formErrors.address && (
          <p className="text-red-600 text-sm">{formErrors.address}</p>
          )}

        <select
          name="propertyType"
          className="w-full mb-3 border rounded px-3 py-2"
          value={formData.propertyType}
          onChange={handleChange}
        >
          <option value="">Select Property Type</option>
          <option value="Residential">Residential</option>
          <option value="Commercial">Commercial</option>
          <option value="Mixed Use">Mixed Use</option>
        </select>
        {formErrors.propertyType && (
          <p className="text-red-600 text-sm">{formErrors.propertyType}</p>
          )}

        <select
          name="serviceRateModel"
          className="w-full mb-3 border rounded px-3 py-2"
          value={formData.serviceRate.model}
          onChange={(e) =>
            setFormData((prev) => ({
              ...prev,
              serviceRate: { ...prev.serviceRate, model: e.target.value }
            }))
          }
        >
          <option value="">Service Rate Model</option>
          <option value="Fixed">Fixed</option>
          <option value="Percent">Percent</option>
        </select>

        {formErrors?.serviceRate?.model && (
          <p className="text-red-600 text-sm">{formErrors.serviceRate.model}</p>
        )}

        {formData.serviceRate.model && (
          <input
            type="number"
            name="serviceRateValue"
            placeholder={
              formData.serviceRate.model === 'Fixed' ? 'Amount (Kes.)' : 'Percentage (%)'
            }
            className="w-full mb-3 border rounded px-3 py-2"
            value={formData.serviceRate.value || ''} // Ensure it's not undefined
            onChange={(e) =>
              setFormData((prev) => ({
                ...prev,
                serviceRate: { 
                  ...prev.serviceRate, 
                  value: e.target.value === '' ? '' : parseFloat(e.target.value) // Parse to number
                }
              }))
            }
          />
        )}

        {formErrors?.serviceRate?.value && (
          <p className="text-red-600 text-sm">{formErrors.serviceRate.value}</p>
        )}
      </section>

      {/* Payment Details */}
      <section>
        <h2 className="text-xl font-semibold mb-4">Payment Details</h2>

        <input
          name="accountName"
          placeholder="Account Name"
          className="w-full mb-3 border rounded px-3 py-2"
          value={formData.paymentDetails.accountName}
          onChange={(e) => handleNestedChange(e, 'paymentDetails')}
        />
        {formErrors['paymentDetails.accountName'] && (
          <p className="text-red-600 text-sm">{formErrors['paymentDetails.accountName']}</p>
        )}

        <input
          name="accountNumber"
          placeholder="Account Number"
          className="w-full mb-3 border rounded px-3 py-2"
          value={formData.paymentDetails.accountNumber}
          onChange={(e) => handleNestedChange(e, 'paymentDetails')}
        />
        {formErrors['paymentDetails.accountNumber'] && (
          <p className="text-red-600 text-sm">{formErrors['paymentDetails.accountNumber']}</p>
        )}

        <input
          name="bank"
          placeholder="Bank"
          className="w-full mb-3 border rounded px-3 py-2"
          value={formData.paymentDetails.bank}
          onChange={(e) => handleNestedChange(e, 'paymentDetails')}
        />
        {formErrors['paymentDetails.bank'] && (
          <p className="text-red-600 text-sm">{formErrors['paymentDetails.bank']}</p>
        )}

        <input
          name="deadline"
          type="number"
          min="1"
          max="31"
          placeholder="Rent Due Day (1–31)"
          className="w-full mb-3 border rounded px-3 py-2"
          value={formData.paymentDetails.deadline}
          onChange={(e) => handleNestedChange(e, 'paymentDetails')}
        />
        {formErrors['paymentDetails.deadline'] && (
          <p className="text-red-600 text-sm">{formErrors['paymentDetails.deadline']}</p>
        )}
      </section>

      {/* Landlord Section */}
      <section>
        <h2 className="text-xl font-semibold mb-4">Landlord Info</h2>

        <input
          name="name"
          placeholder="Name"
          className="w-full mb-3 border rounded px-3 py-2"
          value={formData.landlord.name}
          onChange={(e) => handleNestedChange(e, 'landlord')}
        />
        {formErrors['landlord.name'] && (
          <p className="text-red-600 text-sm">{formErrors['landlord.name']}</p>
          )}

        <input
          name="phone"
          placeholder="Phone"
          className="w-full mb-3 border rounded px-3 py-2"
          value={formData.landlord.phone}
          onChange={(e) => handleNestedChange(e, 'landlord')}
        />
        {formErrors['landlord.phone'] && (
          <p className="text-red-600 text-sm">{formErrors['landlord.phone']}</p>
          )}

        <input
          name="email"
          placeholder="Email"
          className="w-full mb-3 border rounded px-3 py-2"
          value={formData.landlord.email}
          onChange={(e) => handleNestedChange(e, 'landlord')}
        />
        {formErrors['landlord.email'] && (
          <p className="text-red-600 text-sm">{formErrors['landlord.email']}</p>
          )}
      </section>

      {/* Utility Section */}
      <section>
        <h2 className="text-xl font-semibold mb-4">Utility Settings</h2>

        <select
          name="water"
          className="w-full mb-3 border rounded px-3 py-2"
          value={formData.utilities.water}
          onChange={(e) => handleNestedChange(e, 'utilities')}
        >
          <option value="">Water Billing Method</option>
          <option value="Metered">Metered</option>
          <option value="Fixed">Fixed</option>
        </select>
        {formErrors['utilities.water'] && (
          <p className="text-red-600 text-sm">{formErrors['utilities.water']}</p>
        )}

        {formData.utilities.water && (
          <input
            type="number"
            name="waterRate"
            placeholder={
              formData.utilities.water === 'Fixed' ? 'Amount (Kes.)' : 'Cost per kL (Kes./kL)'
            }
            className="w-full mb-3 border rounded px-3 py-2"
            value={formData.utilities.waterRate}
            onChange={(e) => handleNestedChange(e, 'utilities')}
          />
        )}
        {formErrors['utilities.waterRate'] && (
          <p className="text-red-600 text-sm">{formErrors['utilities.waterRate']}</p>
        )}

        <input
          type="number"
          name="garbage"
          placeholder="Garbage Fee (Kes.)"
          className="w-full mb-3 border rounded px-3 py-2"
          value={formData.utilities.garbage}
          onChange={(e) => handleNestedChange(e, 'utilities')}
        />
        {formErrors['utilities.garbage'] && (
          <p className="text-red-600 text-sm">{formErrors['utilities.garbage']}</p>
        )}
      </section>

      {/* Units Section */}
      <section>
        <h2 className="text-xl font-semibold mb-4">Units Types</h2>

        <button
          type="button"
          className="mb-4 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
          onClick={addUnitType}
        >
          + Add Unit Type
        </button>

        {unitTypes.map((unit, index) => (
          <div key={index} className="border p-4 mb-4 rounded">
            {/* Unit Type */}
            <select
              value={unit.type}
              onChange={(e) => handleUnitChange(index, 'type', e.target.value)}
              className="w-full mb-2 border rounded px-3 py-2"
            >
              <option value="">Select Unit Type</option>
              <option value="Room">Room</option>
              <option value="Studio">Studio</option>
              <option value="1br">1 Bedroom</option>
              <option value="2br">2 Bedroom</option>
              <option value="3br">3 Bedroom</option>
            </select>
            {formErrors[`unit_type_${index}`] && (
              <p className="text-red-600 text-sm">{formErrors[`unit_type_${index}`]}</p>
            )}

            {/* Rent */}
            <input
              type="number"
              placeholder="Rent (Kes.)"
              className="w-full mb-2 border rounded px-3 py-2"
              value={unit.rent}
              onChange={(e) => handleUnitChange(index, 'rent', e.target.value)}
            />
            {formErrors[`unit_rent_${index}`] && (
              <p className="text-red-600 text-sm">{formErrors[`unit_rent_${index}`]}</p>
            )}

            {/* Deposit */}
            <input
              type="number"
              placeholder="Deposit (Kes.)"
              className="w-full mb-2 border rounded px-3 py-2"
              value={unit.deposit}
              onChange={(e) => handleUnitChange(index, 'deposit', e.target.value)}
            />
            {formErrors[`unit_deposit_${index}`] && (
              <p className="text-red-600 text-sm">{formErrors[`unit_deposit_${index}`]}</p>
            )}

            {/* Number of Units */}
            <input
              type="number"
              placeholder="Number of Units"
              className="w-full mb-2 border rounded px-3 py-2"
              value={unit.count}
              onChange={(e) => handleUnitChange(index, 'count', e.target.value)}
            />
            {formErrors[`unit_count_${index}`] && (
              <p className="text-red-600 text-sm">{formErrors[`unit_count_${index}`]}</p>
            )}

            {/* Unit IDs & Status per ID */}
            {(unit.unitIds || []).map((uidObj, uidIndex) => (
              <div key={uidIndex} className="flex items-center gap-2 mb-2">
                <input
                  type="text"
                  placeholder={`Unit ID #${uidIndex + 1}`}
                  className="flex-[2] border rounded px-3 py-2"
                  value={uidObj.unitId}
                  onChange={(e) => handleUnitIdChange(index, uidIndex, e.target.value)}
                />
                <select
                  className="flex-[2] border rounded px-3 py-2"
                  value={uidObj.status || 'vacant'}
                  onChange={(e) => handleUnitStatusChange(index, uidIndex, e.target.value)}
                >
                  <option value="vacant">vacant</option>
                  <option value="occupied">occupied</option>
                </select>
              </div>
            ))}
            {formErrors[`unit_ids_${index}`] && (
              <p className="text-red-600 text-sm">{formErrors[`unit_ids_${index}`]}</p>
            )}
          </div>
        ))}
      </section>

      {isSubmitting && (
        <p className="text-blue-600 text-sm mb-2">Saving...</p>
      )}

      {submitStatus === 'success' && (
        <p className="text-green-600 text-sm mb-2">✅Property saved successfully!</p>
      )}

      {submitStatus === 'error' && (
        <p className="text-red-600 text-sm mb-2">An error occurred. Please try again.</p>
      )}


      <button
        type="submit"
        className={`w-full mt-6 text-white py-3 rounded transition duration-200 ${
          isSubmitting ? 'bg-gray-400 cursor-not-allowed' : 'bg-orange-500 hover:bg-orange-700'
        }`}
        disabled={isSubmitting}
      >
        {isSubmitting ? 'Saving...' : 'Save Property'}
      </button>

    </form>
  );
}

export default PropertyForm;
