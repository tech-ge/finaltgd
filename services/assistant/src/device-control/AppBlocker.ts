export interface BlockRule {
  accountId: number;
  packageIds: string[];
  category: 'entertainment' | 'social' | 'all';
  activeUntil: Date;
}

export function isBlocked(rule: BlockRule, packageId: string, now = new Date()): boolean {
  if (now > rule.activeUntil) {
    return false;
  }
  if (rule.category === 'all') {
    return true;
  }
  return rule.packageIds.includes(packageId);
}
