import type { ApiClient } from './client';

export interface Coordinate {
  lat: number;
  lon: number;
}

export interface RouteRequest {
  origin: Coordinate;
  destination: Coordinate;
  departAt: string;
  arriveBy?: string;
}

export interface RouteResponse {
  routes: Array<{
    id: string;
    distanceMeters: number;
    etaSeconds: number;
    congestionScore: number;
  }>;
}

export class MapsApi {
  constructor(private readonly client: ApiClient) {}

  async route(input: RouteRequest): Promise<RouteResponse> {
    return this.client.post<RouteResponse>('/v1/maps/route', input);
  }
}
