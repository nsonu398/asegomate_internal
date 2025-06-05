// app/presentation/contexts/PolicyFilterContext.tsx
import { PolicyPlan } from '@/app/core/domain/entities/PolicyPlan';
import React, { createContext, ReactNode, useCallback, useContext, useMemo, useState } from 'react';
import { usePolicy } from './PolicyContext';

export interface PolicyFilters {
  selectedInsurers: string[];
  selectedSumInsured: string[];
  selectedPlans: string[];
}

interface FilterOptions {
  insurers: string[];
  sumInsured: string[];
  plans: string[];
}

interface PolicyFilterContextType {
  filters: PolicyFilters;
  filterOptions: FilterOptions;
  filteredPlans: PolicyPlan[];
  
  // Actions
  setSelectedInsurers: (insurers: string[]) => void;
  setSelectedSumInsured: (sumInsured: string[]) => void;
  setSelectedPlans: (plans: string[]) => void;
  clearAllFilters: () => void;
  updateFilters: (newFilters: Partial<PolicyFilters>) => void;
  
  // Helper functions
  isFilterActive: () => boolean;
  getFilterCount: () => number;
}

const PolicyFilterContext = createContext<PolicyFilterContextType | undefined>(undefined);

interface PolicyFilterProviderProps {
  children: ReactNode;
}

export const PolicyFilterProvider: React.FC<PolicyFilterProviderProps> = ({
  children,
}) => {
  const { availablePlans } = usePolicy();
  
  const [filters, setFilters] = useState<PolicyFilters>({
    selectedInsurers: [],
    selectedSumInsured: [],
    selectedPlans: [],
  });

  // Helper functions defined with useCallback to ensure they're stable
  const isFilterActive = useCallback((): boolean => {
    return (
      filters.selectedInsurers.length > 0 ||
      filters.selectedSumInsured.length > 0 ||
      filters.selectedPlans.length > 0
    );
  }, [filters]);

  const getFilterCount = useCallback((): number => {
    return (
      filters.selectedInsurers.length +
      filters.selectedSumInsured.length +
      filters.selectedPlans.length
    );
  }, [filters]);

  // Generate filter options dynamically from available plans
  const filterOptions: FilterOptions = useMemo(() => {
    if (!availablePlans || availablePlans.length === 0) {
      return {
        insurers: [],
        sumInsured: [],
        plans: [],
      };
    }

    // Filter out undefined/null values and ensure we get string arrays
    const insurers = [...new Set(
      availablePlans
        .map(plan => plan.insurerName)
        .filter((name): name is string => Boolean(name))
    )];
    
    const sumInsured = [...new Set(
      availablePlans
        .map(plan => plan.sumInsured)
        .filter((sum): sum is string => Boolean(sum))
    )];
    
    const plans = [...new Set(
      availablePlans
        .map(plan => plan.displayName || plan.name)
        .filter((name): name is string => Boolean(name))
    )];

    return {
      insurers: insurers.sort(),
      sumInsured: sumInsured.sort(),
      plans: plans.sort(),
    };
  }, [availablePlans]);

  // Apply filters to plans
  const filteredPlans: PolicyPlan[] = useMemo(() => {
    if (!availablePlans || availablePlans.length === 0) {
      return [];
    }

    // Use the current filters state directly instead of calling isFilterActive
    const hasActiveFilters = (
      filters.selectedInsurers.length > 0 ||
      filters.selectedSumInsured.length > 0 ||
      filters.selectedPlans.length > 0
    );

    if (!hasActiveFilters) {
      return availablePlans;
    }

    return availablePlans.filter(plan => {
      // Filter by insurer
      if (filters.selectedInsurers.length > 0) {
        if (!plan.insurerName || !filters.selectedInsurers.includes(plan.insurerName)) {
          return false;
        }
      }

      // Filter by sum insured
      if (filters.selectedSumInsured.length > 0) {
        if (!plan.sumInsured || !filters.selectedSumInsured.includes(plan.sumInsured)) {
          return false;
        }
      }

      // Filter by plan name
      if (filters.selectedPlans.length > 0) {
        const planName = plan.displayName || plan.name;
        if (!planName || !filters.selectedPlans.includes(planName)) {
          return false;
        }
      }

      return true;
    });
  }, [availablePlans, filters]);

  // Action functions
  const setSelectedInsurers = useCallback((insurers: string[]) => {
    setFilters(prev => ({ ...prev, selectedInsurers: insurers }));
  }, []);

  const setSelectedSumInsured = useCallback((sumInsured: string[]) => {
    setFilters(prev => ({ ...prev, selectedSumInsured: sumInsured }));
  }, []);

  const setSelectedPlans = useCallback((plans: string[]) => {
    setFilters(prev => ({ ...prev, selectedPlans: plans }));
  }, []);

  const clearAllFilters = useCallback(() => {
    setFilters({
      selectedInsurers: [],
      selectedSumInsured: [],
      selectedPlans: [],
    });
  }, []);

  const updateFilters = useCallback((newFilters: Partial<PolicyFilters>) => {
    setFilters(prev => ({ ...prev, ...newFilters }));
  }, []);

  const contextValue: PolicyFilterContextType = useMemo(() => ({
    filters,
    filterOptions,
    filteredPlans,
    setSelectedInsurers,
    setSelectedSumInsured,
    setSelectedPlans,
    clearAllFilters,
    updateFilters,
    isFilterActive,
    getFilterCount,
  }), [
    filters,
    filterOptions,
    filteredPlans,
    setSelectedInsurers,
    setSelectedSumInsured,
    setSelectedPlans,
    clearAllFilters,
    updateFilters,
    isFilterActive,
    getFilterCount,
  ]);

  return (
    <PolicyFilterContext.Provider value={contextValue}>
      {children}
    </PolicyFilterContext.Provider>
  );
};

export const usePolicyFilter = (): PolicyFilterContextType => {
  const context = useContext(PolicyFilterContext);
  if (context === undefined) {
    throw new Error('usePolicyFilter must be used within a PolicyFilterProvider');
  }
  return context;
};