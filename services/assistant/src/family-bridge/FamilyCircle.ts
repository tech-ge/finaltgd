import type { Pool } from 'pg';

export interface FamilyMember {
  accountId: number;
  role: 'OWNER' | 'MEMBER' | 'GUARDIAN';
  joinedAt: Date;
}

export class FamilyCircle {
  constructor(private readonly pool: Pool) {}

  async create(ownerAccount: number, name: string): Promise<number> {
    if (name.trim().length === 0) {
      throw new Error('circle_name_required');
    }
    const { rows } = await this.pool.query<{ circle_id: number }>(
      `INSERT INTO family_circles (owner_account, circle_name)
       VALUES ($1, $2)
       RETURNING circle_id`,
      [ownerAccount, name],
    );
    const id = rows[0]?.circle_id;
    if (id === undefined) {
      throw new Error('family_circle_create_failed');
    }
    return id;
  }

  async addMember(
    circleId: number,
    accountId: number,
    role: FamilyMember['role'],
  ): Promise<void> {
    await this.pool.query(
      `INSERT INTO family_members (circle_id, account_id, role)
       VALUES ($1, $2, $3)
       ON CONFLICT (circle_id, account_id) DO NOTHING`,
      [circleId, accountId, role],
    );
  }

  async listMembers(circleId: number): Promise<FamilyMember[]> {
    const { rows } = await this.pool.query<{
      account_id: number;
      role: FamilyMember['role'];
      joined_at: Date;
    }>(
      `SELECT account_id, role, joined_at
       FROM family_members
       WHERE circle_id = $1
       ORDER BY joined_at ASC`,
      [circleId],
    );
    return rows.map((r) => ({
      accountId: r.account_id,
      role: r.role,
      joinedAt: r.joined_at,
    }));
  }
}
