import { API_ENDPOINTS } from "@/app/constants/api";
import {
    CountryResponse,
    ICountriesRepository,
} from "../../domain/repositories/ICountriesRepository";
import ApiClient from "../datasources/remote/ApiClient";

export class CountryRepository implements ICountriesRepository {
  private static instance: CountryRepository;

  private constructor() {}

  public static getInstance(): CountryRepository {
    if (!CountryRepository.instance) {
      CountryRepository.instance = new CountryRepository();
    }
    return CountryRepository.instance;
  }

  async fetchCountries(): Promise<CountryResponse> {
    try {
      const response = await ApiClient.get<any>(
        API_ENDPOINTS.COUNTRIES.LIST,
        true
      );
      return {
        countries: [],
        success: false,
        error: "Not implemented",
        message: "This method is not implemented yet.",
        statusCode: 501,
      };
    } catch (error) {
      return {
        countries: [],
        success: false,
        error: "Not implemented",
        message: "This method is not implemented yet.",
        statusCode: 501,
      };
    }
  }
}
