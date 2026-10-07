import React, { useState } from 'react';

export default function CreateSupervisor(): React.ReactElement {
  const [fullName, setFullName] = useState('');
  const [deviceUuid, setDeviceUuid] = useState('');

  const submit = (event: React.FormEvent): void => {
    event.preventDefault();
  };

  return (
    <main className="min-h-screen p-8">
      <h1 className="text-2xl font-semibold mb-6">Create Supervisor</h1>
      <form onSubmit={submit} className="max-w-lg space-y-4">
        <input
          value={fullName}
          onChange={(e) => setFullName(e.target.value)}
          placeholder="Full name"
          className="w-full px-4 py-3 rounded-lg bg-gray-800 border border-gray-700 text-white"
        />
        <input
          value={deviceUuid}
          onChange={(e) => setDeviceUuid(e.target.value)}
          placeholder="Device UUID"
          className="w-full px-4 py-3 rounded-lg bg-gray-800 border border-gray-700 text-white"
        />
        <button
          type="submit"
          className="w-full px-4 py-3 rounded-lg bg-blue-500 text-white font-semibold"
        >
          Create
        </button>
      </form>
    </main>
  );
}
