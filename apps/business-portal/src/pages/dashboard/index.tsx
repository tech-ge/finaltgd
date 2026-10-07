import Link from 'next/link';
import React from 'react';

const cards = [
  { href: '/dashboard/storefront', title: 'Storefront', description: 'Catalog and QR checkout' },
  { href: '/dashboard/payments', title: 'Payments', description: 'Accept TGD with QR' },
  { href: '/dashboard/escrow', title: 'Escrow', description: 'Conditional settlement' },
  { href: '/dashboard/analytics', title: 'Analytics', description: 'Volume and trends' },
  { href: '/dashboard/heatmaps', title: 'Heatmaps', description: 'Foot traffic' },
  { href: '/dashboard/inventory', title: 'Inventory', description: 'Forecast and reorder' },
  { href: '/dashboard/geo-marketing', title: 'Geo Marketing', description: 'Campaigns' },
];

export default function DashboardHome(): React.ReactElement {
  return (
    <main className="min-h-screen p-8">
      <h1 className="text-3xl font-semibold mb-8">Business dashboard</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {cards.map((card) => (
          <Link
            key={card.href}
            href={card.href}
            className="block p-6 bg-gray-900 border border-gray-800 rounded-2xl hover:border-blue-500"
          >
            <h2 className="text-lg font-semibold mb-2">{card.title}</h2>
            <p className="text-sm text-gray-400">{card.description}</p>
          </Link>
        ))}
      </div>
    </main>
  );
}
