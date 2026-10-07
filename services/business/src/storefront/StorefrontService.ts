import type { Pool } from 'pg';

export interface CreateStorefrontInput {
  businessId: number;
  slug: string;
  displayName: string;
}

export interface StorefrontRow {
  storefront_id: number;
  business_id: number;
  slug: string;
  display_name: string;
  is_published: boolean;
  created_at: Date;
  updated_at: Date;
}

export class StorefrontService {
  constructor(private readonly pool: Pool) {}

  async create(input: CreateStorefrontInput): Promise<number> {
    const { rows } = await this.pool.query<{ storefront_id: number }>(
      `INSERT INTO storefronts (business_id, slug, display_name)
       VALUES ($1, $2, $3)
       RETURNING storefront_id`,
      [input.businessId, input.slug, input.displayName],
    );
    const id = rows[0]?.storefront_id;
    if (id === undefined) {
      throw new Error('storefront_create_failed');
    }
    return id;
  }

  async publish(slug: string): Promise<void> {
    await this.pool.query(
      'UPDATE storefronts SET is_published = TRUE WHERE slug = $1',
      [slug],
    );
  }

  async unpublish(slug: string): Promise<void> {
    await this.pool.query(
      'UPDATE storefronts SET is_published = FALSE WHERE slug = $1',
      [slug],
    );
  }

  async findBySlug(slug: string): Promise<StorefrontRow | null> {
    const { rows } = await this.pool.query<StorefrontRow>(
      'SELECT * FROM storefronts WHERE slug = $1 LIMIT 1',
      [slug],
    );
    return rows[0] ?? null;
  }
}
