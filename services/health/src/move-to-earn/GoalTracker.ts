export interface GoalDefinition {
  accountId: number;
  dailyStepTarget: number;
  weeklyActiveMinutesTarget: number;
}

export interface GoalProgress {
  accountId: number;
  stepsToday: number;
  activeMinutesToday: number;
  stepProgress: number;
  activeProgress: number;
  goalMet: boolean;
}

export function evaluateProgress(
  goal: GoalDefinition,
  stepsToday: number,
  activeMinutesToday: number,
): GoalProgress {
  const stepProgress = goal.dailyStepTarget > 0 ? stepsToday / goal.dailyStepTarget : 0;
  const activeProgress =
    goal.weeklyActiveMinutesTarget > 0
      ? activeMinutesToday / (goal.weeklyActiveMinutesTarget / 7)
      : 0;

  return {
    accountId: goal.accountId,
    stepsToday,
    activeMinutesToday,
    stepProgress: Number(stepProgress.toFixed(4)),
    activeProgress: Number(activeProgress.toFixed(4)),
    goalMet: stepProgress >= 1 && activeProgress >= 1,
  };
}
