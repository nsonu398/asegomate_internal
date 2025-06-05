// app/core/domain/entities/PolicyPlan.ts

export interface AgePremium {
  age: number;
  premium: number;
}

export interface Coverage {
  id: string;
  name: string;
  minAmount: string;
  maxAmount: string;
  currency: string;
  type: string;
  deductibles: string;
  coverageGroupData: string;
  coverageCompareData: string;
}

export interface VasProduct {
  id: string;
  name: string;
  shortName?: string;
  displayName: string;
  costAmount: string;
  sellingAmount: string;
  terms?: string;
  productCategory: string;
  providerId: string;
}

export interface PolicyPlan {
  id: string;
  name: string;
  displayName: string;
  shortName: string;
  type: string;
  sumInsured: string;
  logoFilePath: string;
  productCategory: string;
  planSubCategory: string;
  asegoRecomended: boolean;
  bestSellingPlan: boolean;
  protectionPercentage?: number;
  agePremiums: AgePremium[];
  coverages: Coverage[];
  riders: any[];
  assistantServices: string;
  vasProductList: VasProduct[];
  
  // Added for UI purposes
  isSelected?: boolean;
  addOns?: number;
  insurerId?: string;
  insurerName?: string;
  insurerLogoPath?: string;
}

export interface Insurer {
  insurerId: string;
  insurerName: string;
  insurerLogoPath?: string;
  termsAndConditions?: string;
  plans: PolicyPlan[];
}

export interface ChoosePlanRequest {
  duration: number;
  age: number;
  category: string;
  partnerId?: string;
}

// API Response is directly an array of insurers
export type ChoosePlanApiResponse = Insurer[];

export interface ChoosePlanResponse {
  insurers: Insurer[];
  allPlans: PolicyPlan[]; // Flattened list of all plans for easy access
  success: boolean;
  message?: string;
  error?: string;
}