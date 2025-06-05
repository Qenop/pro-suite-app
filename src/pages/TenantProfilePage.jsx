//src\pages\TenantProfilePage.jsx
import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from '../api/axiosInstance';

// You can split these sections into separate files if preferred
const TenantOverviewSection = ({ tenant }) => {
  const [depositPaid, setDepositPaid] = useState(null);
  const [loadingDeposit, setLoadingDeposit] = useState(true);

  useEffect(() => {
    const fetchDeposit = async () => {
      try {
        const res = await axios.get(`/payments/tenant/${tenant._id}/deposit`);
        setDepositPaid(res.data.amount);
      } catch {
        setDepositPaid(null); // Fallback if deposit not found
      } finally {
        setLoadingDeposit(false);
      }
    };

    if (tenant?._id) {
      fetchDeposit();
    }
  }, [tenant?._id]);

  if (!tenant) return <p>Loading tenant data...</p>;

  return (
    <section className="max-w-3xl mx-auto bg-white p-6 rounded shadow mb-8">
      <h2 className="text-2xl font-semibold mb-6">Overview</h2>

      <div className="flex items-center space-x-6 mb-8">
        <img
          src={tenant.profilePicture ? `http://localhost:5000/uploads/${tenant.profilePicture}` : "/default-profile.png"}
          alt={`${tenant.name} profile`}
          className="w-24 h-24 rounded-full object-cover border border-gray-300"
        />
        <div>
          <h3 className="text-xl font-bold">{tenant.name}</h3>
          <p className="text-gray-600">
            Unit: <span className="font-medium">{tenant.unitId}</span>
          </p>
          <p className="text-gray-600">
            Deposit Paid:{" "}
            <span className="font-medium">
              {loadingDeposit ? "Loading..." : depositPaid ? `KES ${depositPaid}` : "N/A"}
            </span>
          </p>
        </div>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 text-gray-700">
        <div>
          <h4 className="font-semibold">Phone</h4>
          <p>{tenant.phone || "N/A"}</p>
        </div>
        <div>
          <h4 className="font-semibold">Email</h4>
          <p>{tenant.email || "N/A"}</p>
        </div>
        <div>
          <h4 className="font-semibold">ID Number</h4>
          <p>{tenant.idNumber || "N/A"}</p>
        </div>
        <div>
          <h4 className="font-semibold">Lease Start Date</h4>
          <p>
            {tenant.leaseStartDate
              ? new Date(tenant.leaseStartDate).toLocaleDateString()
              : "N/A"}
          </p>
        </div>
        <div>
          <h4 className="font-semibold">Gender</h4>
          <p>{tenant.gender || "N/A"}</p>
        </div>
        <div>
          <h4 className="font-semibold">Occupation</h4>
          <p>{tenant.occupation || "N/A"}</p>
        </div>
        <div>
        <h4 className="font-semibold">Emergency Contact</h4>
        {tenant.emergencyContact?.name || tenant.emergencyContact?.phone || tenant.emergencyContact?.relation ? (
            <div>
            <p><span className="font-medium">Name:</span> {tenant.emergencyContact.name || "N/A"}</p>
            <p><span className="font-medium">Phone:</span> {tenant.emergencyContact.phone || "N/A"}</p>
            <p><span className="font-medium">Relation:</span> {tenant.emergencyContact.relation || "N/A"}</p>
            </div>
        ) : (
            <p>N/A</p>
        )}
        </div>
        <div className="sm:col-span-2">
          <h4 className="font-semibold">Additional Notes</h4>
          <p className="whitespace-pre-wrap">
            {tenant.notes || "None"}
          </p>
        </div>
      </div>
    </section>
  );
};

