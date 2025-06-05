//src\pages\tabs\BillingsTab.jsx
import React, { useEffect, useState } from 'react';
import axios from '../../api/axiosInstance';
import { useOutletContext } from 'react-router-dom';
import dayjs from 'dayjs';

const BillingsTab = () => {
  const { property } = useOutletContext();
  const [period, setPeriod] = useState(dayjs().format('YYYY-MM')); // Default to current month
  const [bills, setBills] = useState([]);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');

  const fetchBills = async () => {
    if (!period) return;
    setLoading(true);
    setMessage('');
    try {
      const res = await axios.get(`/billing/${property._id}?period=${period}`);
      
      console.log('Bills response:', res.data);
      setBills(res.data.bills);
      if (res.data.bills.length === 0) {
        setMessage('No bills found for this period.');
      }
    } catch (err) {
      console.error(err);
      setMessage('Error fetching bills.');
    } finally {
      setLoading(false);
    }
  };

  const generateBills = async () => {
    if (!period) return;
    setLoading(true);
    setMessage('');
    try {
      const res = await axios.post(`/billing/generate/${property._id}`, { period });
      setMessage(res.data.message || 'Bills generated successfully.');
      await fetchBills(); // Refresh the table
    } catch (err) {
      console.error(err);
      setMessage('Error generating bills.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
  const fetchBills = async () => {
    if (!period) return;
    setLoading(true);
    setMessage('');
    try {
      const res = await axios.get(`/billing/${property._id}?period=${period}`);
      setBills(res.data.bills);
      if (res.data.bills.length === 0) {
        setMessage('No bills found for this period.');
      }
    } catch (err) {
      console.error(err);
      setMessage('Error fetching bills.');
    } finally {
      setLoading(false);
    }
  };

  if (property?._id) {
    fetchBills();
  }
}, [period, property?._id]);


  return (
    <div className="p-4 space-y-6">
      <div className="flex items-center justify-between gap-4 flex-wrap">
        <div>
          <label className="block text-sm font-medium">Billing Period</label>
          <input
            type="month"
            value={period}
            onChange={(e) => setPeriod(e.target.value)}
            className="border rounded px-3 py-1 mt-1"
          />
        </div>
        <button
          onClick={generateBills}
          disabled={loading}
          className="bg-cyan-700 text-white px-4 py-2 rounded hover:bg-black mt-6"
        >
          {loading ? 'Generating...' : 'Generate Bills'}
        </button>
      </div>

      {message && <p className="text-sm text-gray-600">{message}</p>}

      <div className="overflow-x-auto">
        <table className="min-w-full border mt-4">
          <thead className="bg-gray-300">
            <tr>
              <th className="p-2 border">Tenant</th>
              <th className="p-2 border">Unit</th>
              <th className="p-2 border">Rent</th>
              <th className="p-2 border">Water</th>
              <th className="p-2 border">Garbage</th>
              <th className="p-2 border">Prev Bal</th>
              <th className="p-2 border">Prev Credit</th>
              <th className="p-2 border">Total Due</th>
              <th className="p-2 border">Payments</th>
              <th className="p-2 border">Balance</th>
              <th className="p-2 border">Overpayment</th>
            </tr>
          </thead>
          <tbody>
            {bills.map((bill) => (
              <tr key={bill._id} className="text-sm text-center">
                <td className="p-2 border">{bill.tenantId?.name}</td>
                <td className="p-2 border">{bill.unitId}</td>
                <td className="p-2 border">{bill.rent}</td>
                <td className="p-2 border">{bill.water?.amount || 0}</td>
                <td className="p-2 border">{bill.garbageFee || 0}</td>
                <td className="p-2 border">{bill.carriedBalance || 0}</td>
                <td className="p-2 border">{bill.carriedOverpayment || 0}</td>
                <td className="p-2 border">{bill.totalDue}</td>
                <td className="p-2 border">{bill.paymentsReceived}</td>
                <td className="p-2 border">{bill.balance}</td>
                <td className="p-2 border">{bill.overpayment}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default BillingsTab;
