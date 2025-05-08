// src/core/domain/entities/InsurancePolicy.ts
import { Traveler } from './Traveler';

export type PolicyStatus = 'active' | 'expired' | 'cancelled' | 'pending';
export type CoverageType = 'basic' | 'standard' | 'premium';

export interface Coverage {
  type: string;  // e.g., "medical", "cancellation", "baggage", etc.
  description: string;
  coverageLimit: number;
  deductible?: number;
}

export interface InsurancePolicy {
  id: string;
  policyNumber: string;
  userId: string;
  tripId: string;
  status: PolicyStatus;
  coverageType: CoverageType;
  coverages: Coverage[];
  insuredTravelers: Traveler[];
  startDate: string;
  endDate: string;
  premium: number;
  purchaseDate: string;
  documents?: {
    policyDocument?: string;
    termsAndConditions?: string;
  };
  createdAt: string;
  updatedAt: string;
}