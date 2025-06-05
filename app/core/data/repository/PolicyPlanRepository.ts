// app/core/data/repository/PolicyPlanRepository.ts
import { API_ENDPOINTS } from '@/app/constants/api';
import {
  ChoosePlanApiResponse,
  ChoosePlanRequest,
  ChoosePlanResponse,
  Insurer,
  PolicyPlan
} from '@/app/core/domain/entities/PolicyPlan';
import { IPolicyPlanRepository } from '@/app/core/domain/repositories/IPolicyPlanRepository';
import apiClient from '../datasources/remote/ApiClient';

export class PolicyPlanRepository implements IPolicyPlanRepository {
  private static instance: PolicyPlanRepository;

  private constructor() {}

  public static getInstance(): PolicyPlanRepository {
    if (!PolicyPlanRepository.instance) {
      PolicyPlanRepository.instance = new PolicyPlanRepository();
    }
    return PolicyPlanRepository.instance;
  }

  async getChoosePlan(request: ChoosePlanRequest): Promise<ChoosePlanResponse> {
    try {
      const queryParams = new URLSearchParams({
        duration: request.duration.toString(),
        age: request.age.toString(),
        category: request.category,
        ...(request.partnerId && { partnerId: request.partnerId }),
      });

      const response = await apiClient.get<ChoosePlanApiResponse>(
        `${API_ENDPOINTS.POLICY.CHOOSE_PLAN}?${queryParams.toString()}`,
        true
      );

      if (response.success && response.data) {
        const insurers = response.data; // Direct array of insurers
        
        // Flatten all plans from all insurers for easy access
        const allPlans = insurers.reduce((acc: PolicyPlan[], insurer: Insurer) => {
          const plansWithInsurerInfo = insurer.plans.map(plan => ({
            ...plan,
            // Add insurer info to each plan for reference
            insurerId: insurer.insurerId,
            insurerName: insurer.insurerName,
            insurerLogoPath: insurer.insurerLogoPath,
            isSelected: false,
            addOns: 0,
          }));
          
          return acc.concat(plansWithInsurerInfo);
        }, []);

        return {
          insurers,
          allPlans,
          success: true,
        };
      }

      return {
        insurers: [],
        allPlans: [],
        success: false,
        error: response.error || 'Failed to fetch plans',
      };
    } catch (error) {
      console.error('Error fetching plans:', error);
      return {
        insurers: [],
        allPlans: [],
        success: false,
        error: error instanceof Error ? error.message : 'Failed to fetch plans',
      };
    }
  }
}

export default PolicyPlanRepository.getInstance();