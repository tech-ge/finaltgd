export interface EmergencyContact {
  accountId: number;
  name: string;
  phone: string;
  relationship: string;
  priority: number;
}

export class EmergencyContacts {
  private readonly byAccount = new Map<number, EmergencyContact[]>();

  register(contact: EmergencyContact): void {
    const list = this.byAccount.get(contact.accountId) ?? [];
    list.push(contact);
    list.sort((a, b) => a.priority - b.priority);
    this.byAccount.set(contact.accountId, list);
  }

  list(accountId: number): EmergencyContact[] {
    return [...(this.byAccount.get(accountId) ?? [])];
  }

  remove(accountId: number, phone: string): void {
    const list = this.byAccount.get(accountId) ?? [];
    this.byAccount.set(
      accountId,
      list.filter((c) => c.phone !== phone),
    );
  }
}
