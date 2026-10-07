import Link from 'next/link';
import React, { useState } from 'react';

export default function Login(): React.ReactElement {
  const [accountId, setAccountId] = useState('');
  const [error, setError] = useState<string | null>(null);

  const submit = async (event: React.FormEvent): Promise<void> => {
    event.preventDefault();
    setError(null);
    if (!accountId || !/^\d+$/.test(accountId)) {
      setError('Enter a numeric account id');
      return;
    }
    window.location.href = '/dashboard';
  };

  return (
    <main className="min-h-screen flex items-center justify-center p-8">
      <form
        onSubmit={(e) => void submit(e)}
        className="w-full max-w-md bg-gray-900 border border-gray-800 rounded-2xl p-8"
      >
        <h1 className="text-2xl font-semibold mb-6">Business sign in</h1>

        <label className="block text-sm text-gray-400 mb-2">Account id</label>
        <input
          value={accountId}
          onChange={(e) => setAccountId(e.target.value)}
          className="w-full px-4 py-3 rounded-lg bg-gray-800 border border-gray-700 text-white outline-none"
          placeholder="Enter your account id"
        />

        {error ? <p className="text-red-400 text-sm mt-3">{error}</p> : null}

        <button
          type="submit"
          className="mt-6 w-full px-4 py-3 rounded-lg bg-blue-500 text-white font-semibold"
        >
          Continue
        </button>

        <p className="text-xs text-gray-500 mt-6">
          Authentication continues in the primary phone. Business sign in
          never requires a second device.
        </p>

        <Link href="/" className="text-xs text-blue-400 block mt-4">
          Back to home
        </Link>
      </form>
    </main>
  );
}
