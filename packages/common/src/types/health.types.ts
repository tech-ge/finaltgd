export interface AccelerometerSample {
  x: number;
  y: number;
  z: number;
  at: Date;
}

export interface GyroscopeSample {
  x: number;
  y: number;
  z: number;
  at: Date;
}

export interface PpgSample {
  intensity: number;
  at: Date;
}

export interface WellnessVector {
  activeScore: number;
  sleepScore: number;
  cardiovascularScore: number;
  compositeScore: number;
}

export type SleepQuality = 'poor' | 'fair' | 'good' | 'excellent';

export interface SleepQualityResult {
  minutes: number;
  stillnessRatio: number;
  quality: SleepQuality;
}

export interface MoveToEarnReward {
  accountId: number;
  tgdAmount: string;
}
