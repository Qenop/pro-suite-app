//src\pages\tabs\PaymentsTab.jsx
import React, { useState, useEffect } from 'react';
import axios from '../../api/axiosInstance';;
import { useOutletContext } from 'react-router-dom';

const PaymentsTab = () => {
  const { property } = useOutletContext();
  const [tenants, setTenants] = useState([]);
  const [payments, setPayments] = useState([]);
  const [showForm, setShowForm] = useState(false); // 👈 Toggle state
  const [formData, setFormData] = useState({
    tenantId: '',
    unitId: '',
    amount: '',
    date: '',
    method: '',
    paymentReference: '',
    type: '',
    period: '',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [loadingPayments, setLoadingPayments] = useState(false);
  const [filters, setFilters] = useState({
    tenantName: '',
    unitId: '',
    type: '',
  });


  useEffect(() => {
    const fetchTenants = async () => {
      try {
        const res = await axios.get(`/tenants?propertyId=${property._id}`);
        setTenants(res.data);
      } catch (err) {
        console.error('Failed to load tenants:', err);
      }
    };
    if (property?._id) fetchTenants();
  }, [property]);

  useEffect(() => {
    const fetchPayments = async () => {
      setLoadingPayments(true);
      try {
        const res = await axios.get(`/properties/${property._id}/payments`);
        setPayments(res.data);
      } catch (err) {
        console.error('Failed to load payments:', err);
      } finally {
        setLoadingPayments(false);
      }
    };
    if (property?._id) fetchPayments();
  }, [property]);

  const handleTenantChange = (e) => {
    const tenantId = e.target.value;
    const tenant = tenants.find((t) => t._id === tenantId);
    setFormData((prev) => ({
      ...prev,
      tenantId,
      unitId: tenant?.unitId || '',
    }));
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => {
      if (name === 'date') {
        const period = value ? value.slice(0, 7) : '';
        return { ...prev, date: value, period };
      }
      return { ...prev, [name]: value };
    });
  };

  // Filter
  const handleFilterChange = (e) => {
  const { name, value } = e.target;
  setFilters((prev) => ({ ...prev, [name]: value }));
  };


  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const payload = {
        ...formData,
        amount: Number(formData.amount),
        date: new Date(formData.date).toISOString(),
        period: formData.period,
      };

      await axios.post(`/properties/${property._id}/payments`, payload);

      alert('Payment recorded successfully');
      setFormData({
        tenantId: '',
        unitId: '',
        amount: '',
        date: '',
        method: '',
        paymentReference: '',
        type: '',
        period: '',
      });

      const res = await axios.get(`/properties/${property._id}/payments`);
      setPayments(res.data);
      setShowForm(false); // Optional: collapse after save
    } catch (error) {
      console.error('Payment submission failed:', error);
      alert('Error saving payment');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="p-4">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-semibold">Payments</h2>
        <button
          onClick={() => setShowForm((prev) => !prev)}
          className="bg-cyan-700 text-white px-4 py-2 rounded hover:bg-black"
        >
          {showForm ? 'Close Form' : 'Record Payment'}
        </button>
      </div>

      {/* Collapsible Form */}
      <div
        className={`transition-all duration-500 ease-in-out overflow-hidden ${
          showForm ? 'max-h-[1000px] mb-8' : 'max-h-0'
        }`}
      >
        <form onSubmit={handleSubmit} className="space-y-4 max-w-xl">
          {/* Tenant Select */}
          <div>
            <label className="block mb-1">Tenant</label>
            <select
              name="tenantId"
              value={formData.tenantId}
              onChange={handleTenantChange}
              className="w-full border rounded p-2"
              required
            >
              <option value="">Select Tenant</option>
              {tenants.map((tenant) => (
                <option key={tenant._id} value={tenant._id}>
                  {tenant.name} ({tenant.unitId})
                </option>
              ))}
            </select>
          </div>

          {/* Unit ID */}
          <div>
            <label className="block mb-1">Unit ID</label>
            <input
              type="text"
              name="unitId"
              value={formData.unitId}
              readOnly
              className="w-full border rounded p-2 bg-gray-100"
            />
          </div>

          {/* Amount */}
          <div>
            <label className="block mb-1">Amount</label>
            <input
              type="number"
              name="amount"
              value={formData.amount}
              onChange={handleChange}
              className="w-full border rounded p-2"
              required
            />
          </div>

          {/* Date */}
          <div>
            <label className="block mb-1">Date</label>
            <input
              type="date"
              name="date"
              value={formData.date}
              onChange={handleChange}
              className="w-full border rounded p-2"
              required
            />
          </div>

          {/* Payment Type */}
          <div>
            <label className="block mb-1">Payment Type</label>
            <select
              name="type"
              value={formData.type}
              onChange={handleChange}
              className="w-full border rounded p-2"
              required
            >
              <option value="">Select Type</option>
              <option value="Rent">Rent</option>
              <option value="Deposit">Deposit</option>
            </select>
          </div>

          {/* Method */}
          <div>
            <label className="block mb-1">Payment Method</label>
            <select
              name="method"
              value={formData.method}
              onChange={handleChange}
              className="w-full border rounded p-2"
              required
            >
              <option value="">Select Method</option>
              <option value="mpesa">Mpesa</option>
              <option value="bank">Bank Transfer</option>
              <option value="cash">Cash</option>
            </select>
          </div>

          {/* Reference */}
          <div>
            <label className="block mb-1">Payment Reference</label>
            <input
              type="text"
              name="paymentReference"
              value={formData.paymentReference}
              onChange={handleChange}
              className="w-full border rounded p-2"
              placeholder="e.g. MPESA CODE / BANK REF"
            />
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className="bg-orange-600 text-white px-4 py-2 rounded hover:bg-red-700"
          >
            {isSubmitting ? 'Saving...' : 'Record Payment'}
          </button>
        </form>
      </div>

      {/* Filter Bar */}
      <div className="mb-4 flex flex-wrap gap-4 items-end">
        <div>
          <label className="block text-sm mb-1">Tenant Name</label>
          <input
            type="text"
            name="tenantName"
            value={filters.tenantName}
            onChange={handleFilterChange}
            className="border rounded p-2 w-48"
            placeholder="Search by name"
          />
        </div>
        <div>
          <label className="block text-sm mb-1">Unit ID</label>
          <input
            type="text"
            name="unitId"
            value={filters.unitId}
            onChange={handleFilterChange}
            className="border rounded p-2 w-36"
            placeholder="e.g. A1"
          />
        </div>
        <div>
          <label className="block text-sm mb-1">Payment Type</label>
          <select
            name="type"
            value={filters.type}
            onChange={handleFilterChange}
            className="border rounded p-2 w-36"
          >
            <option value="">All</option>
            <option value="Rent">Rent</option>
            <option value="Deposit">Deposit</option>
          </select>
        </div>
      </div>

      {/* Payments Table */}
      <div className="mt-4 max-w-4xl">
        <h3 className="text-xl font-semibold mb-4">Payments History</h3>

        {loadingPayments ? (
          <p>Loading payments...</p>
        ) : payments.length === 0 ? (
          <p>No payments recorded yet.</p>
        ) : (
          <table className="w-full border-collapse border border-gray-300">
            <thead>
              <tr className="bg-gray-100">
                <th className="border px-4 py-2 text-left">Date</th>
                <th className="border px-4 py-2 text-left">Tenant</th>
                <th className="border px-4 py-2 text-left">Unit</th>
                <th className="border px-4 py-2 text-left">Period</th>
                <th className="border px-4 py-2 text-right">Amount (KES)</th>
                <th className="border px-4 py-2 text-left">Type</th>
                <th className="border px-4 py-2 text-left">Method</th>
                <th className="border px-4 py-2 text-left">Reference</th>
              </tr>
            </thead>
            <tbody>
              {payments
              .filter((p) => {
                const tenantNameMatch = p.tenantId?.name
                  ?.toLowerCase()
                  .includes(filters.tenantName.toLowerCase());
                const unitMatch = p.unitId
                  ?.toLowerCase()
                  .includes(filters.unitId.toLowerCase());
                const typeMatch = filters.type ? p.type === filters.type : true;
                return tenantNameMatch && unitMatch && typeMatch;
              })
              .map((payment) => (
                <tr key={payment._id} className="even:bg-gray-50">
                  <td className="border border-gray-300 px-4 py-2">
                    {new Date(payment.date).toLocaleDateString()}
                  </td>
                  <td className="border border-gray-300 px-4 py-2">{payment.tenantId?.name || 'N/A'}</td>
                  <td className="border border-gray-300 px-4 py-2">{payment.unitId}</td>
                  <td className="border border-gray-300 px-4 py-2">{payment.period || '-'}</td>
                  <td className="border border-gray-300 px-4 py-2 text-right">
                    {payment.amount.toLocaleString()}
                  </td>
                  <td className="border border-gray-300 px-4 py-2 capitalize">{payment.type || '-'}</td>
                  <td className="border border-gray-300 px-4 py-2">{payment.method}</td>
                  <td className="border border-gray-300 px-4 py-2">{payment.paymentReference || '-'}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
};

export default PaymentsTab;
