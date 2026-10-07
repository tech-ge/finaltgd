import { Decimal } from 'decimal.js';

export interface RewardInput {
  accountId: number;
  goalMet: boolean;
  stepsToday: number;
  activeMinutesToday: number;
}

export interface RewardAmount {
  accountId: number;
  tgdAmount: Decimal;
}

const BASE_REWARD_TGD = new Decimal('0.05');
const PER_1K_STEPS_TGD = new Decimal('0.02');

export function computeReward(input: RewardInput): RewardAmount {
  if (!input.goalMet) {
    return { accountId: input.accountId, tgdAmount: new Decimal(0) };
  }

  const stepBonus = PER_1K_STEPS_TGD.times(Math.floor(input.stepsToday / 1000));
  const amount = BASE_REWARD_TGD.plus(stepBonus).toDecimalPlaces(4);
  return { accountId: input.accountId, tgdAmount: amount };
}
