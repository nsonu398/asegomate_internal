// app/core/data/repository/AuthRepository.ts
import { API_ENDPOINTS } from "@/app/constants/api";
import {
  GeographicalAreaResponse,
  IMasterSelectRepository,
} from "../../domain/repositories/IMasterSelectRepository";
import apiClient from "../datasources/remote/ApiClient";

export class MasterSelectRepository implements IMasterSelectRepository {
  private static instance: MasterSelectRepository;

  private constructor() {}

  public static getInstance(): MasterSelectRepository {
    if (!MasterSelectRepository.instance) {
      MasterSelectRepository.instance = new MasterSelectRepository();
    }
    return MasterSelectRepository.instance;
  }

  async fetchGeographicalAreas(): Promise<GeographicalAreaResponse> {
    try {
      const response = await apiClient.get<any>(
        API_ENDPOINTS.MASTER_SELECT.GEOGRAPHICAL_AREAS,
        true
      );
      return {
        areas: [],
        success: false,
        error: "Authentication failed",
      };

    } catch (error) {
      return {
        areas: [],
        success: false,
        error: error instanceof Error ? error.message : "Authentication failed",
      };
    }
  }
}

export default MasterSelectRepository.getInstance();
