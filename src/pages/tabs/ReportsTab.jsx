//src\pages\tabs\ReportsTab.jsx 
import React, { useState, useEffect } from 'react';
import axios from '../../api/axiosInstance';
import { useOutletContext } from 'react-router-dom';
import { Line } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend);

const ReportsTab = () => {
  const { property } = useOutletContext();
  const propertyId = property?._id;

  const [selectedReport, setSelectedReport] = useState('balancesReports');
  const [reportsData, setReportsData] = useState({ 
    balancesReports: [],
    occupancyReports: [],
    utilityReports: {
      usageByTenantUnit: [],
      totalUsage: { waterUsage: 0, electricityUsage: 0 }
    },
    billingStats: [],
    financialReports: [],
  });

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Filters
  const [balanceStatusFilter, setBalanceStatusFilter] = useState('All');
  const [minBalanceFilter, setMinBalanceFilter] = useState('');
  const [periodFilter, setPeriodFilter] = useState('All');

  const [selectedMonth, setSelectedMonth] = useState('');
  const [selectedYear, setSelectedYear] = useState('');

  useEffect(() => {
    if (!propertyId) return;

    const fetchAllReports = async () => {
      setLoading(true);
      setError(null);
      try {
        const headers = { 'Cache-Control': 'no-cache' };
        const [
          balancesRes,
          occupancyRes,
          utilityRes,
          billingRes,
          financialRes,
        ] = await Promise.all([
          axios.get(`/reports/${propertyId}/balances`, { headers }),
          axios.get(`/reports/${propertyId}/occupancy`, { headers }),
          axios.get(`/reports/${propertyId}/utilities`, { headers }),
          axios.get(`/reports/${propertyId}/billing-stats`, { headers }),
          axios.get(`/reports/${propertyId}/financials`, { headers }),
        ]);

        setReportsData({
          balancesReports: balancesRes.data || [],
          occupancyReports: occupancyRes.data || [],
          utilityReports: utilityRes.data || [],
          billingStats: billingRes.data || [],
          financialReports: financialRes.data || [],
        });
      } catch (err) {
        console.error(err);
        setError('Failed to load one or more reports.');
      } finally {
        setLoading(false);
      }
    };

    fetchAllReports();
  }, [propertyId]);

  //const selectedData = reportsData[selectedReport];

  const filterBalances = () => {
  return reportsData.balancesReports.filter(item => {
    const matchesStatus =
      balanceStatusFilter === 'All' || item.status === balanceStatusFilter;

    const matchesMin =
      minBalanceFilter === '' || item.balance >= parseFloat(minBalanceFilter);

    const matchesPeriod =
      periodFilter === 'All' || item.period === periodFilter;

    return matchesStatus && matchesMin && matchesPeriod;
  });
};

  const filterOccupancy = () => {
    return selectedMonth
      ? reportsData.occupancyReports.filter((item) => item.month.includes(selectedMonth))
      : reportsData.occupancyReports;
  };

  const filterBillingStats = () => {
    return selectedMonth
      ? reportsData.billingStats.filter((item) => item.month.includes(selectedMonth))
      : reportsData.billingStats;
  };

  const filterFinancials = () => {
    return reportsData.financialReports.filter((item) => {
      const matchesYear = selectedYear ? item.year.toString() === selectedYear : true;
      const matchesMonth = selectedMonth ? item.month.toString().padStart(2, '0') === selectedMonth : true;
      return matchesYear && matchesMonth;
    });
  };

  if (!propertyId) return <div className="p-4 text-red-600">Property ID not found.</div>;
  if (loading) return <div className="p-4">Loading reports...</div>;
  if (error) return <div className="p-4 text-red-600">{error}</div>;

  return (
    <div className="p-4 bg-white rounded-md shadow-sm">
      {/* Report Selection */}
      <div className="flex flex-wrap gap-2 mb-6">
        {[
          'balancesReports',
          'occupancyReports',
          'utilityReports',
          'billingStats',
          'financialReports',
        ].map((report) => (
          <button
            key={report}
            onClick={() => setSelectedReport(report)}
            className={`px-4 py-2 rounded-md ${
              selectedReport === report ? 'bg-cyan-700 text-white' : 'bg-gray-200'
            }`}
          >
            {report.replace(/([A-Z])/g, ' $1').toUpperCase()}
          </button>
        ))}
      </div>

      {selectedReport === 'balancesReports' && (
  <div className="flex gap-4 mb-4">
    <select
      value={balanceStatusFilter}
      onChange={e => setBalanceStatusFilter(e.target.value)}
      className="border rounded px-2 py-1"
    >
      <option value="All">All</option>
      <option value="Due">Due</option>
      <option value="Settled">Settled</option>
      <option value="Overpaid">Overpaid</option>
    </select>

    <input
      type="number"
      value={minBalanceFilter}
      onChange={e => setMinBalanceFilter(e.target.value)}
      placeholder="Min Balance (e.g., 500)"
      className="border rounded px-2 py-1"
    />

    <select
      value={periodFilter}
      onChange={e => setPeriodFilter(e.target.value)}
      className="border rounded px-2 py-1"
    >
      <option value="All">All Periods</option>
      {Array.from(new Set(reportsData.balancesReports.map(item => item.period)))
        .sort()
        .map(period => (
          <option key={period} value={period}>
            {period}
          </option>
        ))}
    </select>
  </div>
)}


      {['occupancyReports', 'billingStats', 'financialReports'].includes(selectedReport) && (
        <div className="flex gap-4 mb-4">
          {(selectedReport !== 'occupancyReports' || selectedReport === 'occupancyReports') && (
            <input
              type="text"
              placeholder="Month (e.g., January 2025)"
              value={selectedMonth}
              onChange={e => setSelectedMonth(e.target.value)}
              className="border rounded px-2 py-1"
            />
          )}
          {selectedReport === 'financialReports' && (
            <input
              type="text"
              placeholder="Year (e.g., 2025)"
              value={selectedYear}
              onChange={e => setSelectedYear(e.target.value)}
              className="border rounded px-2 py-1"
            />
          )}
        </div>
      )}

      {/* Report Content */}
      <div>
        <h3 className="text-lg font-semibold mb-4">
          {selectedReport.replace(/([A-Z])/g, ' $1').toUpperCase()} 
        </h3>

        {selectedReport === 'balancesReports' && (
          <table className="w-full table-auto border-collapse">
            <thead>
              <tr>
                <th className="border px-4 py-2">Period</th>
                <th className="border px-4 py-2">Tenant</th>
                <th className="border px-4 py-2">Unit</th>
                <th className="border px-4 py-2">Balance</th>
                <th className="border px-4 py-2">Status</th>
              </tr>
            </thead>
            <tbody>
              {filterBalances().map((item, index) => (
                <tr key={index}>
                  <td className="border px-4 py-2">{item.period || 'N/A'}</td> 
                  <td className="border px-4 py-2">{item.tenant}</td>
                  <td className="border px-4 py-2">{item.unit}</td>
                  <td className="border px-4 py-2">Ksh{item.balance}</td>
                  <td className="border px-4 py-2">{item.status}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}

        {selectedReport === 'occupancyReports' && (
          <table className="w-full table-auto border-collapse">
            <thead>
              <tr>
                <th className="border px-4 py-2">Month</th>
                <th className="border px-4 py-2">Occupancy (%)</th>
                <th className="border px-4 py-2">Vacancy (%)</th>
              </tr>
            </thead>
            <tbody>
              {filterOccupancy().length > 0 ? (
                filterOccupancy().map((item, index) => (
                  <tr key={index}>
                    <td className="border px-4 py-2">{item.month}</td>
                    <td className="border px-4 py-2">{item.occupancy}</td>
                    <td className="border px-4 py-2">{item.vacancy}</td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="3" className="text-center py-4 text-gray-500">No data available</td>
                </tr>
              )}
            </tbody>
          </table>
        )}

        {selectedReport === 'utilityReports' && (
          <>
            <table className="w-full table-auto border-collapse mb-4">
              <thead>
                <tr>
                  <th className="border px-4 py-2">Tenant</th>
                  <th className="border px-4 py-2">Unit</th>
                  <th className="border px-4 py-2">Water Usage (m³)</th>
                  <th className="border px-4 py-2">Electricity Usage (kWh)</th>
                </tr>
              </thead>
              <tbody>
                {reportsData.utilityReports.usageByTenantUnit.length > 0 ? (
                  reportsData.utilityReports.usageByTenantUnit.map((item, index) => (
                    <tr key={index}>
                      <td className="border px-4 py-2">{item.tenant}</td>
                      <td className="border px-4 py-2">{item.unit}</td>
                      <td className="border px-4 py-2">{item.waterUsage.toFixed(2)}</td>
                      <td className="border px-4 py-2">{item.electricityUsage.toFixed(2)}</td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="4" className="text-center py-4 text-gray-500">No data available</td>
                  </tr>
                )}
              </tbody>
            </table>
            <div className="font-semibold text-right mr-4">
              <p>Total Water Usage: {reportsData.utilityReports.totalUsage.waterUsage.toFixed(2)} m³</p>
              <p>Total Electricity Usage: {reportsData.utilityReports.totalUsage.electricityUsage.toFixed(2)} kWh</p>
            </div>
          </>
        )}

        {selectedReport === 'billingStats' && (
          <>
            <table className="w-full table-auto border-collapse mb-6">
              <thead>
                <tr>
                  <th className="border px-4 py-2">Month</th>
                  <th className="border px-4 py-2">Billed Amount</th>
                  <th className="border px-4 py-2">Paid Amount</th>
                  <th className="border px-4 py-2">Outstanding Amount</th>
                </tr>
              </thead>
              <tbody>
                {filterBillingStats().map((item, index) => (
                  <tr key={index}>
                    <td className="border px-4 py-2">{item.month}</td>
                    <td className="border px-4 py-2">Ksh{item.billedAmount}</td>
                    <td className="border px-4 py-2">Ksh{item.paidAmount}</td>
                    <td className="border px-4 py-2">Ksh{item.outstandingAmount}</td>
                  </tr>
                ))}
              </tbody>
            </table>
            <Line
              data={{
                labels: filterBillingStats().map(item => item.month),
                datasets: [
                  {
                    label: 'Billed',
                    data: filterBillingStats().map(item => item.billedAmount),
                    borderColor: 'rgba(54, 162, 235, 1)',
                    backgroundColor: 'rgba(54, 162, 235, 0.2)',
                  },
                  {
                    label: 'Paid',
                    data: filterBillingStats().map(item => item.paidAmount),
                    borderColor: 'rgba(75, 192, 192, 1)',
                    backgroundColor: 'rgba(75, 192, 192, 0.2)',
                  },
                  {
                    label: 'Outstanding',
                    data: filterBillingStats().map(item => item.outstandingAmount),
                    borderColor: 'rgba(255, 99, 132, 1)',
                    backgroundColor: 'rgba(255, 99, 132, 0.2)',
                  },
                ]
              }}
              options={{
                responsive: true,
                plugins: {
                  legend: { position: 'top' },
                  title: { display: true, text: 'Billing Trends' },
                },
              }}
            />
          </>
        )}

        {selectedReport === 'financialReports' && (
          <table className="w-full table-auto border-collapse">
            <thead>
              <tr>
                <th className="border px-4 py-2">Month</th>
                <th className="border px-4 py-2">Payments</th>
                <th className="border px-4 py-2">Expenses</th>
                <th className="border px-4 py-2">Net Income</th>
              </tr>
            </thead>
            <tbody>
              {filterFinancials().map((item, index) => (
                <tr key={index}>
                  <td className="border px-4 py-2">{`${item.year}-${item.month.toString().padStart(2, '0')}`}</td>
                  <td className="border px-4 py-2">Ksh{item.payments}</td>
                  <td className="border px-4 py-2">Ksh{item.expenses}</td>
                  <td className="border px-4 py-2">Ksh{item.netIncome}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
};

export default ReportsTab;
