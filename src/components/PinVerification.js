import React, { useState } from "react";

export default function PinVerification({ onSuccess, onBack }) {
  const [pin, setPin] = useState("");

  function verifyPin() {
    if (pin === "1234") {   // use environment variable later
      onSuccess();
    } else {
      alert("❌ Invalid PIN");
    }
  }

  return (
    <div className="flex flex-col items-center gap-4 p-6">
      <h2 className="text-2xl font-bold">Officer Authentication</h2>

      <input
        type="password"
        className="border p-2 rounded"
        placeholder="Enter PIN"
        value={pin}
        onChange={(e) => setPin(e.target.value)}
      />

      <div className="flex gap-3">
        <button onClick={verifyPin} className="bg-green-600 text-white px-4 py-2 rounded">
          Verify
        </button>
        <button onClick={onBack} className="bg-gray-600 text-white px-4 py-2 rounded">
          Back
        </button>
      </div>
    </div>
  );
}
