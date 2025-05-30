// src/presentation/contexts/MasterDataContext.tsx
import { CountryRepository } from '@/app/core/data/repository/CountryRepository';
import { MasterSelectRepository } from '@/app/core/data/repository/MasterSelectRepository';
import { Country } from '@/app/core/domain/entities/Country';
import { GeographicalArea } from '@/app/core/domain/entities/GeographicalArea';
import React, { createContext, useContext, useEffect, useState } from 'react';
import { useAuth } from './AuthContext';


interface MasterDataContextType {
  countries: Country[];
  regions: GeographicalArea[];
  isLoading: boolean;
  error: string | null;
  refreshData: () => Promise<void>;
}

const MasterDataContext = createContext<MasterDataContextType | undefined>(undefined);

interface MasterDataProviderProps {
  children: React.ReactNode;
}

export const MasterDataProvider: React.FC<MasterDataProviderProps> = ({ children }) => {
  const { isAuthenticated, token } = useAuth();
  const [countries, setCountries] = useState<Country[]>([]);
  const [regions, setRegions] = useState<GeographicalArea[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const countryRepository = CountryRepository.getInstance();
  const masterSelectRepository = MasterSelectRepository.getInstance();

  const fetchMasterData = async () => {
    if (!isAuthenticated || !token) return;

    setIsLoading(true);
    setError(null);

    try {
      const [countriesResponse, regionsResponse] = await Promise.all([
        countryRepository.fetchCountries(),
        masterSelectRepository.fetchGeographicalAreas()
      ]);

      if (countriesResponse.success) {
        setCountries(countriesResponse.countries);
      } else {
        setError(countriesResponse.error || 'Failed to fetch countries');
      }

      if (regionsResponse.success) {
        setRegions(regionsResponse.areas);
      } else {
        setError(regionsResponse.error || 'Failed to fetch regions');
      }
    } catch (error) {
      setError(error instanceof Error ? error.message : 'Failed to fetch master data');
    } finally {
      setIsLoading(false);
    }
  };

  const refreshData = async () => {
    await fetchMasterData();
  };

  useEffect(() => {
    if (isAuthenticated && token) {
      fetchMasterData();
    }
  }, [isAuthenticated, token]);

  const contextValue: MasterDataContextType = {
    countries,
    regions,
    isLoading,
    error,
    refreshData,
  };

  return (
    <MasterDataContext.Provider value={contextValue}>
      {children}
    </MasterDataContext.Provider>
  );
};

export const useMasterData = (): MasterDataContextType => {
  const context = useContext(MasterDataContext);
  if (context === undefined) {
    throw new Error('useMasterData must be used within a MasterDataProvider');
  }
  return context;
};