//src\pages\tabs\ExpensesTab.jsx
import React, { useState, useEffect, useCallback } from 'react';
import axios from '../../api/axiosInstance';;
import { useOutletContext } from 'react-router-dom';

const ExpensesTab = () => {
  const { property } = useOutletContext();
  const [expenses, setExpenses] = useState([]);
  const [amount, setAmount] = useState('');
  const [description, setDescription] = useState('');
  const [date, setDate] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [showForm, setShowForm] = useState(false); //form toggle


  const fetchExpenses = useCallback(async () => {
    try {
      const res = await axios.get(`/properties/${property._id}/expenses`);
      setExpenses(res.data);
    } catch (err) {
      console.error(err);
      setError('Failed to fetch expenses');
    }
  }, [property._id]);

  useEffect(() => {
    fetchExpenses();
  }, [fetchExpenses]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (!amount || !description || !date) {
      setError('Please fill in all fields');
      return;
    }

    try {
      await axios.post(`/properties/${property._id}/expenses`, {
        amount,
        description,
        date,
      });
      setSuccess('Expense recorded successfully');
      setAmount('');
      setDescription('');
      setDate('');
      fetchExpenses();
      // Collapse the form after a short delay (optional: allows success message to show)
      setTimeout(() => {
      setShowForm(false);
    }, 800); // 0.8s delay
    
    } catch (err) {
      console.error(err);
      setError('Failed to record expense');
    }
  };

  return (
    <div className="p-4">
      <h2 className="text-xl font-semibold mb-4">Expenses</h2>

      {/* Toggle Button */}
      <button
        onClick={() => setShowForm(!showForm)}
        className="mb-4 bg-cyan-700 text-white px-4 py-2 rounded hover:bg-black"
      >
        {showForm ? 'Close Form' : 'Add New Expense'}
      </button>

      {/* Slide Down Form */}
      <div
        className={`transition-all duration-300 ease-in-out overflow-hidden ${
          showForm ? 'max-h-screen opacity-100' : 'max-h-0 opacity-0'
        }`}
      >
        <form onSubmit={handleSubmit} className="mb-6 space-y-4">
          <div>
            <label className="block font-medium">Amount</label>
            <input
              type="number"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              className="w-full border rounded p-2"
              placeholder="Enter amount"
            />
          </div>

          <div>
            <label className="block font-medium">Description</label>
            <input
              type="text"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full border rounded p-2"
              placeholder="Enter description"
            />
          </div>

          <div>
            <label className="block font-medium">Date of Expense</label>
            <input
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              className="w-full border rounded p-2"
            />
          </div>

          <button
            type="submit"
            className="bg-orange-600 text-white px-4 py-2 rounded hover:bg-red-700"
          >
            Add Expense
          </button>

          {error && <p className="text-red-600 mt-2">{error}</p>}
          {success && <p className="text-green-600 mt-2">{success}</p>}
        </form>
      </div>


      <div>
        <h3 className="text-lg font-medium mb-2">Recorded Expenses</h3>
        {expenses.length === 0 ? (
          <p className="text-gray-500">No expenses recorded yet.</p>
        ) : (
          <ul className="space-y-2">
            {expenses.map((exp) => (
              <li key={exp._id} className="border p-2 rounded">
                <div className="font-semibold">KES {exp.amount}</div>
                <div className="text-sm text-gray-700">{exp.description}</div>
                <div className="text-xs text-gray-500">
                  On {new Date(exp.date).toLocaleDateString()} | Recorded: {new Date(exp.createdAt).toLocaleString()}
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
};

export default ExpensesTab;
