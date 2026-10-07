export interface SimState {
  active: boolean;
  changedAt: number;
}

export function planDisable(reason: string): SimState {
  void reason;
  return { active: false, changedAt: Date.now() };
}

export function planEnable(reason: string): SimState {
  void reason;
  return { active: true, changedAt: Date.now() };
}
