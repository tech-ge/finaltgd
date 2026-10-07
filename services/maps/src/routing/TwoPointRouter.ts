export interface Coordinate {
  lat: number;
  lon: number;
}

export interface RouteRequest {
  origin: Coordinate;
  destination: Coordinate;
  departAt: Date;
}

export interface RouteOption {
  id: string;
  path: Coordinate[];
  distanceMeters: number;
  etaSeconds: number;
  congestionScore: number;
}

export class TwoPointRouter {
  constructor(private readonly computeRoute: (req: RouteRequest) => Promise<RouteOption[]>) {}

  async plan(req: RouteRequest): Promise<RouteOption[]> {
    const options = await this.computeRoute(req);
    return options.sort((a, b) => a.etaSeconds - b.etaSeconds);
  }

  async planFeasible(req: RouteRequest, arriveBy: Date): Promise<RouteOption | null> {
    const options = await this.plan(req);
    const availableSeconds = (arriveBy.getTime() - req.departAt.getTime()) / 1000;
    return options.find((o) => o.etaSeconds <= availableSeconds) ?? null;
  }
}
