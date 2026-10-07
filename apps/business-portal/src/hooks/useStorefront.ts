import { useCallback, useState } from 'react';

export interface StorefrontProduct {
  id: string;
  name: string;
  priceTgd: string;
}

export function useStorefront() {
  const [products, setProducts] = useState<StorefrontProduct[]>([]);

  const addProduct = useCallback((product: Omit<StorefrontProduct, 'id'>) => {
    setProducts((prev) => [
      ...prev,
      { id: String(prev.length + 1), ...product },
    ]);
  }, []);

  const removeProduct = useCallback((id: string) => {
    setProducts((prev) => prev.filter((p) => p.id !== id));
  }, []);

  return { products, addProduct, removeProduct };
}
