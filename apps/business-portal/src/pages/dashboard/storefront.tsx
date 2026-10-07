import React, { useState } from 'react';

interface Product {
  id: string;
  name: string;
  priceTgd: string;
}

export default function StorefrontPage(): React.ReactElement {
  const [products, setProducts] = useState<Product[]>([]);
  const [name, setName] = useState('');
  const [priceTgd, setPriceTgd] = useState('');

  const add = (): void => {
    if (!name || !priceTgd) {
      return;
    }
    setProducts((prev) => [
      ...prev,
      { id: String(prev.length + 1), name, priceTgd },
    ]);
    setName('');
    setPriceTgd('');
  };

  return (
    <main className="min-h-screen p-8">
      <h1 className="text-2xl font-semibold mb-6">Storefront</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <section className="bg-gray-900 border border-gray-800 rounded-2xl p-6">
          <h2 className="text-lg font-semibold mb-4">Add product</h2>
          <input
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Product name"
            className="w-full mb-3 px-4 py-3 rounded-lg bg-gray-800 border border-gray-700 text-white"
          />
          <input
            value={priceTgd}
            onChange={(e) => setPriceTgd(e.target.value)}
            placeholder="Price in TGD"
            className="w-full mb-3 px-4 py-3 rounded-lg bg-gray-800 border border-gray-700 text-white"
          />
          <button
            onClick={add}
            className="w-full px-4 py-3 rounded-lg bg-blue-500 text-white font-semibold"
          >
            Add
          </button>
        </section>

        <section className="bg-gray-900 border border-gray-800 rounded-2xl p-6">
          <h2 className="text-lg font-semibold mb-4">Products</h2>
          {products.length === 0 ? (
            <p className="text-gray-500 text-sm">No products yet.</p>
          ) : (
            <ul className="space-y-2">
              {products.map((p) => (
                <li key={p.id} className="flex justify-between text-sm">
                  <span>{p.name}</span>
                  <span className="text-gray-400">{p.priceTgd} TGD</span>
                </li>
              ))}
            </ul>
          )}
        </section>
      </div>
    </main>
  );
}
