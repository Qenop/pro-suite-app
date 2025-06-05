//src\pages\tabs\WaterReadingsTab.jsx
import React, { useState, useEffect } from "react";
import { useOutletContext } from "react-router-dom";
import axios from '../../api/axiosInstance';

const WaterReadingsTab = () => {
  const { property } = useOutletContext();
  const [readingDate, setReadingDate] = useState("");
  const [readings, setReadings] = useState({});
  const [loading, setLoading] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [savedReadings, setSavedReadings] = useState([]);

  // New state for filtering
  const [unitFilter, setUnitFilter] = useState("");

  // Flatten unitIds across unit types
  const allUnits = property.units.flatMap((unitType) =>
    unitType.unitIds.map((unit) => ({
      ...unit,
      type: unitType.type,
    }))
  );

  const handleInputChange = (unitId, value) => {
    setReadings((prev) => ({
      ...prev,
      [unitId]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!readingDate) {
      setErrorMessage("Please select a reading date.");
      return;
    }

    const formattedReadings = Object.entries(readings)
      .filter(([, value]) => value !== "") // only include filled ones
      .map(([unitId, readingValue]) => ({
        unitId,
        readingValue: Number(readingValue),
      }));

    if (formattedReadings.length === 0) {
      setErrorMessage("Please enter at least one reading.");
      return;
    }

    try {
      setLoading(true);
      setErrorMessage("");
      await axios.post(`/properties/${property._id}/water-readings`, {
        readingDate,
        readings: formattedReadings,
      });

      setSuccessMessage("Readings submitted successfully.");
      setReadings({});
      setReadingDate("");

      // Refresh saved readings
      const res = await axios.get(`/properties/${property._id}/water-readings`);
      setSavedReadings(res.data);
    } catch (err) {
      console.error("Failed to submit water readings:", err);
      setErrorMessage("Failed to submit water readings.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const fetchReadings = async () => {
      try {
        const response = await axios.get(`/properties/${property._id}/water-readings`);
        setSavedReadings(response.data);
      } catch (error) {
        console.error("Failed to fetch water readings:", error);
      }
    };

    fetchReadings();
  }, [property._id]);

  // Group readings by month, but keep full readings objects with consumption
  const groupReadingsByMonth = (readings) => {
    const groups = {};

    readings.forEach((entry) => {
      const monthKey = new Date(entry.readingDate).toLocaleDateString("en-US", {
        year: "numeric",
        month: "long",
      });

      if (!groups[monthKey]) {
        groups[monthKey] = [];
      }

      groups[monthKey].push(entry);
    });

    return groups;
  };

  // Filter saved readings by unitFilter before grouping
  const filteredSavedReadings = unitFilter
    ? savedReadings
        .map((entry) => ({
          ...entry,
          readings: entry.readings.filter((r) => r.unitId === unitFilter),
          consumption: entry.consumption
            ? entry.consumption.filter((c) => c.unitId === unitFilter)
            : [],
        }))
        .filter((entry) => entry.readings.length > 0) // exclude entries with no readings after filter
    : savedReadings;

  return (
    <div className="space-y-6">
      <h3 className="text-xl font-semibold">Water Meter Readings</h3>

      {property.utilities?.water !== "Metered" && (
        <p className="text-red-600">This property is not set to metered billing.</p>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block font-medium text-sm mb-1">Reading Date</label>
          <input
            type="date"
            value={readingDate}
            onChange={(e) => setReadingDate(e.target.value)}
            className="border rounded px-3 py-2 w-full max-w-sm"
            required
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {allUnits.map((unit) => (
            <div key={unit._id} className="border rounded p-4">
              <p className="font-medium">
                Unit: {unit.unitId} ({unit.type})
              </p>
              <p className="text-sm text-gray-500">Status: {unit.status}</p>
              <input
                type="number"
                placeholder="Enter reading"
                value={readings[unit.unitId] || ""}
                onChange={(e) => handleInputChange(unit.unitId, e.target.value)}
                className="mt-2 border px-2 py-1 w-full"
              />
            </div>
          ))}
        </div>

        {errorMessage && <p className="text-red-600">{errorMessage}</p>}
        {successMessage && <p className="text-green-600">{successMessage}</p>}

        <button
          type="submit"
          className="bg-cyan-700 text-white px-6 py-2 rounded hover:bg-black"
          disabled={loading}
        >
          {loading ? "Saving..." : "Submit Readings"}
        </button>
      </form>

      {/* Unit filter dropdown */}
      <div className="mt-8">
        <label className="block font-medium mb-2">Filter Saved Readings by Unit ID</label>
        <select
          value={unitFilter}
          onChange={(e) => setUnitFilter(e.target.value)}
          className="border rounded px-3 py-2 max-w-xs"
        >
          <option value="">All Units</option>
          {[...new Set(allUnits.map((unit) => unit.unitId))].map((unitId) => (
            <option key={unitId} value={unitId}>
              {unitId}
            </option>
          ))}
        </select>
      </div>

      {/* Display saved readings */}
      <div className="mt-10">
        <h4 className="text-lg font-semibold mb-4">Saved Readings</h4>

        {filteredSavedReadings.length === 0 ? (
          <p className="text-gray-600">No readings recorded yet.</p>
        ) : (
          Object.entries(groupReadingsByMonth(filteredSavedReadings)).map(([month, readings]) => (
            <div key={month} className="mb-6">
              <h5 className="font-bold text-md mb-2">{month}</h5>
              <table className="w-full border text-sm">
                <thead>
                  <tr className="bg-gray-400">
                    <th className="border px-2 py-1 text-left">Unit ID</th>
                    <th className="border px-2 py-1 text-left">Reading</th>
                    <th className="border px-2 py-1 text-left">Consumption</th>
                    <th className="border px-2 py-1 text-left">Reading Date</th>
                  </tr>
                </thead>
                <tbody>
                  {readings.map((readingEntry, index) =>
                    readingEntry.readings.map((r, i) => {
                      const consumptionEntry = readingEntry.consumption?.find(
                        (c) => c.unitId === r.unitId
                      );
                      return (
                        <tr key={`${index}-${i}`}>
                          <td className="border px-2 py-1">{r.unitId}</td>
                          <td className="border px-2 py-1">{r.readingValue}</td>
                          <td className="border px-2 py-1">
                            {consumptionEntry ? consumptionEntry.consumption : "-"}
                          </td>
                          <td className="border px-2 py-1">
                            {new Date(readingEntry.readingDate).toLocaleDateString()}
                          </td>
                        </tr>
                      );
                    })
                  )}
                </tbody>
              </table>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default WaterReadingsTab;