// Fetch and display payments related to this tenant
const TenantPaymentsSection = ({ tenantId }) => {
  const [payments, setPayments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!tenantId) return;

    const fetchPayments = async () => {
      setLoading(true);
      setError("");
      try {
        const res = await axios.get(`/payments/tenant/${tenantId}`);
        setPayments(res.data);
      } catch (err) {
        console.error("Error fetching tenant payments:", err);
        setError("Failed to load payments.");
      } finally {
        setLoading(false);
      }
    };

    fetchPayments();
  }, [tenantId]);

  if (loading) return <p>Loading payments...</p>;
  if (error) return <p className="text-red-600">{error}</p>;

  if (payments.length === 0)
    return (
      <section className="max-w-3xl mx-auto bg-white p-6 rounded shadow mb-8">
        <h2 className="text-2xl font-semibold mb-6">Payments</h2>
        <p>No payments found for this tenant.</p>
      </section>
    );

  return (
    <section className="max-w-3xl mx-auto bg-white p-6 rounded shadow mb-8">
      <h2 className="text-2xl font-semibold mb-6">Payments</h2>
      <table className="w-full text-left border-collapse">
        <thead>
          <tr>
            <th className="border-b px-4 py-2">Date</th>
            <th className="border-b px-4 py-2">Amount</th>
            <th className="border-b px-4 py-2">Type</th>
            <th className="border-b px-4 py-2">Method</th>
            <th className="border-b px-4 py-2">Reference</th>
          </tr>
        </thead>
        <tbody>
          {payments.map((payment) => (
            <tr key={payment._id}>
              <td className="border-b px-4 py-2">
                {new Date(payment.date).toLocaleDateString()}
              </td>
              <td className="border-b px-4 py-2">KES {payment.amount}</td>
              <td className="border-b px-4 py-2">{payment.type}</td>
              <td className="border-b px-4 py-2">{payment.method || "-"}</td>
              <td className="border-b px-4 py-2">{payment.paymentReference || "-"}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </section>
  );
};

// TODO: Fetch and display bills related to this tenant
const TenantBillsSection = ({ tenantId }) => {
  const [bills, setBills] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!tenantId) return;

    const fetchBills = async () => {
      setLoading(true);
      setError("");
      try {
        const res = await axios.get(`/billing/tenant/${tenantId}`);
        setBills(res.data);
      } catch (err) {
        console.error("Error fetching tenant bills:", err);
        setError("Failed to load bills.");
      } finally {
        setLoading(false);
      }
    };

    fetchBills();
  }, [tenantId]);

  if (loading) return <p>Loading bills...</p>;
  if (error) return <p className="text-red-600">{error}</p>;

  if (bills.length === 0)
    return (
      <section className="max-w-3xl mx-auto bg-white p-6 rounded shadow mb-8">
        <h2 className="text-2xl font-semibold mb-6">Bills</h2>
        <p>No bills found for this tenant.</p>
      </section>
    );

  return (
    <section className="max-w-3xl mx-auto bg-white p-6 rounded shadow mb-8 overflow-x-auto">
      <h2 className="text-2xl font-semibold mb-6">Bills</h2>
      <table className="w-full text-left border-collapse min-w-[700px]">
        <thead>
          <tr>
            <th className="border-b px-4 py-2">Period</th>
            <th className="border-b px-4 py-2">Rent </th>
            <th className="border-b px-4 py-2">Garbage </th>
            <th className="border-b px-4 py-2">Water </th>
            <th className="border-b px-4 py-2">Total Due </th>
            <th className="border-b px-4 py-2">Balance </th>
            <th className="border-b px-4 py-2">Overpaid</th>
          </tr>
        </thead>
        <tbody>
          {bills.map((bill) => (
            <tr key={bill._id}>
              <td className="border-b px-4 py-2">{bill.period}</td>
              <td className="border-b px-4 py-2">{bill.rent}</td>
              <td className="border-b px-4 py-2">{bill.garbageFee}</td>
              <td className="border-b px-4 py-2">{bill.water?.amount ?? "-"}</td>
              <td className="border-b px-4 py-2">{bill.totalDue}</td>
              <td className="border-b px-4 py-2">{bill.balance}</td>
              <td className="border-b px-4 py-2">{bill.overpayment ?? "-"}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </section>
  );
};

// TODO: Fetch and display invoices related to this tenant
const TenantInvoicesSection = ({ tenantId, propertyId }) => {
  const [invoices, setInvoices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!tenantId) return;

    const fetchInvoices = async () => {
      setLoading(true);
      setError("");
      try {
        // Adjusted endpoint with property scoping
        const res = await axios.get(`/properties/${propertyId}/invoices/tenant/${tenantId}`);
        setInvoices(res.data);
      } catch (err) {
        console.error("Error fetching tenant invoices:", err);
        setError("Failed to load invoices.");
      } finally {
        setLoading(false);
      }
    };
   
    fetchInvoices();
  }, [tenantId,propertyId]);

  if (loading) return <p>Loading invoices...</p>;
  if (error) return <p className="text-red-600">{error}</p>;

  if (invoices.length === 0) {
    return (
      <section className="max-w-3xl mx-auto bg-white p-6 rounded shadow mb-8">
        <h2 className="text-2xl font-semibold mb-6">Invoices</h2>
        <p>No invoices found for this tenant in this property.</p>
      </section>
    );
  }

  return (
    <section className="max-w-3xl mx-auto bg-white p-6 rounded shadow mb-8 overflow-x-auto">
      <h2 className="text-2xl font-semibold mb-6">Invoices</h2>
      <table className="w-full text-left border-collapse min-w-[700px]">
        <thead>
          <tr>
            <th className="border-b px-4 py-2">Invoice #</th>
            <th className="border-b px-4 py-2">Date</th>
            <th className="border-b px-4 py-2">Amount</th>
            <th className="border-b px-4 py-2">Status</th>
            <th className="border-b px-4 py-2">Due Date</th>
          </tr>
        </thead>
        <tbody>
          {invoices.map((invoice) => (
            <tr key={invoice._id}>
              <td className="border-b px-4 py-2">{invoice.invoiceNumber || invoice._id}</td>
              <td className="border-b px-4 py-2">
                {new Date(invoice.createdAt).toLocaleDateString()}
              </td>
              <td className="border-b px-4 py-2">KES {invoice.totalDue}</td>
              <td className="border-b px-4 py-2 capitalize">
                {invoice.status || "pending"}
              </td>
              <td className="border-b px-4 py-2">
                {invoice.dueDate
                  ? new Date(invoice.dueDate).toLocaleDateString()
                  : "N/A"}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </section>
  );
};


const TenantRequestsSection = () => {
  // TODO: Fetch and display requests related to this tenant
  return (
    <section className="max-w-3xl mx-auto bg-white p-6 rounded shadow mb-8">
      <h2 className="text-2xl font-semibold mb-6">Requests</h2>
      <p>Requests info will be displayed here.</p>
    </section>
  );
};

const TenantMessagesSection = () => {
  // TODO: Fetch and display messages related to this tenant
  return (
    <section className="max-w-3xl mx-auto bg-white p-6 rounded shadow mb-8">
      <h2 className="text-2xl font-semibold mb-6">Messages</h2>
      <p>Messages will be displayed here.</p>
    </section>
  );
};

const TenantProfilePage = () => {
  const { id } = useParams();
  const navigate = useNavigate(); // ⬅️ Add this
  const [tenant, setTenant] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchTenant = async () => {
      try {
        const res = await axios.get(`/tenants/${id}`);
        setTenant(res.data);
      } catch (err) {
        console.error("Error fetching tenant profile:", err);
        setError("Failed to load tenant profile.");
      } finally {
        setLoading(false);
      }
    };

    fetchTenant();
  }, [id]);

  if (loading) return <p>Loading tenant profile...</p>;
  if (error) return <p className="text-red-600">{error}</p>;
  if (!tenant) return <p>Tenant not found.</p>;

  return (
    <div className="space-y-10 p-6 bg-gray-50 min-h-screen max-w-5xl mx-auto">
      {/* ⬅️ Back Button */}
      <button
        onClick={() => navigate(-1)}
        className="mb-4 inline-flex items-center text-sm text-blue-600 hover:underline focus:outline-none"
      >
        ← Back
      </button>

      <h1 className="text-4xl font-bold mb-10 sticky top-0 bg-gray-50 z-30 px-6 py-4 shadow-sm">
        Tenant Profile: {tenant.name}
      </h1>

      <TenantOverviewSection tenant={tenant} />
      <TenantPaymentsSection tenantId={id} />
      <TenantBillsSection tenantId={id} />
      <TenantInvoicesSection tenantId={id} />
      <TenantRequestsSection tenantId={id} />
      <TenantMessagesSection tenantId={id} />
    </div>
  );
};


export default TenantProfilePage;
