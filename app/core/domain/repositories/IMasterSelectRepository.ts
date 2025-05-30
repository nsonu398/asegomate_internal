// app/core/domain/repositories/IAuthRepository.ts

import { GeographicalArea } from "../entities/GeographicalArea";


export interface GeographicalAreaResponse {
  areas: GeographicalArea[];
  success: boolean;
  error?: string;
  message?: string;
  statusCode?: number;
}

export interface IMasterSelectRepository {
  fetchGeographicalAreas(): Promise<GeographicalAreaResponse>;
}
