// app/core/domain/repositories/IPolicyPlanRepository.ts
import { ChoosePlanRequest, ChoosePlanResponse } from '../entities/PolicyPlan';

export interface IPolicyPlanRepository {
  getChoosePlan(request: ChoosePlanRequest): Promise<ChoosePlanResponse>;
}