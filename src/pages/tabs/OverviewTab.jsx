//src\pages\tabs\OverviewTab.jsx
import React, { useState } from "react";
import { useOutletContext } from "react-router-dom";

const formatCurrency = (value) =>
  new Intl.NumberFormat("en-KE", {
    style: "currency",
    currency: "KES",
    minimumFractionDigits: 0,
  }).format(value);

const OverviewTab = () => {
  const { property } = useOutletContext();
  const [showAdvanced, setShowAdvanced] = useState(false);

  if (!property) {
    return <p className="text-red-500 p-4">Property data not available.</p>;
  }

  return (
    <div className="p-6 bg-white rounded-lg shadow-sm space-y-8">
      <section>
        <h2 className="text-xl font-semibold mb-2">Basic Info</h2>
        <p><strong>Name:</strong> {property.propertyName}</p>
        <p><strong>Address:</strong> {property.address}</p>
        <p><strong>Type:</strong> {property.propertyType}</p>
        <p>
          <strong>Service Rate:</strong>{" "}
          {property.serviceRate?.model === "Fixed"
            ? formatCurrency(property.serviceRate.value)
            : `${property.serviceRate?.value}%`}
        </p>

      </section>

      <section>
        <h2 className="text-xl font-semibold mb-2">Landlord Info</h2>
        <div className="grid sm:grid-cols-2 gap-2">
          <p><strong>Name:</strong> {property.landlord?.name}</p>
          <p><strong>Email:</strong> {property.landlord?.email}</p>
          <p><strong>Phone:</strong> {property.landlord?.phone}</p>
        </div>
      </section>

      <section>
        <h2 className="text-xl font-semibold mb-2">Payment Details</h2>
        <div className="grid sm:grid-cols-2 gap-2">
          <p><strong>Bank:</strong> {property.paymentDetails?.bank}</p>
          <p><strong>Account Name:</strong> {property.paymentDetails?.accountName}</p>
          <p><strong>Account Number:</strong> {property.paymentDetails?.accountNumber}</p>
          <p><strong>Deadline:</strong> {property.paymentDetails?.deadline}</p>
        </div>
      </section>

      <section>
        <h2 className="text-xl font-semibold mb-2">Utilities</h2>
        <p><strong>Water:</strong> {property.utilities?.water}</p>
        <p><strong>Water Rate:</strong> {property.utilities?.waterRate}</p>
        <p><strong>Garbage:</strong> {property.utilities?.garbage}</p>
      </section>

      <section>
        <h2 className="text-xl font-semibold mb-2">Units Summary</h2>
        <div className="flex justify-end mb-4">
          <button
            onClick={() => setShowAdvanced((prev) => !prev)}
            className="text-sm text-blue-600 underline hover:text-blue-800"
          >
            {showAdvanced ? "Hide advanced info" : "Show advanced info"}
          </button>
        </div>

        {property.units?.length > 0 ? (
          <>
            {property.units.map((unit, index) => {
              const allUnits = unit.unitIds || [];
              const vacant = allUnits.filter(
                (u) => u.status?.toLowerCase() === "vacant"
              ).length;
              const occupied = allUnits.filter(
                (u) => u.status?.toLowerCase() === "occupied"
              ).length;

              return (
                <div key={index} className="border p-4 rounded mb-4">
                  <p><strong>Type:</strong> {unit.type}</p>
                  <p><strong>Rent:</strong> {unit.rent}</p>
                  <p><strong>Deposit:</strong> {unit.deposit}</p>
                  <p>
                    <span className="text-red-700 font-semibold">{vacant} Vacant</span> /{" "}
                    <span className="text-blue-700 font-semibold">{occupied} Occupied</span>
                  </p>

                  {showAdvanced && (
                    <>
                      <p><strong>Declared Count:</strong> {unit.count}</p>
                      <p><strong>Registered Units:</strong> {allUnits.length}</p>
                      {unit.count !== allUnits.length && (
                        <p className="text-red-500 text-sm mt-1">
                          ⚠️ Mismatch: {allUnits.length} units registered, but {unit.count} declared.
                        </p>
                      )}
                    </>
                  )}
                </div>
              );
            })}

            <div className="mt-2 font-medium">
              <p>
                <strong>Total Units:</strong>{" "}
                {property.units.reduce(
                  (acc, u) => acc + (u.unitIds?.length || 0),
                  0
                )}
              </p>
            </div>
          </>
        ) : (
          <p className="text-gray-500">No units added yet.</p>
        )}
      </section>
    </div>
  );
};

export default OverviewTab;
