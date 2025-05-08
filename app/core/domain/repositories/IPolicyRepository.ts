// src/core/domain/repositories/IPolicyRepository.ts
import { CoverageType, InsurancePolicy } from '../entities/InsurancePolicy';

export interface IPolicyRepository {
  createPolicy(policy: Omit<InsurancePolicy, 'id' | 'policyNumber' | 'createdAt' | 'updatedAt'>): Promise<InsurancePolicy>;
  getPolicyById(id: string): Promise<InsurancePolicy | null>;
  getPolicyByNumber(policyNumber: string): Promise<InsurancePolicy | null>;
  getPoliciesByUserId(userId: string): Promise<InsurancePolicy[]>;
  getPoliciesByTripId(tripId: string): Promise<InsurancePolicy[]>;
  updatePolicy(policy: InsurancePolicy): Promise<InsurancePolicy>;
  cancelPolicy(id: string): Promise<boolean>;
  getAvailableCoverageTypes(tripId: string): Promise<CoverageType[]>;
  calculatePremium(tripId: string, coverageType: CoverageType, travelers: string[]): Promise<number>;
}