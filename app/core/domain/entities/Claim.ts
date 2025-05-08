// src/core/domain/entities/Claim.ts
export type ClaimStatus = 'submitted' | 'inReview' | 'additionalInfoRequired' | 'approved' | 'partiallyApproved' | 'rejected' | 'closed';
export type ClaimType = 'medical' | 'cancellation' | 'delay' | 'baggage' | 'personalLiability' | 'other';

export interface Document {
  id: string;
  type: string;
  name: string;
  url: string;
  uploadedAt: string;
}

export interface Claim {
  id: string;
  policyId: string;
  userId: string;
  claimNumber: string;
  type: ClaimType;
  status: ClaimStatus;
  incidentDate: string;
  incidentDescription: string;
  incidentLocation?: string;
  claimAmount: number;
  approvedAmount?: number;
  documents: Document[];
  submittedAt: string;
  updatedAt: string;
  resolvedAt?: string;
  paymentDetails?: {
    method?: string;
    status?: string;
    processedAt?: string;
  };
}