//src\pages\tabs\InvoicesTab.jsx
import React, { useEffect, useState, useCallback } from 'react';
import axios from '../../api/axiosInstance';;
import { useOutletContext } from 'react-router-dom';

const InvoicesTab = () => {
  const { property } = useOutletContext(); // Get property from parent route
  const propertyId = property?._id;
// status hooks
  const [invoices, setInvoices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [period, setPeriod] = useState(''); // single period state for filter + generate
  const [creating, setCreating] = useState(false);
  const [message, setMessage] = useState('');

  // Filters for tenant and unit only now
  const [tenantFilter, setTenantFilter] = useState('');
  const [unitFilter, setUnitFilter] = useState('');

  // Modal state for preview and sending invoice
  const [previewInvoice, setPreviewInvoice] = useState(null);
  const [sending, setSending] = useState(false);
  const [sendMessage, setSendMessage] = useState('');

  // Fetch invoices for property
  const fetchInvoices = useCallback(async () => {
    if (!propertyId) return;
    try {
      setLoading(true);
      setError('');
      const res = await axios.get(`/properties/${propertyId}/invoices`);
      setInvoices(res.data);
    } catch {
      setError('Failed to load invoices.');
    } finally {
      setLoading(false);
    }
  }, [propertyId]);

  useEffect(() => {
    fetchInvoices();
  }, [fetchInvoices]);

  // Validate period format YYYY-MM
  const isValidPeriod = (p) => /^\d{4}-(0[1-9]|1[0-2])$/.test(p);

  // Handle create invoices for selected period
  const handleCreateInvoices = async () => {
    if (!isValidPeriod(period)) {
      setMessage('Please select a valid month in YYYY-MM format before generating invoices.');
      return;
    }
    if (!propertyId) {
      setMessage('Property ID is missing.');
      return;
    }

    setMessage('');
    setCreating(true);

    try {
      const res = await axios.post(
        `/properties/${propertyId}/invoices/bulk`,
        { period }
      );
      if (Array.isArray(res.data)) {
        setInvoices((prev) => [...res.data, ...prev]);
        setMessage(`Created ${res.data.length} invoices for ${period}.`);
      } else if (res.data.message) {
        setMessage(res.data.message);
      }
    } catch {
      setMessage('Failed to create invoices.');
    } finally {
      setCreating(false);
    }
  };
  //define the handleStatusChange
  const handleStatusChange = async (invoiceId, newStatus) => {
  try {
    await axios.patch(`/properties/${propertyId}/invoices/${invoiceId}/status`, { status: newStatus });

    setInvoices((prevInvoices) =>
      prevInvoices.map((inv) =>
        inv._id === invoiceId ? { ...inv, status: newStatus } : inv
      )
    );
  } catch {
    setMessage('Failed to update invoice status.');
  }
  };

  // Filter invoices by tenant, unit, and period
  const filteredInvoices = invoices.filter((inv) => {
    const tenantMatch = tenantFilter
      ? inv.tenantId?.name.toLowerCase().includes(tenantFilter.toLowerCase())
      : true;
    const unitMatch = unitFilter
  ? (inv.unitId || '').toLowerCase?.().includes(unitFilter.toLowerCase())
  : true;
    const periodMatch = period ? inv.period === period : true;
    return tenantMatch && unitMatch && periodMatch;
  });

  // Open preview modal for sending invoice
  const openPreview = (invoice) => {
    setPreviewInvoice(invoice);
    setSendMessage('');
  };

  // Close preview modal
  const closePreview = () => {
    setPreviewInvoice(null);
    setSendMessage('');
  };

  // Send invoice (simulate backend action)
  const sendInvoice = async () => {
  if (!previewInvoice) return;
  setSending(true);
  setSendMessage('');

  try {
    const payload = {
      method: 'email',                    // to indicate sending via email
      subject: `Your Invoice for Period ${previewInvoice.period}`,
      message: `Dear ${previewInvoice.tenantId?.name}, 
      Please find attached your invoice for the billing period ${previewInvoice.period}.
      If you have any questions, feel free to contact us.

    Thank you for your prompt payment.

    Best regards,
    ${property?.propertyName}
  `,
      // For now, send invoice ID or URL for backend to generate PDF:
      invoiceId: previewInvoice._id
    };

    await axios.post(
      `/properties/${propertyId}/invoices/${previewInvoice._id}/send`,
      payload
    );

   setSendMessage('Invoice sent successfully!');
  } catch (error) {
    console.error('Failed to send invoice:', error); // log
    setSendMessage('Failed to send invoice.');
  } finally {
    setSending(false);
  }
};


  return (
    <div className="p-4">
      <h2 className="text-xl font-semibold mb-4">Invoices</h2>

      {/* Filters */}
      <div className="mb-4 flex flex-wrap gap-4 items-center">
        <label>
          Tenant Name:
          <input
            type="text"
            value={tenantFilter}
            onChange={(e) => setTenantFilter(e.target.value)}
            placeholder="Filter by tenant"
            className="ml-2 border rounded px-2 py-1"
          />
        </label>

        <label>
          Unit:
          <input
            type="text"
            value={unitFilter}
            onChange={(e) => setUnitFilter(e.target.value)}
            placeholder="Filter by unit"
            className="ml-2 border rounded px-2 py-1"
          />
        </label>

        <label>
          Period:
          <input
            type="month"
            value={period}
            onChange={(e) => setPeriod(e.target.value)}
            className="ml-2 border rounded px-2 py-1"
            max={new Date().toISOString().slice(0, 7)}
          />
        </label>
      </div>

      {/* Generate invoices */}
      <div className="mb-6 flex items-center gap-4">
        <button
          onClick={handleCreateInvoices}
          disabled={creating}
          className="bg-cyan-700 text-white px-4 py-2 rounded hover:bg-black disabled:opacity-50"
        >
          {creating ? 'Creating...' : 'Generate Invoices'}
        </button>
      </div>

      {message && (
        <div className="mb-4 text-sm text-indigo-700 bg-indigo-100 p-2 rounded">
          {message}
        </div>
      )}

      {loading ? (
        <div>Loading invoices...</div>
      ) : error ? (
        <div className="text-red-600">{error}</div>
      ) : filteredInvoices.length === 0 ? (
        <div>No invoices found with current filters.</div>
      ) : (
        <table className="min-w-full border border-gray-300 rounded">
          <thead className="bg-gray-100">
            <tr>
              <th className="border px-4 py-2 text-left">Invoice #</th>
              <th className="border px-4 py-2 text-left">Period</th>
              <th className="border px-4 py-2 text-left">Tenant</th>
              <th className="border px-4 py-2 text-left">Unit</th>
              <th className="border px-4 py-2 text-left">Total Due</th>
              <th className="border px-4 py-2 text-left">Status</th>
              <th className="border px-4 py-2 text-left">Issue Date</th>
              <th className="border px-4 py-2 text-center">Sent</th> 
              <th className="border px-4 py-2 text-left">Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredInvoices.map((inv) => (
              <tr key={inv._id} className="hover:bg-gray-50">
                <td className="border px-4 py-2">{inv.invoiceNumber}</td>
                <td className="border px-4 py-2">{inv.period}</td>
                <td className="border px-4 py-2">{inv.tenantId?.name || 'N/A'}</td>
                <td className="border px-4 py-2">{inv.unitId || 'N/A'}</td>
                <td className="border px-4 py-2">{inv.totalDue.toFixed(2)}</td>
                <td className="border px-4 py-2">
                  <select
                    value={inv.status}
                    onChange={(e) => handleStatusChange(inv._id, e.target.value)}
                    className="border rounded px-2 py-1"
                  >
                    <option value="Unpaid">Unpaid</option>
                    <option value="Partially Paid">Partially Paid</option>
                    <option value="Paid">Paid</option>
                    <option value="Overdue">Overdue</option>
                    <option value="Cancelled">Cancelled</option>
                  </select>
                </td>
                <td className="border px-4 py-2">
                  {new Date(inv.issueDate).toLocaleDateString()}
                </td>
                <td className="border px-4 py-2 text-center">
                  {(inv.sent?.email || inv.sent?.whatsapp) ? '✅' : '❌'}
                </td>
                <td className="border px-4 py-2">
                  <button
                    onClick={() => openPreview(inv)}
                    className="bg-green-600 text-white px-3 py-1 rounded hover:bg-green-700"
                  >
                    View
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}

      {/* Preview Modal */}
      {previewInvoice && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
          <div className="bg-white p-6 rounded-lg max-w-xl w-full max-h-[90vh] overflow-auto relative">
            <button
              onClick={closePreview}
              className="absolute top-2 right-2 text-gray-600 hover:text-gray-900 font-bold"
              aria-label="Close preview"
            >
              ✕
            </button>

            <h3 className="text-xl font-semibold mb-4">Invoice Preview</h3>

            <div className="mb-4">
              <div>
                <strong>Invoice Date:</strong>{' '}
                {new Date(previewInvoice.issueDate).toLocaleDateString()}
              </div>
              <div>
                <strong>Invoice No:</strong> {previewInvoice.invoiceNumber}
              </div>
              <div>
                <strong>Property:</strong> {property?.propertyName || 'N/A'}
              </div>
              <div>
                <strong>Tenant:</strong> {previewInvoice.tenantId?.name || 'N/A'}
              </div>
              <div>
                <strong>Unit:</strong> {previewInvoice.unitId || 'N/A'}
              </div>
              <div>
                <strong>Period:</strong> {previewInvoice.period}
              </div>
              <div>
                <strong>Status:</strong> {previewInvoice.status}
              </div>
              {previewInvoice.lineItems && (
                <div className="mt-4 border-t pt-4 space-y-4">
                  {/* Billing Breakdown */}
                  <div>
                    <strong className="block mb-2">Billing Breakdown</strong>
                    <table className="min-w-full border text-sm">
                      <thead>
                        <tr className="bg-gray-100">
                          <th className="border px-2 py-1 text-left">Description</th>
                          <th className="border px-2 py-1 text-right">Amount (KES)</th>
                        </tr>
                      </thead>
                      <tbody>
                        {previewInvoice.lineItems.map((item, index) => (
                          <tr key={index}>
                            <td className="border px-2 py-1">{item.label}</td>
                            <td className="border px-2 py-1 text-right">{item.amount.toFixed(2)}</td>
                          </tr>
                        ))}
                        <tr>
                          <td className="border px-2 py-1 font-semibold">Subtotal</td>
                          <td className="border px-2 py-1 text-right font-semibold">
                            {previewInvoice.lineItems
                              .reduce((sum, item) => sum + item.amount, 0)
                              .toFixed(2)}
                          </td>
                        </tr>
                        <tr>
                          <td className="border px-2 py-1 font-bold">Total Due</td>
                          <td className="border px-2 py-1 text-right font-bold">
                            {previewInvoice.totalDue?.toFixed(2) || '-'}
                          </td>
                        </tr>
                      </tbody>
                    </table>
                  </div>

                  {/* Water Usage Details */}
                  {previewInvoice.lineItems.some((item) => item.label.toLowerCase().includes('water') && item.detail) && (
                    <div>
                      <strong className="block mb-2">Water Usage Details</strong>
                      <table className="min-w-full border text-sm">
                        <thead>
                          <tr className="bg-gray-100">
                            <th className="border px-2 py-1">Previous</th>
                            <th className="border px-2 py-1">Current</th>
                            <th className="border px-2 py-1">Units</th>
                            <th className="border px-2 py-1">Rate</th>
                            <th className="border px-2 py-1">Amount</th>
                          </tr>
                        </thead>
                        <tbody>
                          {previewInvoice.lineItems
                            .filter((item) => item.label.toLowerCase().includes('water') && item.detail)
                            .map((item, index) => {
                              // Assume detail is a string like "0 → 3 units × 250"
                              const regex = /(\d+)\D+(\d+)\D+(\d+)\D+(\d+)/;
                              const match = item.detail?.match(regex);
                              const [prev, curr, units, rate] = match ? match.slice(1) : [null, null, null, null];
                              return (
                                <tr key={index}>
                                  <td className="border px-2 py-1 text-center">{prev}</td>
                                  <td className="border px-2 py-1 text-center">{curr}</td>
                                  <td className="border px-2 py-1 text-center">{units}</td>
                                  <td className="border px-2 py-1 text-center">{rate}</td>
                                  <td className="border px-2 py-1 text-right">{item.amount.toFixed(2)}</td>
                                </tr>
                              );
                            })}
                        </tbody>
                      </table>
                    </div>
                  )}
                </div>
              )}

              {/* Notes */}
              <div className="mb-4 text-sm bg-yellow-200 p-2 rounded">
                🔁 Notes
                <br />
                Please make payment by the due date to avoid penalties.
                <div className="mt-2">
                  <strong>Account Name:</strong> {property?.paymentDetails?.accountName || 'N/A'} <br />
                  <strong>Account Number:</strong> {property?.paymentDetails?.accountNumber || 'N/A'} <br />
                  <strong>Bank:</strong> {property?.paymentDetails?.bank || 'N/A'} <br />
                  <strong>Payment Deadline:</strong> {property?.paymentDetails?.deadline 
                    ? `By the ${property.paymentDetails.deadline}th  ` 
                    : 'N/A'}
                </div>

                {/* Carried Forward Balance */}
                {previewInvoice.lineItems.some(item => item.label === 'Carried Forward Balance') && (
                  <>
                    <br />
                    Carry-forward balance due from last period:{' '}
                    KES {previewInvoice.lineItems.find(item => item.label === 'Carried Forward Balance')?.amount.toFixed(2)}
                  </>
                )}

                {/* Carried Overpayment */}
                {previewInvoice.lineItems.some(item => item.label === 'Carried Overpayment') && (
                  <>
                    <br />
                    Overpayment credit from last period: KES {Math.abs(previewInvoice.lineItems.find(item => item.label === 'Carried Overpayment')?.amount || 0).toFixed(2)}
                  </>
                )}
              </div>

              {/* Send Invoice Actions */}
              <div className="flex justify-end space-x-3">
                <button
                  onClick={closePreview}
                  className="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400"
                  disabled={sending}
                >
                  Close
                </button>
                <button
                  onClick={sendInvoice}
                  disabled={sending}
                  className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 disabled:opacity-50"
                >
                  {sending ? 'Sending...' : 'Send Invoice'}
                </button>
              </div>
              {sendMessage && (
                <p className="mt-2 text-sm text-indigo-700">{sendMessage}</p>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default InvoicesTab;
