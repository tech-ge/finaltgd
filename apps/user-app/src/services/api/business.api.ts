import type { ApiClient } from './client';

export interface StorefrontProductsRequest {
  slug: string;
}

export interface StorefrontProduct {
  id: string;
  name: string;
  description: string;
  priceTgd: string;
}

export interface StorefrontProductsResponse {
  products: StorefrontProduct[];
}

export class BusinessApi {
  constructor(private readonly client: ApiClient) {}

  async listProducts(slug: string): Promise<StorefrontProductsResponse> {
    return this.client.get<StorefrontProductsResponse>(
      `/v1/business/storefront/${slug}/products`,
    );
  }
}
