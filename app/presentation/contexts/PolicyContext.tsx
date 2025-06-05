// app/presentation/contexts/PolicyContext.tsx
import PolicyPlanRepository from '@/app/core/data/repository/PolicyPlanRepository';
import { ChoosePlanRequest, PolicyPlan } from '@/app/core/domain/entities/PolicyPlan';
import React, { createContext, ReactNode, useContext, useState } from 'react';

interface PolicyContextType {
  availablePlans: PolicyPlan[];
  selectedPlans: Record<string, PolicyPlan>; // travellerId -> selected plan
  isLoading: boolean;
  error: string | null;
  
  // Actions
  fetchPlans: (request: ChoosePlanRequest) => Promise<void>;
  selectPlan: (travellerId: string, plan: PolicyPlan) => void;
  clearPlans: () => void;
  setError: (error: string | null) => void;
}

const PolicyContext = createContext<PolicyContextType | undefined>(undefined);

interface PolicyProviderProps {
  children: ReactNode;
}

export const PolicyProvider: React.FC<PolicyProviderProps> = ({ children }) => {
  const [availablePlans, setAvailablePlans] = useState<PolicyPlan[]>([]);
  const [selectedPlans, setSelectedPlans] = useState<Record<string, PolicyPlan>>({});
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchPlans = async (request: ChoosePlanRequest) => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await PolicyPlanRepository.getChoosePlan(request);
      
      if (response.success) {
        setAvailablePlans(response.allPlans);
      } else {
        setError(response.error || 'Failed to fetch plans');
        setAvailablePlans([]);
      }
    } catch (error) {
      setError(error instanceof Error ? error.message : 'Failed to fetch plans');
      setAvailablePlans([]);
    } finally {
      setIsLoading(false);
    }
  };

  const selectPlan = (travellerId: string, plan: PolicyPlan) => {
    setSelectedPlans(prev => ({
      ...prev,
      [travellerId]: plan,
    }));
  };

  const clearPlans = () => {
    setAvailablePlans([]);
    setSelectedPlans({});
    setError(null);
  };

  const contextValue: PolicyContextType = {
    availablePlans,
    selectedPlans,
    isLoading,
    error,
    fetchPlans,
    selectPlan,
    clearPlans,
    setError,
  };

  return (
    <PolicyContext.Provider value={contextValue}>
      {children}
    </PolicyContext.Provider>
  );
};

export const usePolicy = (): PolicyContextType => {
  const context = useContext(PolicyContext);
  if (context === undefined) {
    throw new Error('usePolicy must be used within a PolicyProvider');
  }
  return context;
};