// src/core/domain/entities/Trip.ts
import { Traveler } from './Traveler';

export type TripType = 'oneWay' | 'roundTrip' | 'multiCity';
export type TripPurpose = 'leisure' | 'business' | 'medical' | 'education' | 'other';

export interface Destination {
  country: string;
  city?: string;
  arrivalDate: string;
  departureDate?: string;
}

export interface Trip {
  id: string;
  userId: string;
  type: TripType;
  purpose: TripPurpose;
  startDate: string;
  endDate: string;
  originCountry: string;
  originCity?: string;
  destinations: Destination[];
  travelers: Traveler[];
  totalTripCost?: number;
  hasPaidActivities?: boolean;
  hasPrePaidAccommodation?: boolean;
  createdAt: string;
  updatedAt: string;
}