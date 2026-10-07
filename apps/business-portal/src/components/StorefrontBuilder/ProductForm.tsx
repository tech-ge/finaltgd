import React, { useState } from 'react';

export interface ProductFormProps {
  onSubmit: (product: { name: string; priceTgd: string }) => void;
}

export function ProductForm({ onSubmit }: ProductFormProps): React.ReactElement {
  const [name, setName] = useState('');
  const [priceTgd, setPriceTgd] = useState('');

  const submit = (event: React.FormEvent): void => {
    event.preventDefault();
    if (!name || !priceTgd) {
      return;
    }
    onSubmit({ name, priceTgd });
    setName('');
    setPriceTgd('');
  };

  return (
    <form onSubmit={submit} className="space-y-3">
      <input
        value={name}
        onChange={(e) => setName(e.target.value)}
        placeholder="Product name"
        className="w-full px-4 py-3 rounded-lg bg-gray-800 border border-gray-700 text-white"
      />
      <input
        value={priceTgd}
        onChange={(e) => setPriceTgd(e.target.value)}
        placeholder="Price in TGD"
        className="w-full px-4 py-3 rounded-lg bg-gray-800 border border-gray-700 text-white"
      />
      <button
        type="submit"
        className="w-full px-4 py-3 rounded-lg bg-blue-500 text-white font-semibold"
      >
        Add product
      </button>
    </form>
  );
}
