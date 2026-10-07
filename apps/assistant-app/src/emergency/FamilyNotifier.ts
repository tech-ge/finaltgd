export interface FamilyAlert {
  circleId: number;
  trigger: string;
  at: number;
  location?: { lat: number; lon: number };
}

export function buildAlert(input: FamilyAlert): FamilyAlert {
  return input;
}
