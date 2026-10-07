export interface SimState {
  accountId: number;
  active: boolean;
  changedAt: Date;
}

export interface SimCommand {
  accountId: number;
  reason: string;
}

export function planDisable(command: SimCommand): SimState {
  return { accountId: command.accountId, active: false, changedAt: new Date() };
}

export function planEnable(command: SimCommand): SimState {
  return { accountId: command.accountId, active: true, changedAt: new Date() };
}
