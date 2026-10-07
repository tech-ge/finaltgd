import { Decimal } from 'decimal.js';

export interface Product {
  id: string;
  storefrontSlug: string;
  name: string;
  description: string;
  priceTgd: Decimal;
  isActive: boolean;
}

export class ProductCatalog {
  private readonly products = new Map<string, Product>();

  add(product: Product): void {
    if (product.priceTgd.lte(0)) {
      throw new Error('price_must_be_positive');
    }
    this.products.set(product.id, product);
  }

  remove(id: string): void {
    this.products.delete(id);
  }

  listFor(storefrontSlug: string): Product[] {
    return Array.from(this.products.values()).filter(
      (p) => p.storefrontSlug === storefrontSlug && p.isActive,
    );
  }

  find(id: string): Product | null {
    return this.products.get(id) ?? null;
  }
}
