export interface BlockRule {
  category: 'entertainment' | 'social' | 'all';
  activeUntil: number;
}

export function isBlocked(rule: BlockRule, now = Date.now()): boolean {
  if (now > rule.activeUntil) {
    return false;
  }
  return true;
}
