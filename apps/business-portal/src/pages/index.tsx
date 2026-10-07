import Link from 'next/link';
import React from 'react';

export default function Home(): React.ReactElement {
  return (
    <main className="min-h-screen flex flex-col items-center justify-center p-8">
      <h1 className="text-4xl font-bold mb-4">TechGeo Business</h1>
      <p className="text-gray-400 mb-8 max-w-lg text-center">
        Storefront, payments, analytics, and settlement for TGD merchants.
      </p>
      <div className="flex gap-4">
        <Link
          href="/login"
          className="px-6 py-3 rounded-lg bg-blue-500 text-white font-semibold"
        >
          Sign in
        </Link>
        <Link
          href="/dashboard"
          className="px-6 py-3 rounded-lg border border-gray-700 text-white"
        >
          Dashboard
        </Link>
      </div>
    </main>
  );
}
