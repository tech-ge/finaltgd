import Link from 'next/link';
import React, { useState } from 'react';

export default function Login(): React.ReactElement {
  const [accountId, setAccountId] = useState('');
  const [role, setRole] = useState<'CEO' | 'ADMIN' | 'SUPERVISOR'>('CEO');

  const submit = (event: React.FormEvent): void => {
    event.preventDefault();
    if (!accountId) {
      return;
    }
    window.location.href = '/hierarchy';
  };

  return (
    <main className="min-h-screen flex items-center justify-center p-8">
      <form
        onSubmit={submit}
        className="w-full max-w-md bg-gray-900 border border-gray-800 rounded-2xl p-8 space-y-4"
      >
        <h1 className="text-2xl font-semibold">Admin sign in</h1>

        <div>
          <label className="block text-sm text-gray-400 mb-1">Account id</label>
          <input
            value={accountId}
            onChange={(e) => setAccountId(e.target.value)}
            className="w-full px-4 py-3 rounded-lg bg-gray-800 border border-gray-700 text-white"
          />
        </div>

        <div>
          <label className="block text-sm text-gray-400 mb-1">Role</label>
          <select
            value={role}
            onChange={(e) => setRole(e.target.value as typeof role)}
            className="w-full px-4 py-3 rounded-lg bg-gray-800 border border-gray-700 text-white"
          >
            <option value="CEO">CEO</option>
            <option value="ADMIN">Admin</option>
            <option value="SUPERVISOR">Supervisor</option>
          </select>
        </div>

        <button
          type="submit"
          className="w-full px-4 py-3 rounded-lg bg-blue-500 text-white font-semibold"
        >
          Continue
        </button>

        <Link href="/" className="text-xs text-blue-400 block">
          Back to home
        </Link>
      </form>
    </main>
  );
}
