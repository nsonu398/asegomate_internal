// app/core/domain/repositories/IAuthRepository.ts

import { Country } from "../entities/Country";

export interface CountryResponse {
  countries: Country[];
  success: boolean;
  error?: string;
  message?: string;
  statusCode?: number;
}

export interface ICountriesRepository {
  fetchCountries(): Promise<CountryResponse>;
}
