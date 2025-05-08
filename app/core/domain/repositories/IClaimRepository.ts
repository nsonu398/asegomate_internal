// src/core/domain/repositories/IClaimRepository.ts
import { Claim, Document } from '../entities/Claim';

export interface IClaimRepository {
  createClaim(claim: Omit<Claim, 'id' | 'claimNumber' | 'submittedAt' | 'updatedAt'>): Promise<Claim>;
  getClaimById(id: string): Promise<Claim | null>;
  getClaimByNumber(claimNumber: string): Promise<Claim | null>;
  getClaimsByUserId(userId: string): Promise<Claim[]>;
  getClaimsByPolicyId(policyId: string): Promise<Claim[]>;
  updateClaim(claim: Claim): Promise<Claim>;
  uploadDocument(claimId: string, document: Omit<Document, 'id' | 'uploadedAt'>): Promise<Document>;
  deleteDocument(claimId: string, documentId: string): Promise<boolean>;
}