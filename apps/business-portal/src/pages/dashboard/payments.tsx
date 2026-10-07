import React from 'react';

export default function PaymentsPage(): React.ReactElement {
  return (
    <main className="min-h-screen p-8">
      <h1 className="text-2xl font-semibold mb-6">Payments</h1>
      <p className="text-gray-400 mb-6">
        Generate a signed QR. Clearance is sub-second. Withdrawal is not
        supported.
      </p>
      <div className="bg-gray-900 border border-gray-800 rounded-2xl p-6">
        <p className="text-sm text-gray-500">
          QR generation requires the business account and the current rate.
        </p>
      </div>
    </main>
  );
}
